import { useState, useEffect } from "react";
import axios from "axios";

export function useWishlist(userId, previewMode) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [isAllSelected, setIsAllSelected] = useState(false);

  const loadWishlistItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/my/user/dashboard/wishlist`,
        { params: { userId } }
      );

      // 두 API 모두 response.data.data 형태로 실제 데이터가 전달됨
      let items = response.data.data;

      // 미리보기 모드일 경우 데이터 제한
      if (previewMode) {
        items = items.slice(0, 4);
      }

      // 데이터 정규화 - API 응답 구조가 다를 수 있음
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

      // 선택 상태 초기화
      const initialSelection = {};
      normalizedItems.forEach((item) => {
        initialSelection[item.id] = false;
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

  // 이미지 URL 포맷
  const formatImageUrl = (imagePath) => {
    if (!imagePath) return null;

    const baseUrl =
      "https://u7ouobpu9909.edge.naverncp.com/cdie6Z8lNS/wishlist/";
    const params = "?type=f&w=216&h=180";

    return imagePath.startsWith("http")
      ? imagePath
      : `${baseUrl}${imagePath}${params}`;
  };

  // 이미지 에러 처리
  const handleImageError = (itemId) => {
    setImageErrors((prev) => ({ ...prev, [itemId]: true }));
  };

  // 아이템 선택 토글
  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) => {
      const newState = { ...prev, [itemId]: !prev[itemId] };

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
      updatedSelection[item.id] = newState;
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

  return {
    wishlistItems,
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
