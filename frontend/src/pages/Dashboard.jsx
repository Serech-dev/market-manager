import { useEffect, useState } from "react";
import api from "../services/api";
import SummaryCard from "../components/SummaryCard";
import SaleCard from "../components/SaleCard";
import { Link } from "react-router-dom";


function Dashboard() {
    const [summary, setSummary] = useState({
        gross: 0,
        investment: 0,
        earnings: 0,
    });
    const [sales, setSales] = useState([]);

    async function handleDelete(id) {
        try {
            await api.delete(`sales/${id}/`);

            setSales((current) =>
                current.filter((sale) => sale.id !== id)
            );

            const summaryResponse = await api.get("sales/summary/");
            setSummary(summaryResponse.data);

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        api.get("sales/summary/")
            .then((response) => {
                setSummary(response.data);
            });
        api.get("sales/")
            .then((response) => {
                setSales(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
    <div>
        <h1>Market Manager</h1>

        <h2>Today's Summary</h2>

        <div>
            <SummaryCard
                title="Gross"
                value={summary.gross}
            />

            <SummaryCard
                title="Investment"
                value={summary.investment}
            />

            <SummaryCard
                title="Earnings"
                value={summary.earnings}
            />
        </div>

        <Link to="/new-sale">
            <button>
                + New Sale
            </button>
        </Link>

        <h2>Ventas</h2>

        {sales.map((sale) => (
            <SaleCard
                key={sale.id}
                sale={sale}
                onDelete={handleDelete}
            />
        ))}
    </div>
    );
}

export default Dashboard;