'use client';

import { useCallback, useEffect, useState } from 'react';

type Rating = {
  user: { _id: string; name: string; email: string };
  value: number;
  createdAt: string;
};

type RatingsData = {
  ratings: Rating[];
  averageRating: number;
  ratingsCount: number;
};

type UseRatingsResult = RatingsData & {
  isLoading: boolean;
  error: string | null;
  submitRating: (value: number) => Promise<{ ok: boolean; error?: string }>;
  isSubmitting: boolean;
};

/**
 * Fetches ratings for a tutorial and exposes a function to submit (or update)
 * the current user's own rating. Submitting re-fetches the aggregate so the
 * displayed average/count stay in sync without a full page reload.
 */
export function useRatings(tutorialId: string): UseRatingsResult {
  const [data, setData] = useState<RatingsData>({
    ratings: [],
    averageRating: 0,
    ratingsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRatings = useCallback(async () => {
    if (!tutorialId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/tutorials/${tutorialId}/ratings`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to load ratings.');
      }

      setData({
        ratings: json.ratings ?? [],
        averageRating: json.averageRating ?? 0,
        ratingsCount: json.ratingsCount ?? 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ratings.');
    } finally {
      setIsLoading(false);
    }
  }, [tutorialId]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const submitRating = useCallback(
    async (value: number) => {
      setIsSubmitting(true);

      try {
        const res = await fetch(`/api/tutorials/${tutorialId}/ratings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value }),
        });

        const json = await res.json();

        if (!res.ok) {
          return { ok: false, error: json.error || 'Failed to submit rating.' };
        }

        // Re-fetch so we get the full ratings list (with the populated user),
        // not just the aggregate the POST response returns.
        await fetchRatings();

        return { ok: true };
      } catch {
        return { ok: false, error: 'Something went wrong. Please try again.' };
      } finally {
        setIsSubmitting(false);
      }
    },
    [tutorialId, fetchRatings]
  );

  return { ...data, isLoading, error, submitRating, isSubmitting };
}