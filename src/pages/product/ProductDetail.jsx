import React from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import ProductSummary from './ProductSummary';
import ProductDetailInfo from './ProductDetailInfo';
import RelatedProducts from './RelatedProducts';
import ProductQnA from './ProductQnA';
import ProductReviews from './ProductReviews';

const ProductDetail = () => {
  const { saleId } = useParams();
  const [content, setContent] = useState('');

  return (
    <div key={saleId} className="w-full p-8 bg-gray-50">

      <ProductSummary saleId={saleId} setContent={setContent} />
      <ProductDetailInfo content={content} />
      <RelatedProducts saleId={saleId} />
      <ProductReviews saleId={saleId} />
      <ProductQnA saleId={saleId} />

    </div>
  );
};

export default ProductDetail;