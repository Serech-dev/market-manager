import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Dashboard</h1>} />
                <Route path="/new-sale" element={<h1>New Sale</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;