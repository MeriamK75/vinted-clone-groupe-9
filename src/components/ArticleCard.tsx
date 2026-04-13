import { Link } from "react-router-dom";
import type { Article } from "../types/article";
import { CATEGORIES, CONDITIONS } from "../types/article";

type ArticleCardProps = {
  article: Article;
};

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const categoryLabel =
    CATEGORIES.find((c) => c.id === article.category)?.label ?? article.category;

  const conditionLabel =
    CONDITIONS.find((c) => c.value === article.condition)?.label ?? article.condition;

  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(article.price);

  return (
    <Link
      to={`/articles/${article.id}`}
      className="block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
    >
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-3 flex flex-col gap-1">
        <h3 className="font-semibold text-base truncate">{article.title}</h3>

        <p className="text-teal-600 font-bold text-lg">{formattedPrice}</p>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
            {categoryLabel}
          </span>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
            Taille {article.size}
          </span>
          <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded">
            {conditionLabel}
          </span>
        </div>

        <p className="text-gray-400 text-xs mt-1">Par {article.userName}</p>
      </div>
    </Link>
  );
};