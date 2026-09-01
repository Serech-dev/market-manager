import api, { getApiError } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Store, Mail, Lock, LogIn } from "lucide-react";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await api.post(
                "auth/login/",
                {
                    email,
                    password,
                }
            );

            localStorage.setItem(
                "authToken",
                response.data.token
            );

            localStorage.setItem(
                "authUser",
                JSON.stringify(response.data.user)
            );

            toast.success("¡Sesión iniciada con exito!");
            navigate("/");
        } catch (error) {
            console.error(error);
            toast.error(
                getApiError(
                    error,
                    "No se pudo iniciar sesión. Verifique sus credenciales."
                )
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    return (
        <div className="min-h-screen px-4 py-12 flex items-center justify-center">
            <div className="w-full max-w-sm space-y-6">


                {/* Brand Header */}
                <div className="text-center space-y-2">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--primary)] text-white shadow-xl shadow-[var(--primary)]/30 animate-float">
                        <Store className="w-8 h-8 stroke-[2.2]" />
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
                        Market Manager
                    </h1>
                    <p className="text-xs font-medium text-[var(--text-secondary)]">
                        Tu compañera para ferias y ventas diarias
                    </p>
                </div>

                {/* Login Card */}
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-sm p-6 shadow-sm animate-pop-in">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="email"
                                className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
                            >
                                Email
                            </label>

                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    autoComplete="email"
                                    placeholder="tu@email.com"
                                    required
                                    className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-[var(--border)]
                                        bg-[var(--background)]
                                        py-3
                                        pl-10
                                        pr-4
                                        text-sm
                                        font-medium
                                        text-[var(--text-primary)]
                                        outline-none
                                        transition
                                        focus:border-[var(--primary)]
                                        focus:ring-2
                                        focus:ring-[var(--primary)]/20
                                    "
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="password"
                                className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
                            >
                                Contraseña
                            </label>

                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    required
                                    className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-[var(--border)]
                                        bg-[var(--background)]
                                        py-3
                                        pl-10
                                        pr-4
                                        text-sm
                                        font-medium
                                        text-[var(--text-primary)]
                                        outline-none
                                        transition
                                        focus:border-[var(--primary)]
                                        focus:ring-2
                                        focus:ring-[var(--primary)]/20
                                    "
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-2xl
                                    bg-[var(--primary)]
                                    py-3.5
                                    text-sm
                                    font-bold
                                    text-white
                                    shadow-lg
                                    shadow-[var(--primary)]/25
                                    transition
                                    active-press
                                    hover:bg-[var(--primary-hover)]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                <LogIn className="w-4 h-4" />
                                <span>{isSubmitting ? "Ingresando..." : "Iniciar Sesión"}</span>
                            </button>
                        </div>
                    </form>
                </div>


            </div>
        </div>
    );
}

export default Login;
