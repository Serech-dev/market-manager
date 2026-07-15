import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import NewSale from "./pages/NewSale";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/new-sale" element={<NewSale />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;