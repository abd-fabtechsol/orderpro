import { useState, useEffect, useCallback } from 'react';

const usePagination = (fetchFunction, limit = 10) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMore = useCallback(async () => {
    if (loadingMore || refreshing || !hasNext) return;

    setLoadingMore(true);
    const result = await fetchFunction(page, limit); // result = { data, hasNext }

    setData(prev => [...prev, ...result.data]);
    setHasNext(result.hasNext);
    setPage(prev => prev + 1);
    setLoadingMore(false);
  }, [page, hasNext, refreshing, loadingMore, fetchFunction]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);

    const result = await fetchFunction(1, limit);
    setData(result.data);
    setHasNext(result.hasNext);
    setRefreshing(false);
  }, [fetchFunction, limit]);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    const result = await fetchFunction(1, limit);
    setData(result.data);
    setHasNext(result.hasNext);
    setPage(2);
    setLoading(false);
  }, [fetchFunction, limit]);

  useEffect(() => {
    loadInitial();
  }, []);

  return {
    data,
    loading,
    refreshing,
    loadingMore,
    loadMore,
    refresh,
    hasNext,
  };
};

export default usePagination;


// example use

// const fetchChats = async (page, limit) => {
//     const total = 60;
//     const start = (page - 1) * limit;
//     const end = start + limit;
//     const data = Array.from({ length: Math.min(limit, total - start) }, (_, i) => `Chat ${start + i + 1}`);
  
//     return {
//         data,
//         hasNext: end < total
//       }
//   };
  
//     const {
//       data,
//       loadMore,
//       refresh,
//       refreshing,
//       loadingMore,
//     } = usePaginatedData(fetchChats);
  
