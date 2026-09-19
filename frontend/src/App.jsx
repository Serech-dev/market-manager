import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initGlobalSoundListeners } from "./utils/soundEffects";
import { PrivacyProvider } from "./context/PrivacyContext";

import Login from "./pages/Login";
import NewSale from "./pages/NewSale";
import Register from "./pages/Register";
import Products from "./pages/Products";
import EditSale from "./pages/EditSale";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/categories";
import CategoryDetail from "./pages/CategoryDetail";
import Locations from "./pages/Locations";
import NewProduct from "./pages/NewProduct";
import NewCategory from "./pages/NewCategory";
import ProductDetail from "./pages/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import BambiFloatingWidget from "./components/BambiFloatingWidget";

function App() {
    useEffect(() => {
        initGlobalSoundListeners();
    }, []);

    return (
        <PrivacyProvider>
            {/* Ambient Breathing Glow Orbs */}
            <div className="ambient-glow-wrapper" aria-hidden="true">
                <div className="ambient-orb-1" />
                <div className="ambient-orb-2" />
                <div className="ambient-orb-3" />
            </div>

            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 2500,
                    style: {
                        background: "var(--surface)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--border)",
                        borderRadius: "1rem",
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
                        fontSize: "0.8125rem",
                        fontWeight: "600",
                        backdropFilter: "blur(8px)",
                    },
                    success: {
                        iconTheme: {
                            primary: "var(--success)",
                            secondary: "var(--surface)",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "var(--danger)",
                            secondary: "var(--surface)",
                        },
                    },
                }}
            />

            <BrowserRouter>
                {/* Floating Throwable Bambi Companion */}
                <BambiFloatingWidget />

                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/new-sale" element={<NewSale />} />
                        <Route path="/sales/:id/edit" element={<EditSale />} />
                        <Route path="/products" element={<Products />} />
                        <Route
                            path="/products/:id"
                            element={<ProductDetail />}
                        />
                        <Route
                            path="/products/new"
                            element={<NewProduct />}
                        />
                        <Route
                            path="/products/categories/new"
                            element={<NewCategory />}
                        />
                        <Route
                            path="/categories"
                            element={<Categories />}
                        />
                        <Route
                            path="/categories/:id"
                            element={<CategoryDetail />}
                        />
                        <Route
                            path="/locations"
                            element={<Locations />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </PrivacyProvider>
    );
}


export default App;
