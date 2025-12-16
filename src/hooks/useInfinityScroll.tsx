'use client';
import { useEffect, useCallback } from 'react';
export function useInfinityScroll({
  fetchFn,
  skip,
  setSkip,
  limit,
  loading,
  hasMore,
  selectedUser,
}: {
  fetchFn: () => void;
  skip: number;
  setSkip: (n: number) => void;
  limit: number;
  loading: boolean;
  hasMore: boolean;
  selectedUser: any;
}) {
  //initial Fetch
  useEffect(() => {
    fetchFn();
  }, [skip, selectedUser]);
  // if user change reset skip and Refetch
  useEffect(() => {
    setSkip(0);
  }, [selectedUser]);

  //   load more
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setSkip(skip + limit);
  }, [loading, hasMore, limit]);

  //   handle scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

      if (scrollHeight - scrollTop <= clientHeight * 1.2 && !loading && hasMore) {
        loadMore();
      }
    },
    [loading, hasMore, loadMore]
  );

  return { handleScroll, loadMore };
}
