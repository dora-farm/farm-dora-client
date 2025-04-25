import React from "react";
import { Link } from "react-router-dom";
import GreenCircleCheckbox from "../../../common/components/GreenCircleCheckbox";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

function WishlistItem({
  item,
  formatImageUrl,
  onImageError,
  imageError,
  checked,
  onToggleSelect,
  onToggleLike,
  showAlert,
  addBasket,
  previewMode = false,
}) {
  if (previewMode) {
    return (
      <Link
        to={`/product/${item.saleId}`}
        className="bg-white border border-gray-dark rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="relative h-48 overflow-hidden">
          <div className="w-full h-full bg-gray-light flex items-center justify-center">
            {item.saveFile && !imageError ? (
              <img
                src={formatImageUrl(item.saveFile)}
                alt={item.title}
                className="w-full h-full object-cover rounded-lg"
                onError={() => onImageError(item.saleId)}
              />
            ) : (
              <ImageNotSupportedIcon
                style={{ width: 64, height: 64, color: "#6B7280" }}
              />
            )}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-brown truncate">{item.title}</h3>
          <p className="text-text-gray text-sm mt-1">{item.option}</p>
          <div className="mt-2">
            <span className="text-brown font-bold">
              {item.price.toLocaleString()}원
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="grid grid-cols-3 py-3 border-b border-gray-300">
      <div className="flex items-center ml-8 justify-center">
        <div className="flex items-center mr-8">
          <GreenCircleCheckbox checked={checked} onChange={onToggleSelect} />
        </div>

        <div className="flex items-center">
          <div className="w-[150px] h-[125px] rounded-xl flex items-center justify-center overflow-hidden">
            {item.saveFile && !imageError ? (
              <img
                src={formatImageUrl(item.saveFile)}
                alt={item.title}
                className="w-full h-full object-cover rounded-xl"
                onError={() => onImageError(item.likeId)}
              />
            ) : (
              <div className="w-[150px] h-[125px] flex items-center justify-center bg-gray-200 rounded-xl">
                <ImageNotSupportedIcon
                  style={{ width: 64, height: 64, color: "#6B7280" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <h3 className="text-lg font-bold mb-1">{item.title}</h3>
        <div className="flex items-center mb-1">
          <div className="flex">
            <StarIcon className="text-green" />
          </div>
          <span className="ml-1 text-sm text-gray-600">({item.score})</span>
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-sm text-gray-600">
            리뷰 {item.reviewCount}개
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-1">옵션: {item.option}</p>
        <p className="text-lg font-bold text-red-600 mt-1">
          {item.price.toLocaleString()}원
        </p>
      </div>

      <div className="flex flex-col items-end justify-center h-full pr-8">
        <div className="flex items-center">
          <button 
            className="w-10 h-10 flex items-center justify-center mb-5 mr-6"
            onClick={async () => {
              const result = await addBasket(item.optionId);
              if (result === true || result?.success === true) {
                showAlert("장바구니에 담겼습니다!");
              } else {
                showAlert(result?.message || "장바구니에 추가할 수 없습니다.");
              }
            }}
          >
            <AddShoppingCartIcon fontSize="medium" />
          </button>
        </div>
        <div className="flex items-center">
          <button
            className="w-10 h-10 flex items-center justify-center text-red-500 mr-6"
            onClick={() =>
              showAlert("찜 해제 되었습니다!", () => onToggleLike(item.likeId))
            }
          >
            <FavoriteIcon fontSize="medium" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishlistItem;
