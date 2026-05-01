import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { getUserId } from "../lib/userId";
import type { Article } from "../types/article";
import { Link } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";

export default function MyArticlesPage() {
  const id = getUserId();
  const queryClient = useQueryClient();

  const {
    data: myArticles,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-articles", id],
    queryFn: () => api.get<Article[]>(`/api/users/${id}/articles`),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (articleId: string) => api.delete(`/api/articles/${articleId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-articles", id] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
    onError: () => {
      alert("Une erreur lors de la suppression.");
    },
  });
  const handleDelete = (articleId: string) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette annonce ?",
    );
    if (confirmDelete) {
      deleteMutation.mutate(articleId);
    }
  };

  if (isLoading)
    return (
      <p className="text-center py-10 text-gray-500">
        Chargement de mes annonces
      </p>
    );

  if (isError)
    return (
      <p className="text-center py-10 text-gray-500">
        Erreur récupération de mes annonces
      </p>
    );

  if (!myArticles || myArticles.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">Pas encore d'annonces.</p>
        <Link to="/publish" className="text-teal-600 font-bold">
          Publier ma première annonce
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mes annonces</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {myArticles.map((article) => (
          <div key={article.id} className="relative">
            <ArticleCard article={article} />

            <button
              onClick={() => handleDelete(article.id)}
              disabled={deleteMutation.isPending}
              className="absolute top-2 left-2 z-20 bg-red-500  text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md"
            >
              {deleteMutation.isPending ? "Suppression" : "Supprimer"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
