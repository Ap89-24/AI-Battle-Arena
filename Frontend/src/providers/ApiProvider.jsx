import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { api } from "../services/chat.api";

export default function ApiProvider({ children }) {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [getToken]);

  return children;
}
