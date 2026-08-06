import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import SaleForm from "../components/SaleForm";

function EditSale() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [sale, setSale] = useState(null);

    useEffect(() => {
        api.get(`sales/${id}`)
            .then((response) => {
                setSale(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);

    async function handleUpdateSale(updatedSale) {
        try {
            await api.patch(`sales/${id}/`, updatedSale);

            navigate("/");
        } catch (error) {
            console.error(
                error.response?.data || error.message
            );
        }
    }

    if (!sale) {
        return <p>Cargando...</p>;
    }

    return (
        <div>
            <h1>Editar Venta</h1>

            <SaleForm
                initialSale={sale}
                onSubmit={handleUpdateSale}
            />
        </div>
    );
}

export default EditSale;