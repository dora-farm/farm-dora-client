// src/contexts/BasketContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { getCookie } from "../utils/Cookies";

const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
  const [basketCount, setBasketCount] = useState(0);
  const token = getCookie("jwt_token");

  const updateBasketCount = async () => {
    if (token) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BUYER_REST_API_URL}/api/basket?size=16`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        setBasketCount(result?.data?.contents?.length || 0);
      } catch (err) {
        console.error("장바구니 개수 조회 실패:", err);
        setBasketCount(0);
      }
    } else {
      const localBasket = JSON.parse(localStorage.getItem("basket") || "[]");
      setBasketCount(localBasket.length);
    }
  };

  useEffect(() => {
    updateBasketCount();
  }, [token]);

  return (
    <BasketContext.Provider value={{ basketCount, updateBasketCount }}>
      {children}
    </BasketContext.Provider>
  );
};

export const useBasketContext = () => useContext(BasketContext);