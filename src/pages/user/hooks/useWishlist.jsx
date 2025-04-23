import { useState, useEffect } from "react";
import axios from "axios";

export function useWishlist(userId, previewMode) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  // 찜 리스트 불러오기
  const loadWishlistItems = async () => {
    setIsLoading(true);
    try {

      const endpoint = previewMode
        ? `http://localhost:8080/api/my/user/dashboard/wishpreview`
        : `http://localhost:8080/api/my/user/wishlist/list`;
      const response = await axios.get(
        endpoint, { params: { userId } });

      let items = response.data.data;

      const normalizedItems = items.map((item) => ({
        likeId: item.likeId || "",
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
        initialSelection[item.likeId] = false;
      });
      setSelectedItems(initialSelection);
    } catch (error) {
      console.error("찜 리스트를 불러올 수 없습니다:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 찜 리스트 삭제하기
  const selectedItemsToDelete = Object.keys(selectedItems).filter(
    (likeId) => selectedItems[likeId]
  );

  const deleteSelectedItems = async () => {
    if (selectedItemsToDelete.length === 0) return;
    try {
      const response = await axios.delete (
        `http://localhost:8080/api/my/user/wishlist/delete`, {
          data: { likeIds: selectedItemsToDelete },
        }
        
      )
    }
  }

  useEffect(() => {
    loadWishlistItems();
  }, []);

  // 이미지 URL 포맷팅 & 에러 핸들링
  const formatImageUrl = (imagePath) => {
    if (!imagePath) return null;

    const baseUrl =
      "https://u7ouobpu9909.edge.naverncp.com/cdie6Z8lNS/wishlist/";
    const params = "?type=f&w=216&h=180";

    return imagePath.startsWith("http")
      ? imagePath
      : `${baseUrl}${imagePath}${params}`;
  };
  const handleImageError = (likeId) => {
    setImageErrors((prev) => ({ ...prev, [likeId]: true }));
  };

  // 아이템 선택, 전체 선택
  const toggleItemSelection = (likeId) => {
    setSelectedItems(prev => ({
      ...prev,
      [likeId]: !prev[likeId],
    }));
  };

  const isAllSelected = wishlistItems.length > 0 && 
    wishlistItems.every(item => selectedItems[item.likeId] === true);

  const toggleSelectAll = () => {
    const allSelected = !isAllSelected;
    const newSelection = {};

    wishlistItems.forEach(item => {
      newSelection[item.likeId] = allSelected;
    });
    setSelectedItems(newSelection);
  }

  // 페이지네이션
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const paginatedItems = previewMode 
    ? wishlistItems 
    : wishlistItems.slice(
        currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage
      );
  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);
  const hasPrev = currentPage > 0;
  const hasNext = currentPage < totalPages - 1;
  
  return {
    wishlistItems: paginatedItems,
    totalItems: wishlistItems.length,
    totalPages,
    currentPage,
    hasPrev,
    hasNext,
    onPageChange: handlePageChange,
    isLoading,
    imageErrors,
    selectedItems,
    formatImageUrl,
    handleImageError,
    toggleItemSelection,
    toggleSelectAll,
    isAllSelected,
    refreshItems: loadWishlistItems,
  };
}