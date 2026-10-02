'use client';

import { useState } from 'react';

export default function RatingWidget() {
  const [rating, setRating] = useState(0);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">
        Rate this tutorial
      </h2>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="text-2xl"
          >
            {star <= rating ? '★' : '☆'}
          </button>
        ))}
      </div>

      <p className="mt-2">
        Rating: {rating}/5
      </p>
    </div>
  );
}