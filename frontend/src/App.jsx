import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Dashboard from "./pages/Dashboard";
import EditSale from "./pages/EditSale";
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
            </Routes>
        </BrowserRouter>
        </>
    );
}

export default App;