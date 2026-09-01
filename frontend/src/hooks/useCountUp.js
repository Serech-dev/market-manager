import { useState, useEffect, useRef } from "react";

/**
 * Hook to animate numbers climbing up.
 * Supports:
 *  - Delta-only counting for Dashboard (cached in sessionStorage, only animates newly added sales)
 *  - Celebratory full count-up from zero for Day Close modal (startFromZero: true, slower duration)
 * 
 * @param {number} targetValue - The target number.
 * @param {Object|number} options - Options object or duration number.
 * @returns {{ displayValue: number, isBumping: boolean }}
 */
export function useCountUp(targetValue, options = {}) {
    const opts = typeof options === "number" ? { duration: options } : options;
    const {
        duration = 700,
        startFromZero = false,
        cacheKey = null,
        isLoading = false,
    } = opts;

    const numericTarget = Number(targetValue) || 0;

    // Helper to get initial value
    const getInitialValue = () => {
        if (startFromZero) return 0;
        if (cacheKey) {
            try {
                const cached = sessionStorage.getItem(cacheKey);
                if (cached !== null && !isNaN(Number(cached))) {
                    return Number(cached);
                }
            } catch {}
        }
        return numericTarget;
    };

    const [displayValue, setDisplayValue] = useState(getInitialValue);
    const prevValueRef = useRef(getInitialValue());
    const hasInitializedRef = useRef(false);
    const [isBumping, setIsBumping] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        let startValue = prevValueRef.current;
        const endValue = numericTarget;

        // Modal fanfare mode (count up from 0 on open)
        if (startFromZero) {
            startValue = 0;
        } else if (!hasInitializedRef.current) {
            hasInitializedRef.current = true;
            if (cacheKey) {
                try {
                    const cached = sessionStorage.getItem(cacheKey);
                    if (cached === null) {
                        sessionStorage.setItem(cacheKey, String(numericTarget));
                        prevValueRef.current = numericTarget;
                        setDisplayValue(numericTarget);
                        return;
                    } else {
                        startValue = Number(cached);
                    }
                } catch {
                    prevValueRef.current = numericTarget;
                    setDisplayValue(numericTarget);
                    return;
                }
            } else {
                prevValueRef.current = numericTarget;
                setDisplayValue(numericTarget);
                return;
            }
        }

        if (cacheKey) {
            try {
                sessionStorage.setItem(cacheKey, String(endValue));
            } catch {}
        }

        if (startValue === endValue && !startFromZero) {
            return;
        }

        setIsBumping(true);
        const bumpTimeout = setTimeout(() => setIsBumping(false), Math.min(duration, 600));

        let startTime = null;
        let animationFrameId;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth cubic ease-out curve: 1 - (1 - t)^3
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startValue + (endValue - startValue) * easeOut);

            setDisplayValue(current);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setDisplayValue(endValue);
                prevValueRef.current = endValue;
            }
        }

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(bumpTimeout);
        };
    }, [numericTarget, isLoading, startFromZero, duration, cacheKey]);

    return { displayValue, isBumping };
}
