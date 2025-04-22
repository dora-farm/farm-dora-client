import { useState, useEffect } from "react";
import axios from "axios";

export function useWishlist(userId, previewMode) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const loadWishlistItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/my/user/dashboard/wishlist`,
        { params: { userId } }
      );

      let items = response.data.data;

      if (previewMode) {
        items = items.slice(0, 4);
      }

      const normalizedItems = items.map((item) => ({
        saleId: item.saleId || "",
        title: item.title || "",
        option: item.option || "",
        price: item.price || 0,
        saveFile: item.saveFile,
        score: item.score || 0,
        reviewCount: item.reviewCount || 0,
      }));

      setWishlistItems(normalizedItems);

      const initialSelection = {};
      normalizedItems.forEach((item) => {
        initialSelection[item.saleId] = false;
      });
      setSelectedItems(initialSelection);
    } catch (error) {
      console.error("찜 리스트를 불러올 수 없습니다:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWishlistItems();
  }, [userId, previewMode]);

  const formatImageUrl = (imagePath) => {
    if (!imagePath) return null;

    const baseUrl =
      "https://u7ouobpu9909.edge.naverncp.com/cdie6Z8lNS/wishlist/";
    const params = "?type=f&w=216&h=180";

    return imagePath.startsWith("http")
      ? imagePath
      : `${baseUrl}${imagePath}${params}`;
  };

  const handleImageError = (saleId) => {
    setImageErrors((prev) => ({ ...prev, [saleId]: true }));
  };

  // 아이템 선택 토글
  const toggleItemSelection = (saleId) => {
    setSelectedItems((prev) => {
      const newState = { ...prev, [saleId]: !prev[saleId] };

      // 모든 아이템이 선택되었는지 확인
      const allSelected = Object.values(newState).every((selected) => selected);
      setIsAllSelected(allSelected);

      return newState;
    });
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    const newState = !isAllSelected;
    setIsAllSelected(newState);

    const updatedSelection = {};
    wishlistItems.forEach((item) => {
      updatedSelection[item.saleId] = newState;
    });

    setSelectedItems(updatedSelection);
  };

  // 선택된 아이템 삭제
  const deleteSelectedItems = async () => {
    const itemsToDelete = Object.entries(selectedItems)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);

    if (itemsToDelete.length === 0) return;

    setIsLoading(true);
    try {
      // API 호출로 선택된 아이템 삭제
      await axios.delete(`http://localhost:8080/api/my/user/wishlist/items`, {
        data: { itemIds: itemsToDelete },
      });

      // 성공 시 목록 다시 로드
      await loadWishlistItems();
    } catch (error) {
      console.error("선택한 항목을 삭제할 수 없습니다:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 장바구니에 추가
  const addToCart = async (itemId) => {
    try {
      await axios.post(`http://localhost:8080/api/cart`, {
        userId,
        itemId,
      });
      // 성공 메시지나 상태 업데이트 로직 추가 가능
    } catch (error) {
      console.error("장바구니에 추가할 수 없습니다:", error.message);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // 현재 페이지의 아이템만 반환하는 계산된 값
  const paginatedItems = previewMode 
    ? wishlistItems 
    : wishlistItems.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      );
  
  // 전체 페이지 수 계산
  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);
  
  // 이전/다음 페이지 존재 여부
  const hasPrev = currentPage > 0;
  const hasNext = currentPage < totalPages - 1;
  
  return {
    wishlistItems: paginatedItems, // 페이지네이션된 아이템
    totalItems: wishlistItems.length, // 전체 아이템 개수
    totalPages,
    currentPage,
    hasPrev,
    hasNext,
    onPageChange: handlePageChange,
    isLoading,
    imageErrors,
    selectedItems,
    isAllSelected,
    formatImageUrl,
    handleImageError,
    toggleItemSelection,
    toggleSelectAll,
    deleteSelectedItems,
    addToCart,
    refreshItems: loadWishlistItems,
  };
}