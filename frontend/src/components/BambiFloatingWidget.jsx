import { useState, useEffect, useRef } from "react";
import { isBambiEnabled, getRandomBambiMoment, BAMBI_MOMENTS } from "../utils/bambiConfig";
import { playPopSound } from "../utils/soundEffects";

/**
 * Bambi Bouncing Screensaver Companion Widget
 * - Bounces continuously around the screen edges like a DVD screensaver
 * - Draggable & throwable with ricochet physics and momentum
 * - Tap to pop sound & cycle funny face cutouts (no text bubble)
 * - Toggleable from Account Menu
 */
function BambiFloatingWidget() {
    const [enabled, setEnabled] = useState(() => isBambiEnabled());
    const [moment, setMoment] = useState(() => getRandomBambiMoment("pokes"));
    const [isPoking, setIsPoking] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [rotation, setRotation] = useState(0);

    // Widget dimensions helper
    function getWidgetDimensions() {
        if (typeof window === "undefined") return { width: 130, height: 130 };
        const isDesktop = window.innerWidth >= 640;
        const size = isDesktop ? 160 : 130;
        return { width: size, height: size };
    }

    // State for visual rendering
    const [pos, setPos] = useState(() => {
        if (typeof window === "undefined") return { x: 50, y: 150 };
        const { width, height } = getWidgetDimensions();
        const startX = Math.min(Math.max(16, (window.innerWidth || 360) - width - 24), (window.innerWidth || 360) - width - 8);
        const startY = Math.min(Math.max(16, (window.innerHeight || 640) - height - 120), (window.innerHeight || 640) - height - 8);
        return { x: startX, y: startY };
    });

    // Refs for real-time high-performance 60/120fps physics loop
    const physicsRef = useRef({
        x: pos.x,
        y: pos.y,
        vx: 1.4,
        vy: 1.1,
        minSpeed: 1.4,
        isDragging: false,
    });

    const dragRef = useRef({
        startX: 0,
        startY: 0,
        elemStartX: 0,
        elemStartY: 0,
        lastX: 0,
        lastY: 0,
        lastTime: 0,
        vx: 0,
        vy: 0,
        hasMoved: false,
    });

    // Listen for visibility changes from AccountMenu toggle
    useEffect(() => {
        function syncVisibility() {
            setEnabled(isBambiEnabled());
        }
        window.addEventListener("bambi_visibility_change", syncVisibility);
        window.addEventListener("storage", syncVisibility);
        return () => {
            window.removeEventListener("bambi_visibility_change", syncVisibility);
            window.removeEventListener("storage", syncVisibility);
        };
    }, []);

    // Continuous Bouncing Physics Engine (DVD Screensaver + Inertial Ricochet)
    useEffect(() => {
        if (!enabled) return;

        let animationFrameId;

        function updatePhysics() {
            const physics = physicsRef.current;

            if (!physics.isDragging) {
                const { width, height } = getWidgetDimensions();
                const minX = 8;
                const minY = 8;
                const maxX = Math.max(minX, window.innerWidth - width - 8);
                const maxY = Math.max(minY, window.innerHeight - height - 8);

                // Update position
                physics.x += physics.vx;
                physics.y += physics.vy;

                // Bounce off Horizontal Bounds (Left / Right)
                if (physics.x <= minX) {
                    physics.x = minX;
                    physics.vx = Math.abs(physics.vx);
                } else if (physics.x >= maxX) {
                    physics.x = maxX;
                    physics.vx = -Math.abs(physics.vx);
                }

                // Bounce off Vertical Bounds (Top / Bottom)
                if (physics.y <= minY) {
                    physics.y = minY;
                    physics.vy = Math.abs(physics.vy);
                } else if (physics.y >= maxY) {
                    physics.y = maxY;
                    physics.vy = -Math.abs(physics.vy);
                }

                // Friction deceleration towards cruise speed after a high-velocity throw
                const currentSpeed = Math.hypot(physics.vx, physics.vy);
                if (currentSpeed > physics.minSpeed) {
                    const decel = 0.988;
                    physics.vx *= decel;
                    physics.vy *= decel;
                } else {
                    // Ensure cruising speed is maintained continuously
                    const angle = Math.atan2(physics.vy, physics.vx);
                    physics.vx = Math.cos(angle) * physics.minSpeed;
                    physics.vy = Math.sin(angle) * physics.minSpeed;
                }

                // Subtle tilt according to horizontal speed
                setRotation(Math.min(Math.max(physics.vx * 4, -20), 20));
                setPos({ x: physics.x, y: physics.y });
            }

            animationFrameId = requestAnimationFrame(updatePhysics);
        }

        animationFrameId = requestAnimationFrame(updatePhysics);

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [enabled]);

    // Handle window resize boundary clamping
    useEffect(() => {
        function handleResize() {
            const { width, height } = getWidgetDimensions();
            const minX = 8;
            const minY = 8;
            const maxX = Math.max(minX, window.innerWidth - width - 8);
            const maxY = Math.max(minY, window.innerHeight - height - 8);

            physicsRef.current.x = Math.min(Math.max(minX, physicsRef.current.x), maxX);
            physicsRef.current.y = Math.min(Math.max(minY, physicsRef.current.y), maxY);
            setPos({ x: physicsRef.current.x, y: physicsRef.current.y });
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!enabled || !moment) return null;

    function handlePointerDown(e) {
        e.preventDefault();
        const target = e.currentTarget;
        try {
            target.setPointerCapture(e.pointerId);
        } catch {}

        physicsRef.current.isDragging = true;
        setIsDragging(true);

        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            elemStartX: physicsRef.current.x,
            elemStartY: physicsRef.current.y,
            lastX: e.clientX,
            lastY: e.clientY,
            lastTime: performance.now(),
            vx: 0,
            vy: 0,
            hasMoved: false,
        };
    }

    function handlePointerMove(e) {
        if (!isDragging) return;

        const deltaX = e.clientX - dragRef.current.startX;
        const deltaY = e.clientY - dragRef.current.startY;
        const dist = Math.hypot(deltaX, deltaY);

        if (dist > 6) {
            dragRef.current.hasMoved = true;
        }

        const now = performance.now();
        const dt = Math.max(now - dragRef.current.lastTime, 1);
        const dx = e.clientX - dragRef.current.lastX;
        const dy = e.clientY - dragRef.current.lastY;

        dragRef.current.vx = dx / dt;
        dragRef.current.vy = dy / dt;
        dragRef.current.lastX = e.clientX;
        dragRef.current.lastY = e.clientY;
        dragRef.current.lastTime = now;

        const { width, height } = getWidgetDimensions();
        const nextX = Math.min(Math.max(8, dragRef.current.elemStartX + deltaX), window.innerWidth - width - 8);
        const nextY = Math.min(Math.max(8, dragRef.current.elemStartY + deltaY), window.innerHeight - height - 8);

        physicsRef.current.x = nextX;
        physicsRef.current.y = nextY;
        setPos({ x: nextX, y: nextY });
        setRotation(Math.min(Math.max(dragRef.current.vx * 15, -25), 25));
    }

    function handlePointerUp(e) {
        if (!isDragging) return;
        setIsDragging(false);
        physicsRef.current.isDragging = false;

        const target = e.currentTarget;
        try {
            target.releasePointerCapture(e.pointerId);
        } catch {}

        // If it was a tap / click (user did not drag)
        if (!dragRef.current.hasMoved) {
            triggerPoke();
            return;
        }

        // Throw Momentum Launch
        const launchVx = Math.min(Math.max(dragRef.current.vx * 16, -20), 20);
        const launchVy = Math.min(Math.max(dragRef.current.vy * 16, -20), 20);

        if (Math.hypot(launchVx, launchVy) > 1.2) {
            physicsRef.current.vx = launchVx;
            physicsRef.current.vy = launchVy;
        } else {
            // Keep default bounce direction if released gently
            physicsRef.current.vx = (Math.random() > 0.5 ? 1 : -1) * 1.5;
            physicsRef.current.vy = (Math.random() > 0.5 ? 1 : -1) * 1.2;
        }
    }

    function triggerPoke() {
        playPopSound();
        setIsPoking(true);
        setTimeout(() => setIsPoking(false), 300);

        // Pick next random face cutout
        const candidates = BAMBI_MOMENTS.filter((m) => m.id !== moment.id);
        const nextMoment = candidates[Math.floor(Math.random() * candidates.length)] || moment;
        setMoment(nextMoment);

        // Playful bounce kick in a new direction
        physicsRef.current.vx = (Math.random() > 0.5 ? 1 : -1) * (2.0 + Math.random() * 2.0);
        physicsRef.current.vy = (Math.random() > 0.5 ? 1 : -1) * (1.8 + Math.random() * 2.0);
    }

    return (
        <div
            style={{
                transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
                touchAction: "none",
                willChange: "transform",
            }}
            className="fixed top-0 left-0 z-[70] select-none pointer-events-auto"
        >
            {/* Pure Bouncing Cutout Avatar (No text bubble) */}
            <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                    transform: `rotate(${rotation}deg) scale(${isPoking ? 1.2 : isDragging ? 1.08 : 1})`,
                }}
                className={`
                    relative flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center
                    cursor-grab active:cursor-grabbing transition-transform duration-75 ease-out
                    drop-shadow-[0_14px_28px_rgba(0,0,0,0.4)]
                `}
            >
                <img
                    key={moment.image}
                    src={moment.image}
                    alt="Bambi"
                    draggable={false}
                    className="h-full w-full object-contain pointer-events-none filter drop-shadow-md select-none"
                />
            </div>
        </div>
    );
}

export default BambiFloatingWidget;
