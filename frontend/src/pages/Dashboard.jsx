import { useEffect, useState } from "react";
import api from "../services/api";
import SummaryCard from "../components/SummaryCard";

function Dashboard() {
    const [summary, setSummary] = useState({
        gross: 0,
        investment: 0,
        earnings: 0,
    });

    useEffect(() => {
        api.get("sales/summary/")
            .then((response) => {
                setSummary(response.data);
            });
    }, []);

    return (
        <div>
            <h1>Market Manager</h1>

            <h2>Today's Summary:</h2>

            <div>
                <SummaryCard
                    title="Ingreso Bruto"
                    value={summary.gross}
                />

                <SummaryCard
                    title="Inversión"
                    value={summary.investment}
                />

                <SummaryCard
                    title="Ganancia"
                    value={summary.earnings}
                />
            </div>
        </div>
    );
}

export default Dashboard;