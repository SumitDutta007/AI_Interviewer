import api from "../utils/axios"

export const getResume = async () => {
    try {
        const response = await api.get("/api/resume/get-resume")
        console.log("[resume] Fetched resume data:", response.data)
        return response.data || null
    }catch (error) {
        console.error("[resume] Fetch resume failed:", {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
        })
        return null
    }
}