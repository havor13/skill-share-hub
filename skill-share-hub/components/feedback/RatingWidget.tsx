'use client';

import { useState } from 'react';

export default function RatingWidget() {
  const [rating, setRating] = useState(0);
  const ratings = [5, 4, 4, 5];
  

  const averageRating =
  ratings.reduce((sum, rating) => sum + rating, 0) /
  ratings.length;

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
            onClick={() => setRating(star)}
            className="text-2xl text-yellow-500 hover:scale-110 transition-transform"
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
      
      {rating > 0 && (
        <p className="text-green-600 mt-2">
            Thank you for your feedback!
        </p>
      )}
    </div>
  );
}   