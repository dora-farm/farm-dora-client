import { useEffect, useState } from "react";
import { getCookie } from "../../../common/utils/Cookies";

export const useBasket = (initialPage = 0) => {
  const [basketItems, setBasketItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedItemsToDelete, setSelectedItemsToDelete] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const token = getCookie("jwt_token");

  useEffect(() => {
    fetchBasket();
  }, [token, currentPage]);

  const fetchBasket = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BUYER_REST_API_URL}/api/basket?page=${currentPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await response.json();
      const data = result.data || {};
      const contents = data.contents || [];

      setBasketItems(contents);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
      setCurrentPage(data.currentPage ?? 0);
      setHasNext(data.hasNext ?? false);
      setHasPrev(data.hasPrev ?? false);

      const initSelected = {};
      contents.forEach((item) => {
        initSelected[item.basketId] = false;
      });
      setSelectedItems(initSelected);
      setSelectedItemsToDelete([]);
    } catch (error) {
      console.error("장바구니 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItemSelection = (basketId) => {
    const updated = {
      ...selectedItems,
      [basketId]: !selectedItems[basketId],
    };
    setSelectedItems(updated);

    const updatedDeleteList = Object.keys(updated)
      .filter((key) => updated[key])
      .map((id) => parseInt(id));
    setSelectedItemsToDelete(updatedDeleteList);
  };

  const toggleSelectAll = () => {
    const isAllSelected =
      Object.keys(selectedItems).length > 0 &&
      Object.values(selectedItems).every((v) => v);

    const updated = {};
    basketItems.forEach((item) => {
      updated[item.basketId] = !isAllSelected;
    });
    setSelectedItems(updated);
    setSelectedItemsToDelete(
      !isAllSelected ? basketItems.map((i) => i.basketId) : []
    );
  };

  const deleteSingleItem = async (basketId) => {
    try {
      await fetch(`${import.meta.env.VITE_BUYER_REST_API_URL}/api/basket`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([basketId]),
      });
      setBasketItems((prev) =>
        prev.filter((item) => item.basketId !== basketId)
      );
    } catch (error) {
      window.alert("삭제 중 오류가 발생했습니다.");
      console.error("삭제 실패:", error);
    }
  };

  const deleteSelectedItems = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BUYER_REST_API_URL}/api/basket`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedItemsToDelete),
      });
      await fetchBasket();
      return true;
    } catch (error) {
      console.error("선택 삭제 실패:", error);
      return false;
    }
  };

  const updateQuantity = async (basketId, newQuantity) => {
    try {
      await fetch(
        `${import.meta.env.VITE_BUYER_REST_API_URL}/api/basket/${basketId}?quantity=${newQuantity}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBasket();
    } catch (error) {
      console.error("수량 변경 실패:", error);
    }
  };

  return {
    basketItems,
    isLoading,
    selectedItems,
    selectedItemsToDelete,
    toggleItemSelection,
    toggleSelectAll,
    totalPages,
    totalElements,
    currentPage,
    hasNext,
    hasPrev,
    setCurrentPage,
    deleteSingleItem,
    deleteSelectedItems,
    updateQuantity,
    isAllSelected:
      Object.keys(selectedItems).length > 0 &&
      Object.values(selectedItems).every((v) => v),
  };
};