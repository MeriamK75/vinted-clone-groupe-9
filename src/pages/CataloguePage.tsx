import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { ArticleCard } from "../components/ArticleCard";
import { SearchBar } from "../components/SearchBar";

export const CataloguePage = () => {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["articles"] });
  }, []);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState("date_desc");

  const { data: articles, isLoading, isError } = useQuery({
    queryKey: ["articles", search, category, condition, priceMin, priceMax, sort],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (condition) params.set("condition", condition);
      if (priceMin) params.set("priceMin", priceMin);
      if (priceMax) params.set("priceMax", priceMax);
      if (sort) params.set("sort", sort);
      return api.get<Article[]>("/api/articles?" + params.toString());
    },
  });

 

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Catalogue</h1>
      <SearchBar
        onSearch={setSearch}
        onCategoryChange={setCategory}
        onConditionChange={setCondition}
        onPriceMinChange={setPriceMin}
        onPriceMaxChange={setPriceMax}
        onSortChange={setSort}
      />
      {isLoading && (
        <p className="text-center py-10 text-gray-500">Chargement des articles...</p>
      )}
      {isError && (
        <p className="text-center py-10 text-red-500">Erreur lors du chargement des articles.</p>
      )}
      {articles?.length === 0 ? (
        <p className="text-center py-10 text-gray-500">Aucun article ne correspond à votre recherche.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {articles?.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CataloguePage;