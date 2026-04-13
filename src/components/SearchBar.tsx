import { useState } from "react";
import { CATEGORIES, CONDITIONS } from "../types/article";

type SearchBarProps = {
  onSearch: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onConditionChange: (condition: string) => void;
  onPriceMinChange: (priceMin: string) => void;
  onPriceMaxChange: (priceMax: string) => void;
  onSortChange: (sort: string) => void;
};

export const SearchBar = ({
  onSearch,
  onCategoryChange,
  onConditionChange,
  onPriceMinChange,
  onPriceMaxChange,
  onSortChange,
}: SearchBarProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState("");

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        type="text"
        value={search}
        placeholder="Rechercher un article..."
        onChange={(e) => {
          setSearch(e.target.value);
          onSearch(e.target.value);
        }}
        className="flex-1 min-w-48 px-4 py-2 border rounded-lg"
      />

      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          onCategoryChange(e.target.value);
        }}
        className="px-4 py-2 border rounded-lg"
      >
        <option value="">Toutes les catégories</option>
        {CATEGORIES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        value={condition}
        onChange={(e) => {
          setCondition(e.target.value);
          onConditionChange(e.target.value);
        }}
        className="px-4 py-2 border rounded-lg"
      >
        <option value="">Tous les états</option>
        {CONDITIONS.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={priceMin}
        placeholder="Prix min"
        min={0}
        onChange={(e) => {
          setPriceMin(e.target.value);
          onPriceMinChange(e.target.value);
        }}
        className="w-28 px-4 py-2 border rounded-lg"
      />

      <input
        type="number"
        value={priceMax}
        placeholder="Prix max"
        min={0}
        onChange={(e) => {
          setPriceMax(e.target.value);
          onPriceMaxChange(e.target.value);
        }}
        className="w-28 px-4 py-2 border rounded-lg"
      />

      <select
        value={sort}
        onChange={(e) => {
          setSort(e.target.value);
          onSortChange(e.target.value);
        }}
        className="px-4 py-2 border rounded-lg"
      >
        <option value="date_desc">Plus récent</option>
        <option value="price_asc">Prix croissant</option>
        <option value="price_desc">Prix décroissant</option>
      </select>
    </div>
  );
};