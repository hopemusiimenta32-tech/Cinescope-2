import { useCallback, useEffect, useState } from 'react';

function readableError(error) {
  return error?.response?.data?.error?.message || error?.message || 'We could not load this content. Please try again.';
}

export default function useApiResource(loader) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [retryVersion, setRetryVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    loader(controller.signal)
      .then((response) => {
        if (!controller.signal.aborted) setData(response);
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) setError(readableError(requestError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [loader, retryVersion]);

  const retry = useCallback(() => setRetryVersion((version) => version + 1), []);
  return { data, error, loading, retry };
}
