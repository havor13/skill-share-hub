'use client';

import { useState } from 'react';
import { useRatings } from '@/hooks/useRatings';

type RatingWidgetProps = {
  tutorialId: string;
};

export default function RatingWidget({
  tutorialId,
}: RatingWidgetProps) {
  const [rating, setRating] = useState(0);

  const {
    averageRating,
    ratingsCount,
    submitRating,
    isLoading,
    isSubmitting,
  } = useRatings(tutorialId);

  if (isLoading) {
    return <p>Loading ratings...</p>;
  }

  return (
    <div className="border rounded-lg p-4 mt-6">
      <h2 className="text-lg font-semibold mb-3">
        Leave a Rating
      </h2>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={isSubmitting}
            onClick={async () => {
              setRating(star);
              await submitRating(star);
            }}
            className="text-2xl text-yellow-500 hover:scale-110 transition-transform disabled:opacity-50"
          >
            {star <= rating ? '★' : '☆'}
          </button>
        ))}
      </div>

      <p className="mt-2">
        {rating > 0
          ? `Your Rating: ${rating}/5`
          : 'Select a rating'}
      </p>

      <p className="mt-2 font-semibold text-yellow-600">
        Average Rating: {averageRating} ⭐
      </p>

      <p className="text-sm text-gray-600">
        Based on {ratingsCount} ratings
      </p>
    </div>
  );
}   