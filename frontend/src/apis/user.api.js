import api from "../utils/axios"

export const getCurrentUser = async () => {
    try {
        const response = await api.get("/api/me")
        return response.data
    } catch (error) {
        if (error.response?.status === 401) {
            return { user: null }
        }

        throw error
    }
}

export const logoutUser = async () => {
    await api.post("/api/auth/logout")
}