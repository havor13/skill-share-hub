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
 * Plain network call — no React state in here. Keeping it outside the hook
 * means the effect below only calls setState from promise callbacks, never
 * synchronously in the effect body.
 */
async function loadRatings(tutorialId: string): Promise<RatingsData> {
  const res = await fetch(`/api/tutorials/${tutorialId}/ratings`);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || 'Failed to load ratings.');
  }

  return {
    ratings: json.ratings ?? [],
    averageRating: json.averageRating ?? 0,
    ratingsCount: json.ratingsCount ?? 0,
  };
}

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

  // Initial load (and reload if the tutorial id changes).
  useEffect(() => {
    if (!tutorialId) return;

    let cancelled = false;

    loadRatings(tutorialId)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load ratings.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tutorialId]);

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
        // not just the aggregate the POST response returns. The rating itself
        // is already saved at this point, so a failed refresh is reported via
        // `error` rather than turning the submit into a failure.
        try {
          setData(await loadRatings(tutorialId));
          setError(null);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : 'Failed to refresh ratings.'
          );
        }

        return { ok: true };
      } catch {
        return { ok: false, error: 'Something went wrong. Please try again.' };
      } finally {
        setIsSubmitting(false);
      }
    },
    [tutorialId]
  );

  return { ...data, isLoading, error, submitRating, isSubmitting };
}