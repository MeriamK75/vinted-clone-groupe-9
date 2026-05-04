import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { ArticleForm} from "../components/ArticleForm";

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
    <ArticleForm
      form={form}
      errors={errors}
      apiError={apiError}
      isPending={mutation.isPending}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitLabel="Publier"
    />
  </div>
);
}