import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProductDetail from "./pages/ProductDetail";
import NewProduct from "./pages/NewProduct";
import Dashboard from "./pages/Dashboard";
import EditSale from "./pages/EditSale";
import Products from "./pages/Products";
import NewSale from "./pages/NewSale";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
    return (

        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 2500,
                }}
            />

        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

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
                </Route>
            </Routes>
        </BrowserRouter>
        </>
    );
}

export default App;