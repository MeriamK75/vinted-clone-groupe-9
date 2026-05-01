import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { CATEGORIES, CONDITIONS } from "../types/article";
import { FavoriButton } from "../components/FavoriButton";

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: article,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: () => api.get<Article>(`/api/articles/${id}`),
  });

  if (isLoading === true) {
    return (
      <p className="text-center py-10 text-gray-500">
        Chargement de l'article... -_-
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center py-10 text-red-500">
        Une grosse erreur est survenue.
      </p>
    );
  }

  if (article === undefined || article === null) {
    return (
      <p className="text-center py-10 text-red-500">Article plus en STOCK.</p>
    );
  }

  const categoryLabel =
    CATEGORIES.find((category) => category.id === article.category)?.label ??
    article.category;

  const conditionLabel =
    CONDITIONS.find((condition) => condition.value === article.condition)
      ?.label ?? article.condition;

  const formattedDate = new Date(article.createdAt).toLocaleDateString(
    "fr-FR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link to="/" className="text-teal-600 hover:underline text-sm mb-4 block">
        ← Retour au catalogue
      </Link>

      <div className="border rounded-lg overflow-hidden shadow-sm bg-white relative">
        <div className="absolute top-4 right-4 bg-white rounded-full shadow-sm z-20">
          <FavoriButton articleId={article.id} />
        </div>
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-80 object-cover"
        />

        <div className="p-5 flex flex-col gap-3">
          <h1 className="text-2xl font-bold">{article.title}</h1>

          <p className="text-teal-600 font-bold text-2xl">
            {article.price},00 €
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-sm rounded">
              {categoryLabel}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-sm rounded">
              Taille {article.size}
            </span>
            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-sm rounded">
              {conditionLabel}
            </span>
          </div>

          <p className="text-gray-700">{article.description}</p>

          <div className="border-t pt-3 mt-1 text-sm text-gray-500">
            <p>
              Vendue par{" "}
              <span className="font-semibold text-gray-700">
                {article.userName}
              </span>
            </p>
            <p>Mis en ligne le {formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
