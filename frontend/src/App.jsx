import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import NewSale from "./pages/NewSale";
import Register from "./pages/Register";
import Products from "./pages/Products";
import EditSale from "./pages/EditSale";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/categories";
import Locations from "./pages/Locations";
import NewProduct from "./pages/NewProduct";
import NewCategory from "./pages/NewCategory";
import ProductDetail from "./pages/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
    return (
        <>
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
                }}
            />

            <BrowserRouter>
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
                            path="/locations"
                            element={<Locations />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}


export default App;