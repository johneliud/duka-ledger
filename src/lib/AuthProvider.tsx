import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import {
  login as apiLogin,
  register as apiRegister,
  joinShop as apiJoinShop,
} from "./auth";
import { connector } from "@/db/connector";
import { initializeSync, disconnectFromShop } from "@/db/powersync";

interface User {
  id: string;
  name: string;
  id_number: string;
}
interface Shop {
  id: string;
  name: string;
  invite_code?: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("duka_session");
    return saved ? JSON.parse(saved).user : null;
  });
  const [shop, setShop] = useState<Shop | null>(() => {
    const saved = localStorage.getItem("duka_session");
    return saved ? JSON.parse(saved).shop : null;
  });
  const [role, setRole] = useState<string | null>(() => {
    const saved = localStorage.getItem("duka_session");
    return saved ? JSON.parse(saved).role : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    const saved = localStorage.getItem("duka_session");
    return saved ? JSON.parse(saved).token : null;
  });

  useEffect(() => {
    if (shop && user) {
      localStorage.setItem("shop_id", shop.id);
      localStorage.setItem("user_id", user.id);
      connector.setCredentials(shop.id, user.id);
      initializeSync(shop.id);
    }
  }, [shop, user]);

  const saveSession = (user: User, shop: Shop, role: string, token: string) => {
    localStorage.setItem(
      "duka_session",
      JSON.stringify({ user, shop, role, token }),
    );
    localStorage.setItem("shop_id", shop.id);
    localStorage.setItem("user_id", user.id);
  };

  const login = async (idNumber: string, pin: string) => {
    const response = await apiLogin(idNumber, pin);
    const user = response.user;
    const shop = response.shop;
    const role = response.role || "member";
    const token = response.token;

    setUser(user);
    setShop(shop);
    setRole(role);
    setToken(token);

    saveSession(user, shop, role, token);
    connector.setCredentials(shop.id, user.id);
    await initializeSync(shop.id);
  };

  const register = async (
    name: string,
    idNumber: string,
    pin: string,
    shopName: string,
  ) => {
    const response = await apiRegister(name, idNumber, pin, shopName);
    const user = response.user;
    const shop = response.shop;
    const role = "owner";
    const token = response.token;

    setUser(user);
    setShop(shop);
    setRole(role);
    setToken(token);

    saveSession(user, shop, role, token);
    connector.setCredentials(shop.id, user.id);
    await initializeSync(shop.id);
  };

  const joinShop = async (
    name: string,
    idNumber: string,
    pin: string,
    inviteCode: string,
  ) => {
    const response = await apiJoinShop(name, idNumber, pin, inviteCode);
    const user = response.user;
    const shop = response.shop;
    const role = "member";
    const token = response.token;

    setUser(user);
    setShop(shop);
    setRole(role);
    setToken(token);

    saveSession(user, shop, role, token);
    connector.setCredentials(shop.id, user.id);
    await initializeSync(shop.id);
  };

  const logout = () => {
    disconnectFromShop();
    setUser(null);
    setShop(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem("duka_session");
    localStorage.removeItem("shop_id");
    localStorage.removeItem("user_id");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        shop,
        role,
        token,
        isAuthenticated: !!user && !!shop,
        login,
        register,
        joinShop,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
