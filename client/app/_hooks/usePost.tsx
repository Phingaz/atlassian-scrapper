import { useState } from "react";

interface UsePostResponse<T> {
  data: T | null;
  loading: boolean;
  post: (url: string, body: Record<string, unknown>) => Promise<void>;
}

const usePost = <T,>(): UsePostResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const post = async (url: string, body: Record<string, unknown>) => {
    setLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result: T = await response.json();
      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, post };
};

export default usePost;
