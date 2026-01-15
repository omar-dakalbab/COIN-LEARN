import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useProgress() {
  return useQuery({
    queryKey: [api.progress.list.path],
    queryFn: async () => {
      const res = await fetch(api.progress.list.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return null; // Handle unauthorized gracefully
        throw new Error("Failed to fetch progress");
      }
      return api.progress.list.responses[200].parse(await res.json());
    },
  });
}
