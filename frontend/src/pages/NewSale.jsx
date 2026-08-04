import { useNavigate } from "react-router-dom";
import api from "../services/api";
import SaleForm from "../components/SaleForm";

function NewSale() {
    const navigate = useNavigate();

    async function handleCreateSale(sale) {
        try {
            const response = await api.post("sales/", sale);

            console.log("Venta creada:", response.data);

            navigate("/");
        } catch (error) {
            console.error(
                "Error creando venta:",
                error.response?.data || error.message
            );
        }
    }

    return (
        <div>
            <h1>Nueva Venta</h1>

            <SaleForm onSubmit={handleCreateSale} />
        </div>
    );
}

export default NewSale;