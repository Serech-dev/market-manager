import { useState, useRef, useEffect } from "react";
import api, { getApiError } from "../services/api";
import toast from "react-hot-toast";
import { capitalizeWords } from "../utils/capitalizeWords";
import { Tag, Plus, X, Check, ChevronDown, Loader2 } from "lucide-react";

function CategoryCombobox({
    selectedCategoryId,
    onSelectCategory,
    categories: initialCategories,
    onCategoryCreated,
    placeholder = "Buscar o crear categoría...",
    className = "",
}) {
    const [categories, setCategories] = useState(initialCategories || []);
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // Sync categories if passed from parent
    useEffect(() => {
        if (initialCategories) {
            setCategories(initialCategories);
        } else {
            fetchCategories();
        }
    }, [initialCategories]);

    async function fetchCategories() {
        try {
            const res = await api.get("categories/");
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories", err);
        }
    }

    // Sync query text with selected category
    useEffect(() => {
        if (selectedCategoryId) {
            const found = categories.find((c) => String(c.id) === String(selectedCategoryId));
            if (found) {
                setQuery(capitalizeWords(found.name));
            }
        } else if (!isOpen) {
            setQuery("");
        }
    }, [selectedCategoryId, categories, isOpen]);

    // Click outside listener
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                // Reset query to selected category name if closed without selecting
                if (selectedCategoryId) {
                    const found = categories.find((c) => String(c.id) === String(selectedCategoryId));
                    setQuery(found ? capitalizeWords(found.name) : "");
                } else {
                    setQuery("");
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedCategoryId, categories]);

    const normalizedQuery = query.trim().toLowerCase();

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(normalizedQuery)
    );

    const exactMatch = categories.find(
        (c) => c.name.toLowerCase() === normalizedQuery
    );

    function handleInputChange(e) {
        setQuery(e.target.value);
        setIsOpen(true);
    }

    function handleSelect(category) {
        if (!category) {
            onSelectCategory(null, "");
            setQuery("");
        } else {
            onSelectCategory(category.id, category.name);
            setQuery(capitalizeWords(category.name));
        }
        setIsOpen(false);
    }

    function handleClear(e) {
        e.stopPropagation();
        onSelectCategory(null, "");
        setQuery("");
        setIsOpen(false);
    }

    async function handleCreateNew(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const trimmed = query.trim();
        if (!trimmed || isCreating) return;

        // If exact match already exists, just select it
        if (exactMatch) {
            handleSelect(exactMatch);
            return;
        }

        setIsCreating(true);
        try {
            const response = await api.post("categories/", { name: trimmed });
            const newCat = response.data;
            toast.success(`Categoría "${capitalizeWords(newCat.name)}" creada.`);
            setCategories((prev) => [...prev, newCat]);
            if (onCategoryCreated) {
                onCategoryCreated(newCat);
            }
            onSelectCategory(newCat.id, newCat.name);
            setQuery(capitalizeWords(newCat.name));
            setIsOpen(false);
        } catch (err) {
            toast.error(getApiError(err, "No se pudo crear la categoría."));
        } finally {
            setIsCreating(false);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (exactMatch) {
                handleSelect(exactMatch);
            } else if (filteredCategories.length === 1 && normalizedQuery) {
                handleSelect(filteredCategories[0]);
            } else if (query.trim()) {
                handleCreateNew();
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
        }
    }

    return (
        <div ref={containerRef} className={`relative w-full ${className}`}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoComplete="off"
                    className="
                        w-full
                        rounded-xl
                        border
                        border-[var(--border)]
                        bg-[var(--background)]
                        py-2.5
                        pl-3.5
                        pr-9
                        text-xs
                        font-semibold
                        text-[var(--text-primary)]
                        outline-none
                        transition
                        placeholder:text-[var(--text-secondary)]/70
                        focus:border-[var(--primary)]
                        focus:ring-2
                        focus:ring-[var(--primary)]/20
                    "
                />

                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            title="Quitar categoría"
                            className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-accent)] transition"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen((prev) => !prev);
                            if (!isOpen) inputRef.current?.focus();
                        }}
                        className="p-0.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Suggestions & Create Dropdown */}
            {isOpen && (
                <div
                    className="
                        absolute
                        left-0
                        right-0
                        top-full
                        z-50
                        mt-1.5
                        max-h-48
                        overflow-y-auto
                        custom-scrollbar
                        rounded-2xl
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        p-1.5
                        shadow-xl
                        animate-pop-in
                    "
                >
                    {/* Option: Sin categoría */}
                    <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelect(null)}
                        className={`
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-xl
                            px-3
                            py-2
                            text-left
                            text-xs
                            font-medium
                            transition
                            ${
                                !selectedCategoryId
                                    ? "bg-[var(--surface-accent)] text-[var(--text-primary)] font-bold"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-accent)] hover:text-[var(--text-primary)]"
                            }
                        `}
                    >
                        <span>Sin categoría</span>
                        {!selectedCategoryId && <Check className="w-3.5 h-3.5 text-[var(--primary)]" />}
                    </button>

                    {/* Filtered existing categories */}
                    {filteredCategories.map((cat) => {
                        const isSelected = String(cat.id) === String(selectedCategoryId);
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleSelect(cat)}
                                className={`
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-xl
                                    px-3
                                    py-2
                                    text-left
                                    text-xs
                                    font-medium
                                    transition
                                    ${
                                        isSelected
                                            ? "bg-[var(--primary)] text-white font-bold shadow-2xs"
                                            : "text-[var(--text-primary)] hover:bg-[var(--surface-accent)]"
                                    }
                                `}
                            >
                                <span className="flex items-center gap-2 truncate">
                                    <Tag className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-[var(--text-secondary)]"}`} />
                                    <span className="truncate">{capitalizeWords(cat.name)}</span>
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                            </button>
                        );
                    })}

                    {/* Create New Category Action */}
                    {normalizedQuery && !exactMatch && (
                        <div className="border-t border-[var(--border)] mt-1 pt-1">
                            <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={handleCreateNew}
                                disabled={isCreating}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    gap-2
                                    rounded-xl
                                    bg-[var(--surface-accent)]
                                    px-3
                                    py-2
                                    text-left
                                    text-xs
                                    font-bold
                                    text-[var(--primary)]
                                    transition
                                    active-press
                                    hover:bg-[var(--primary)]
                                    hover:text-white
                                "
                            >
                                <span className="flex items-center gap-1.5 truncate">
                                    {isCreating ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                    )}
                                    <span className="truncate">Crear categoría "{capitalizeWords(query.trim())}"</span>
                                </span>
                                <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider opacity-80">
                                    + Crear
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CategoryCombobox;
