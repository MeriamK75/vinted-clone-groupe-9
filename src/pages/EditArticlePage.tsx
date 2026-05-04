import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { getUserId } from "../lib/userId";
import type { Article, ArticleFormData } from "../types/article";
import { ArticleForm } from "../components/ArticleForm";

type FormErrors = Partial<Record<keyof ArticleFormData, string>>;

function validate(data: ArticleFormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.title || data.title.length < 3 || data.title.length > 100)
    errors.title = "Le titre doit faire entre 3 et 100 caractères.";
  if (!data.description || data.description.length < 10 || data.description.length > 1000)
    errors.description = "La description doit faire entre 10 et 1000 caractères.";
  if (!data.price || data.price <= 0)
    errors.price = "Le prix doit être supérieur à 0.";
  if (!data.category) errors.category = "La catégorie est requise.";
  if (!data.condition) errors.condition = "L'état est requis.";
  if (!data.size) errors.size = "La taille est requise.";
  if (!data.imageUrl) errors.imageUrl = "L'URL de l'image est requise.";
  return errors;
}

export default function EditArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = getUserId();

  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<ArticleFormData | null>(null);

  const { isLoading, isError, data: article } = useQuery({
    queryKey: ["article", id],
    queryFn: () => api.get<Article>("/api/articles/" + id),
    enabled: !!id,
  });

  useEffect(() => {
    if (!article) return;
    if (article.userId !== userId) {
      setApiError("Vous n'êtes pas le propriétaire de cet article.");
      return;
    }
    setForm({
      title: article.title,
      description: article.description,
      price: article.price,
      category: article.category,
      condition: article.condition,
      size: article.size,
      imageUrl: article.imageUrl,
    });
  }, [article]);

  const mutation = useMutation({
    mutationFn: (data: ArticleFormData) => api.put<Article>("/api/articles/" + id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["article", id] });
      navigate("/articles/" + id);
    },
    onError: (error: Error) => {
      setApiError(error.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => prev ? ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }) : prev);
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form) return;
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setApiError("");
    mutation.mutate(form);
  };

  if (isLoading) return <p className="text-center py-10 text-gray-500">Chargement...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Erreur lors du chargement.</p>;
  if (!form && !apiError) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modifier l'annonce</h1>
      <ArticleForm
        form={form ?? { title: "", description: "", price: 0, category: "", condition: "", size: "", imageUrl: "" }}
        errors={errors}
        apiError={apiError}
        isPending={mutation.isPending}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Modifier"
      />
    </div>
  );
}