import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

import type { Article, ArticleFormData } from "../types/article";
import { CATEGORIES, CONDITIONS } from "../types/article";

type FormErrors = Partial<Record<keyof ArticleFormData, string>>;

function validate(data: ArticleFormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.title || data.title.length < 3 || data.title.length > 100)
    errors.title = "Le titre doit faire entre 3 et 100 caractères.";
  if (!data.description || data.description.length < 10 || data.description.length > 1000)
    errors.description = "La description doit faire entre 10 et 1000 caractères.";
  if (!data.price || data.price <= 0)
    errors.price = "Le prix doit être supérieur à 0.";
  if (!data.category)
    errors.category = "La catégorie est requise.";
  if (!data.condition)
    errors.condition = "L'état est requis.";
  if (!data.size)
    errors.size = "La taille est requise.";
  if (!data.imageUrl)
    errors.imageUrl = "L'URL de l'image est requise.";
  return errors;
}

export default function PublishPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<ArticleFormData>({
    title: "",
    description: "",
    price: 0,
    category: "",
    condition: "",
    size: "",
    imageUrl: "",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ArticleFormData) => api.post<Article>("/api/articles", data),

    onSuccess: async (article) => {
      await queryClient.invalidateQueries({ queryKey: ["articles"], exact: false });
      await queryClient.refetchQueries({ queryKey: ["articles"], exact: false });
      navigate("/articles/" + article.id);
    },
    onError: (error: Error) => {
      setApiError(error.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setApiError("");
    mutation.mutate(form);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Publier une annonce</h1>

      {apiError && <p className="text-red-500 mb-4">{apiError}</p>}

      <div className="flex flex-col gap-4">
        <div>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Titre"
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-4 py-2 border rounded-lg"
            rows={4}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <input
            name="price"
            type="number"
            value={form.price || ""}
            onChange={handleChange}
            placeholder="Prix"
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Catégorie</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">État</option>
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
        </div>

        <div>
          <input
            name="size"
            value={form.size}
            onChange={handleChange}
            placeholder="Taille (ex: M, 42...)"
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
        </div>

        <div>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="URL de l'image"
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg"
        >
          {mutation.isPending ? "Publication..." : "Publier"}
        </button>
      </div>
    </div>
  );
}