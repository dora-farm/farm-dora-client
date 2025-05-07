import React from "react";
import { useNavigate } from "react-router-dom";
import GreenCircleCheckbox from "../../common/components/GreenCircleCheckbox";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import DeleteIcon from "@mui/icons-material/Delete";

function BasketItem({
  item,
  checked,
  onToggleSelect,
  onDelete,
  onUpdateQuantity,
}) {
  const navigate = useNavigate();
  const { basketId, saleId, title, option, quantity, price, imageUrl, stock } = item;

  const handleTitleClick = () => {
    navigate(`/sale/${saleId}`);
  };

  const isSoldOut = stock === 0;

  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 py-4 border-b border-gray-200 px-6 hover:bg-gray-50 items-center">
      {/* 체크박스 + 이미지 */}
      <div className="flex items-center gap-4">
        <GreenCircleCheckbox
          checked={checked}
          onChange={onToggleSelect}
          disabled={isSoldOut}
        />
        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 border flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              onError={(e) => (e.target.src = "")}
              className="w-full h-full object-contain object-center"
            />
          ) : (
            <ImageNotSupportedIcon style={{ fontSize: 48, color: "#9CA3AF" }} />
          )}
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="flex flex-col justify-center">
        <h3
          className="font-semibold text-gray-900 text-base cursor-pointer hover:underline"
          onClick={handleTitleClick}
        >
          {title}
          {isSoldOut && (
            <span className="ml-2 text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded">
              품절
            </span>
          )}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          옵션: {option}
          {isSoldOut && (
            <span className="ml-2 text-red-500 font-semibold">[품절]</span>
          )}
        </p>
        <p className="text-sm text-gray-800 mt-1 font-bold">
          {(price * quantity).toLocaleString()}원
        </p>
      </div>

      {/* 수량 조절 + 삭제 버튼 */}
      <div className="flex items-center justify-end space-x-4">
        <div className="flex items-center">
          <button
            className="w-7 h-7 text-sm bg-gray-200 rounded-full"
            onClick={() => onUpdateQuantity(basketId, quantity - 1)}
            disabled={quantity <= 1 || isSoldOut}
          >
            −
          </button>
          <span className="mx-2 w-6 text-center">{quantity}</span>
          <button
            className="w-7 h-7 text-sm bg-gray-200 rounded-full"
            onClick={() => onUpdateQuantity(basketId, quantity + 1)}
            disabled={isSoldOut}
          >
            ＋
          </button>
        </div>
        <button
          onClick={onDelete}
          className="ml-4 text-red-500 hover:text-red-700"
          aria-label="삭제"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}

export default BasketItem;