import api from "./api";


export async function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
}