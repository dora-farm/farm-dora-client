function RefundItem({ sale }) {
    // 상품별 총 금액 계산
    const calculateItemTotal = () => {
      return sale.options.reduce((total, option) => {
        return total + (option.price * option.quantity);
      }, 0);
    };
  
    return (
      <>
      <div className="p-4 border-b">
        {/* 판매자 정보 */}
        {sale.seller && (
          <div className="bg-gray-50 p-3 rounded-md mb-3">
            <div className="flex items-center">
              <div>
                <p className="font-medium text-lg">{sale.seller.companyName}</p>
                <p className="text-xs text-gray-500">
                  {sale.seller.postNum} {sale.seller.addr} {sale.seller.detailAddr}
                </p>
              </div>
            </div>
          </div>
        )}
  
        {/* 상품 정보 */}
        <div className="flex">
          <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden mr-3">
            {sale.saveFile ? (
              <img 
                src={`${sale.saveFile}`} 
                alt={sale.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                이미지 없음
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium">{sale.title}</p>
            <p className="text-xs text-gray-500">상품번호: {sale.saleId}</p>
            
            {/* 옵션 정보 */}
            <div className="mt-1 text-sm">
              {sale.options.map((option, index) => (
                <div key={index} className="text-gray-600">
                  {option.name} {option.quantity}개 
                  <span className="text-xs text-gray-500 ml-1">
                    {(option.price * option.quantity).toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-2 text-sm font-medium flex justify-between">
              <span>총 상품금액</span>
              <span>{calculateItemTotal().toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>

      </>
    );
  }
  
  export default RefundItem;