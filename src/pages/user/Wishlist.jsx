import React from "react";
import GreenCircleCheckbox from "../../common/components/GreenCircleCheckbox";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import Pagenation from "../../common/components/Pagination";

function Wishlist() {
  const wishlistItems = [
    {
      id: 1,
      title: "예시 제목",
      option: "예시 옵션",
      sellerName: "예시 판매자",
      price: 100000000,
      rating: 99.99,
      reviewCount: 999,
      imageUrl: "https://u7ouobpu9909.edge.naverncp.com/cdie6Z8lNS/wishlist/%EC%82%AC%EA%B3%BC.jpg?type=f&w=216&h=180",
    },
    {
      id: 1,
      title: "예시 제목",
      option: "예시 옵션",
      sellerName: "예시 판매자",
      price: 100000000,
      rating: 99.99,
      reviewCount: 999,
      imageUrl: "https://u7ouobpu9909.edge.naverncp.com/cdie6Z8lNS/wishlist/%EC%82%AC%EA%B3%BC.jpg?type=f&w=216&h=180",
    },
    {
      id: 1,
      title: "예시 제목",
      option: "예시 옵션",
      sellerName: "예시 판매자",
      price: 100000000,
      rating: 99.99,
      reviewCount: 999,
      imageUrl: "https://u7ouobpu9909.edge.naverncp.com/cdie6Z8lNS/wishlist/%EC%82%AC%EA%B3%BC.jpg?type=f&w=216&h=180",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 select-none cursor-default">
      <h1 className="text-2xl font-bold text-center mb-8">찜 리스트</h1>

      <div className="border-y-2 border-gray-dark py-4 mb-4">
        <div className="flex items-center ml-4 justify-between">
          <div className="flex items-center ml-16">
            <GreenCircleCheckbox />
            <span className="font-medium">전체 선택</span>
            <span className="text-sm ml-2 text-gray-600">
              (총 {wishlistItems.length}개)
            </span>
          </div>
          <button className="px-3 py-1 bg-red-500 text-white text-sm rounded mr-10">
            선택 삭제
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0">
        {wishlistItems.map((item) => (
          <div key={item.id} className="grid grid-cols-3 py-3 border-b border-gray-300">
            <div className="flex items-center ml-8 justify-center">
              <div className="flex items-center mr-8">
                <GreenCircleCheckbox />
              </div>

              <div className="flex items-center">
                <div className="w-[150px] flex items-center justify-center overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-bold mb-1">{item.title}</h3>
              <div className="flex items-center mb-1">
                <div className="flex">
                  <StarIcon className="text-green" />
                </div>
                <span className="ml-1 text-sm text-gray-600">
                  ({item.rating})
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-gray-600">
                  리뷰 {item.reviewCount}개
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-1">옵션: {item.option}</p>
              <p className="text-xs text-gray-600 mb-1">{item.sellerName}</p>
              <p className="text-lg font-bold text-red-600 mt-1">
                {item.price.toLocaleString()}원
              </p>
            </div>

            <div className="flex flex-col items-end justify-center h-full pr-8">
              <div className="flex items-center">
                <button className="w-10 h-10 flex items-center justify-center mb-5 mr-6">
                  <AddShoppingCartIcon fontSize="medium" />
                </button>
              </div>
              <div className="flex items-center">
                <button className="w-10 h-10 flex items-center justify-center text-red-500 mr-6">
                  <FavoriteIcon fontSize="medium" />
                </button>
              </div>
            </div>
          </div>
        ))}
        <Pagenation
          currentPage={0}
          totalPages={10}
          onPageChange={() => {}}
          hasPrev={true}
          hasNext={true}
          pageButtonCount={5}
          activeColor="bg-green"
          hoverColor="hover:bg-gray-100"
        />
      </div>
    </div>
  );
}

export default Wishlist;
