import React from 'react';
import ReviewItem from './ReviewItem';

function ReviewList({ reviews, onOpenImageViewer, onEditReview, onDeleteReview }) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">작성한 리뷰가 없습니다.</div>
    );
  }

  return (
    <div className="space-y-5">
      {reviews.map((review) => (
        <ReviewItem
          key={review.reviewId}
          review={review}
          onOpenImageViewer={onOpenImageViewer}
          onEditReview={onEditReview}
          onDeleteReview={onDeleteReview}
        />
      ))}
    </div>
  );
}

export default ReviewList;