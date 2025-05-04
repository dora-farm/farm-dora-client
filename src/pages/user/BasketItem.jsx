import React from "react";
import { useNavigate } from "react-router-dom";
import GreenCircleCheckbox from "../../common/components/GreenCircleCheckbox";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";

function BasketItem({
  item,
  checked,
  onToggleSelect,
  onDelete,
  onUpdateQuantity,
}) {
  const navigate = useNavigate();
  const { basketId, saleId, title, option, quantity, price, imageUrl } = item;

  const handleTitleClick = () => {
    navigate(`/sale/${saleId}`);
  };

  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 py-4 border-b border-gray-200 px-6 hover:bg-gray-50 items-center">
      {/* 체크박스 + 이미지 */}
      <div className="flex items-center gap-4">
        <GreenCircleCheckbox checked={checked} onChange={onToggleSelect} />
        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded border flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              onError={(e) => (e.target.src = "")}
              className="w-full h-full object-contain object-center rounded"
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
        </h3>
        <p className="text-sm text-gray-600 mt-1">옵션: {option}</p>
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
            disabled={quantity <= 1}
          >
            −
          </button>
          <span className="mx-2 w-6 text-center">{quantity}</span>
          <button
            className="w-7 h-7 text-sm bg-gray-200 rounded-full"
            onClick={() => onUpdateQuantity(basketId, quantity + 1)}
          >
            ＋
          </button>
        </div>
        <button
          className="text-red-500 text-sm hover:underline"
          onClick={() => onDelete(basketId)}
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export default BasketItem;