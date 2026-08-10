import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/Dashboard";
import EditSale from "./pages/EditSale";
import Products from "./pages/Products";
import NewSale from "./pages/NewSale";


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
                <Route path="/" element={<Dashboard />} />
                <Route path="/new-sale" element={<NewSale />} />
                <Route path="/sales/:id/edit" element={<EditSale />} />
                <Route path="/products" element={<Products />} />
                <Route
                    path="/products/:id"
                    element={<ProductDetail />}
                />
            </Routes>
        </BrowserRouter>
        </>
    );
}

export default App;