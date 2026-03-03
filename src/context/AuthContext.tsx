"use client"
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "@/api_types/login";
import { authAPI } from "@/lib/axios";
import { createContext, useContext, useEffect, useState, useCallback } from "react"



export interface AuthContextType {
    email: string | null;
    login: (data: LoginRequest) => Promise<LoginResponse>;
    register: (data: RegisterRequest) => Promise<RegisterResponse>;
    checkAuth: () => Promise<boolean>;
    logout: () => Promise<void>;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider.tsx
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [email, setEmail] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const logout = useCallback(async (sendRequest = true) => {
        setIsLoading(true);
        if(sendRequest){
            await authAPI.logout();
        }
        setIsAuthenticated(false);
        setEmail(null);
        setIsLoading(false);
    }, []);

    const checkAuth = useCallback(async () => {
        setIsLoading(true);
        const response = await authAPI.verify();
        if(response.success && response.isLoggedIn){
            setEmail(response.email);
            setIsAuthenticated(true);
            setIsLoading(false);
            return true;
        }
        await logout(false);
        return false;
    }, [logout]);

    // Check authentication status on mount
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (data: LoginRequest): Promise<LoginResponse> => {
        setIsLoading(true);
        const response = await authAPI.login({ email: data.email, password: data.password });
        if (!response.success){
            setIsLoading(false);
            return response;
        }
        setEmail(response.email);
        setIsAuthenticated(true);
        setIsLoading(false);
        return response;
    }
    const register = async (data: RegisterRequest): Promise<RegisterResponse>=>{
        setIsLoading(true);
        const response = await authAPI.register({ email: data.email, password: data.password });
        if (!response.success) {
            setIsLoading(false);
            setIsAuthenticated(true);
            return response;
        }
        setEmail(response.email);
        setIsLoading(false);
        return response;
    }

    return (
        <AuthContext.Provider value={{ email, login, register, logout, isLoading, isAuthenticated, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error("No context");
    return context;
}