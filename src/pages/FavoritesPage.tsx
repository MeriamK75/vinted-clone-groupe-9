import { useQuery } from "@tanstack/react-query";
import type { Article } from "../types/article";
import { api } from "../services/api";
import { ArticleCard } from "../components/ArticleCard";

export default function FavoritesPage() {
  const {
    data: favorites,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => api.get<Article[]>("/api/favorites"),
  });

  if (isLoading) {
    return (
      <p className="text-center py-10 text-gray-500">Chargement des favoris</p>
    );
  }
  if (isError) {
    return (
      <p className="text-center py-10 text-red-500">
        Erreur chargement des favoris
      </p>
    );
  }
  if (favorites === undefined || favorites === null || favorites.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">
        Aucun article en favoris
      </p>
    );
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mes Favoris</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favorites?.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
