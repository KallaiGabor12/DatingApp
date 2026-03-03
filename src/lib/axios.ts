import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, VerifyResponse } from "@/api_types/login"
import axios, { InternalAxiosRequestConfig } from "axios"

const base = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
})



export const authAPI = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await base.post<LoginResponse>("/auth/login", {data: data});
        return response.data;
    },
    refresh: async (): Promise<boolean> => {
        const response = await base.post("/auth/verify");
        return response.data.refreshed;
    },
    register: async (data:RegisterRequest): Promise<RegisterResponse> => {
        const response = await base.post<RegisterResponse>("/auth/register", {data: data});
        return response.data;
    },
    verify: async (): Promise<VerifyResponse> => {
        return (await base.post("/auth/check")).data;
    },
    logout: async () => {
        await base.post("/auth/logout");
    }
}
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
export const api = base.create();

api.interceptors.response.use((response) => response, 
async (error) => {
    const originalRequest = error.config as RetryableRequestConfig;
    
    if(error.response?.status == 401 && originalRequest && !originalRequest._retry){
        originalRequest._retry = true;

        const refreshAttempt = await authAPI.refresh();
        if(!refreshAttempt) {
            return Promise.reject(error);
        }
        
        // Retry the original request with the new token
        return api(originalRequest);
    }
    return Promise.reject(error);
})