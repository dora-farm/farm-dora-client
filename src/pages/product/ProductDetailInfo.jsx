const ProductDetailInfo = ({ content }) => {
  return (
    <section className="product-detail-info">
      {content ? (
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <p>상품 상세 정보가 없습니다.</p>
      )}
    </section>
  );
};

export default ProductDetailInfo;