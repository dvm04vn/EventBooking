import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { refresh, logout as logoutApi } from "~/Services/AuthService";
import { getMe } from "~/Services/UserService";

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    const logoutLocal = useCallback(() => {
        localStorage.removeItem("accessToken");
        setUser(null);
    }, []);

    const initializeAuth = useCallback(async () => {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
            logoutLocal();
            setIsLoading(false);
            setIsInitialized(true);
            return;
        }
        try {
            const data = await refresh();
            const newToken =
                data?.meta?.newAccessToken || data?.accessToken || data?.token;
            if (newToken) localStorage.setItem("accessToken", newToken);
            const res = await getMe();
            const me = res?.data ?? res ?? null;
            if (!me) logoutLocal();
            else setUser(me);
        } catch (err) {
            console.error("Auth init failed:", err?.message);
            logoutLocal();
        } finally {
            setIsLoading(false);
            setIsInitialized(true);
        }
    }, [logoutLocal]);

    const logout = useCallback(async () => {
        try {
            await logoutApi();
        } catch (err) {
            console.error("Logout API failed:", err?.message);
        } finally {
            logoutLocal();
        }
    }, [logoutLocal]);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
            isLoading,
            isInitialized,
            initializeAuth,
            logout,
        }),
        [user, isLoading, isInitialized, initializeAuth, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
