// useWishlist.js - 로직 부분을 커스텀 훅으로 분리
import { useState, useEffect } from "react";
import axios from "axios";

export function useWishlist(userId) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlistItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/my/user/dashboard/preview`,
        { params: { userId } }
      );

      const limitedData = response.data.data.slice(0, 4);
      setWishlistItems(limitedData);
    } catch (error) {
      console.error("찜 리스트를 불러올 수 없습니다:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWishlistItems();
  }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatImageUrl = (imagePath) => {
    const baseUrl = "https://u7ouobpu9909.edge.naverncp.com/cdie6Z8lNS/wishlist/";
    const params = "?type=f&w=216&h=180";

    return imagePath.startsWith('http') ? imagePath : `${baseUrl}${imagePath}${params}`;
  };

  const handleImageError = (itemId) => {
    setImageErrors((prev) => ({ ...prev, [itemId]: true }));
  };

  return {
    wishlistItems,
    isLoading,
    imageErrors,
    formatPrice,
    formatImageUrl,
    handleImageError
  };
}