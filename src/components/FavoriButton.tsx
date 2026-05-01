import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";

type FavoriButtonProps = {
  articleId: string;
};

export const FavoriButton = ({ articleId }: FavoriButtonProps) => {
  const queryClient = useQueryClient();
  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => api.get<Article[]>("/api/favorites"),
  });
  let isFavori = false;

  if (favorites) {
    for (const fav of favorites) {
      if (fav.id === articleId) {
        isFavori = true;
        break;
      }
    }
  }

  const FavoriMutation = useMutation({
    mutationFn: async () => {
      if (isFavori) {
        return api.delete(`/api/favorites/${articleId}`);
      } else {
        return api.post(`/api/favorites/${articleId}`, {});
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error) => {
      console.error("Erreur favori :", error);
    },
  });

  let heart;
  if (isFavori) {
    heart = (
      <svg className="w-5 h-5 text-red-500 fill-red-500" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  } else {
    heart = (
      <svg className="w-5 h-5 text-gray-500 fill-gray-500" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Le clic sur :", articleId);
        FavoriMutation.mutate();
      }}
      className="p-2 rounded-full z-50 relative"
    >
      {heart}
    </button>
  );
};
