import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AccountMenu from "../components/AccountMenu";
import AppNavigation from "../components/AppNavigation";
import ConfirmDialog from "../components/ConfirmDialog";
import FilterBar from "../components/FilterBar";
import api, { getApiError } from "../services/api";
import { capitalizeWords } from "../utils/capitalizeWords";
import { formatCurrency } from "../utils/formatCurrency";
import { MapPin, Plus, Check, Trash2, X, Store, Radio } from "lucide-react";

function Locations() {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [newLocationName, setNewLocationName] = useState("");
    const [locationToDelete, setLocationToDelete] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );
    const [filterMode, setFilterMode] = useState("month");
    const [selectedDateFrom, setSelectedDateFrom] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [selectedDateTo, setSelectedDateTo] = useState(
        new Date().toISOString().split("T")[0]
    );

    const user = JSON.parse(
        localStorage.getItem("authUser") || "null"
    );

    const invalidPeriod =
        filterMode === "period" &&
        selectedDateFrom > selectedDateTo;

    async function fetchLocations() {
        if (invalidPeriod) {
            return;
        }

        const query =
            filterMode === "day"
                ? `date=${selectedDate}`
                : filterMode === "month"
                ? `month=${selectedMonth}`
                : `date_from=${selectedDateFrom}&date_to=${selectedDateTo}`;

        try {
            const response = await api.get(`locations/?${query}`);
            setLocations(response.data);
        } catch (err) {
            console.error(err);
            setError(getApiError(err, "No se pudieron cargar los lugares."));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchLocations();
    }, [
        selectedDate,
        selectedMonth,
        selectedDateFrom,
        selectedDateTo,
        filterMode,
    ]);

    async function handleActivate(id, name) {
        try {
            await api.post(`locations/${id}/activate/`);
            toast.success(`Lugar activo: ${capitalizeWords(name)}`);
            setLocations((prev) =>
                prev.map((loc) => ({
                    ...loc,
                    is_active: loc.id === id,
                }))
            );
        } catch (err) {
            console.error(err);
            toast.error(getApiError(err, "No se pudo activar el lugar."));
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        const trimmed = newLocationName.trim();
        if (!trimmed) return;

        setIsSubmitting(true);
        try {
            const response = await api.post("locations/", {
                name: trimmed,
            });
            toast.success("Lugar creado.");
            setNewLocationName("");
            setIsCreating(false);
            fetchLocations();
        } catch (err) {
            console.error(err);
            toast.error(getApiError(err, "No se pudo crear el lugar."));
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete(id) {
        try {
            await api.delete(`locations/${id}/`);
            toast.success("Lugar eliminado.");
            setLocations((prev) => prev.filter((loc) => loc.id !== id));
        } catch (err) {
            console.error(err);
            toast.error(getApiError(err, "No se pudo eliminar el lugar."));
        }
    }

    const activeLocation = locations.find((loc) => loc.is_active);

    return (
        <div className="min-h-screen px-4 pt-4 pb-28">
            <div className="mx-auto max-w-lg space-y-5">

                {/* Top Header */}
                <header className="flex items-center justify-between gap-3 pt-safe">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20 animate-float">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                                Lugares
                            </h1>
                            <p className="text-xs text-[var(--text-secondary)]">
                                Puntos de venta y ferias
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsCreating(true)}
                            className="
                                flex
                                items-center
                                gap-1.5
                                rounded-xl
                                bg-[var(--primary)]
                                px-3
                                py-2
                                text-xs
                                font-bold
                                text-white
                                shadow-sm
                                transition
                                active-press
                                hover:bg-[var(--primary-hover)]
                            "
                        >
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Nuevo</span>
                        </button>
                        <AccountMenu user={user} />
                    </div>
                </header>

                {/* Active Spot Banner (Set & Forget Status) */}
                {activeLocation && (
                    <div className="flex items-center justify-between rounded-2xl border border-[var(--primary)]/30 bg-[var(--surface-accent)]/80 p-3.5 shadow-sm">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
                                <Radio className="w-3.5 h-3.5 animate-pulse" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] block">
                                    Punto de Venta Activo
                                </span>
                                <p className="text-sm font-extrabold text-[var(--text-primary)]">
                                    {capitalizeWords(activeLocation.name)}
                                </p>
                            </div>
                        </div>
                        <span className="text-[11px] text-[var(--text-secondary)] font-medium">
                            Auto-asignado a nuevas ventas
                        </span>
                    </div>
                )}

                {/* Filter Bar */}
                <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 shadow-sm">
                    <FilterBar
                        filterMode={filterMode}
                        setFilterMode={setFilterMode}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        selectedDateFrom={selectedDateFrom}
                        setSelectedDateFrom={setSelectedDateFrom}
                        selectedDateTo={selectedDateTo}
                        setSelectedDateTo={setSelectedDateTo}
                        invalidPeriod={invalidPeriod}
                    />
                </section>

                {/* Create Location Modal */}
                {isCreating && (
                    <div className="rounded-2xl border border-[var(--primary)] bg-[var(--surface)] p-4 shadow-md space-y-3 animate-pop-in">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                                <Plus className="w-4 h-4 text-[var(--primary)]" />
                                <span>Nuevo Lugar o Punto de Venta</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Ej: Feria Palermo, Showroom, Local Centro..."
                                value={newLocationName}
                                onChange={(e) => setNewLocationName(e.target.value)}
                                autoFocus
                                required
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[var(--border)]
                                    bg-[var(--background)]
                                    px-3.5
                                    py-2.5
                                    text-xs
                                    font-medium
                                    text-[var(--text-primary)]
                                    outline-none
                                    focus:border-[var(--primary)]
                                    focus:ring-2
                                    focus:ring-[var(--primary)]/20
                                "
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-accent)]"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newLocationName.trim()}
                                    className="rounded-xl bg-[var(--primary)] px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[var(--primary-hover)] disabled:opacity-50"
                                >
                                    {isSubmitting ? "Guardando..." : "Crear Lugar"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Loading / Error / Empty States */}
                {isLoading && (
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                        <p className="text-xs font-semibold text-[var(--text-secondary)]">
                            Cargando lugares...
                        </p>
                    </div>
                )}

                {!isLoading && error && (
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
                        <p className="text-xs font-semibold text-[var(--danger)]">
                            {error}
                        </p>
                    </div>
                )}

                {!isLoading && !error && locations.length === 0 && (
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center space-y-3">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-accent)] text-[var(--text-secondary)]">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-[var(--text-primary)]">
                                No tienes lugares registrados
                            </p>
                            <p className="mt-1 text-xs text-[var(--text-secondary)]">
                                Registrá ferias, puestos o locales para saber dónde vendiste más.
                            </p>
                        </div>
                    </div>
                )}

                {/* Locations List */}
                {!isLoading && !error && locations.length > 0 && (
                    <div className="space-y-3">
                        {locations.map((loc) => (
                            <div
                                key={loc.id}
                                className={`
                                    rounded-2xl
                                    border
                                    p-4
                                    shadow-sm
                                    space-y-3
                                    transition-all
                                    ${
                                        loc.is_active
                                            ? "border-[var(--primary)] bg-[var(--surface)] ring-1 ring-[var(--primary)]/20"
                                            : "border-[var(--border)] bg-[var(--surface)]"
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${loc.is_active ? "bg-[var(--primary)] text-white" : "bg-[var(--surface-accent)] text-[var(--text-secondary)]"}`}>
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-bold text-[var(--text-primary)]">
                                                {capitalizeWords(loc.name)}
                                            </h2>
                                            {loc.is_active && (
                                                <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider">
                                                    ● Lugar Actual
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {!loc.is_active ? (
                                            <button
                                                type="button"
                                                onClick={() => handleActivate(loc.id, loc.name)}
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-[var(--border)]
                                                    bg-[var(--surface-accent)]
                                                    px-3
                                                    py-1.5
                                                    text-xs
                                                    font-bold
                                                    text-[var(--text-primary)]
                                                    transition
                                                    active-press
                                                    hover:border-[var(--primary)]
                                                    hover:text-[var(--primary)]
                                                "
                                            >
                                                Activar
                                            </button>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/15 px-2.5 py-1 text-xs font-bold text-[var(--primary)]">
                                                <Check className="w-3 h-3 stroke-[3]" />
                                                Activo
                                            </span>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => setLocationToDelete(loc.id)}
                                            className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger)] transition active-press"
                                            title="Eliminar lugar"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Metrics row */}
                                <div className="grid grid-cols-3 gap-2 border-t border-[var(--border)] pt-2.5 text-center text-xs">
                                    <div className="rounded-xl bg-[var(--surface-accent)]/50 p-2">
                                        <p className="text-[var(--text-secondary)] text-[10px] uppercase font-bold">Ventas</p>
                                        <p className="mt-0.5 font-bold text-[var(--text-primary)]">{loc.sales_count || 0}</p>
                                    </div>

                                    <div className="rounded-xl bg-[var(--surface-accent)]/50 p-2">
                                        <p className="text-[var(--text-secondary)] text-[10px] uppercase font-bold">Ingresos</p>
                                        <p className="mt-0.5 font-bold text-[var(--text-primary)]">{formatCurrency(loc.gross || 0)}</p>
                                    </div>

                                    <div className="rounded-xl bg-[var(--surface-accent)]/50 p-2">
                                        <p className="text-[var(--text-secondary)] text-[10px] uppercase font-bold">Ganancia</p>
                                        <p className="mt-0.5 font-bold text-[var(--success)]">{formatCurrency(loc.earnings || 0)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* Bottom Navigation */}
            <AppNavigation />

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={locationToDelete !== null}
                title="Eliminar lugar"
                message="¿Estás seguro de que deseas eliminar este lugar? Las ventas asociadas se conservarán."
                onCancel={() => setLocationToDelete(null)}
                onConfirm={() => {
                    handleDelete(locationToDelete);
                    setLocationToDelete(null);
                }}
            />
        </div>
    );
}

export default Locations;

