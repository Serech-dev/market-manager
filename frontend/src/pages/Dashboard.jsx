import { useEffect, useState } from "react";
import api from "../services/api";

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
            })
            .catch((error) => {
                console.error("Failed to fetch summary:", error);
            });
    }, []);

    return (
        <div>
            <h1>Market Manager</h1>

            <h2>Today's Summary</h2>

            <div>
                <p>Gross: ${summary.gross}</p>
                <p>Investment: ${summary.investment}</p>
                <p>Earnings: ${summary.earnings}</p>
            </div>
        </div>
    );
}

export default Dashboard;