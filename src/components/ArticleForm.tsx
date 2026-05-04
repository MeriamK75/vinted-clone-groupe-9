import type { ArticleFormData } from "../types/article";
import { CATEGORIES, CONDITIONS } from "../types/article";

type FormErrors = Partial<Record<keyof ArticleFormData, string>>;

type ArticleFormProps = {
  form: ArticleFormData;
  errors: FormErrors;
  apiError: string;
  isPending: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.MouseEvent) => void;
  submitLabel: string;
};

export const ArticleForm = ({ form, errors, apiError, isPending, onChange, onSubmit, submitLabel }: ArticleFormProps) => {
  return (
    <div className="flex flex-col gap-4">
      {apiError && <p className="text-red-500 mb-4">{apiError}</p>}

      <div>
        <input name="title" value={form.title} onChange={onChange} placeholder="Titre" className="w-full px-4 py-2 border rounded-lg" />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" className="w-full px-4 py-2 border rounded-lg" rows={4} />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <input name="price" type="number" value={form.price || ""} onChange={onChange} placeholder="Prix" className="w-full px-4 py-2 border rounded-lg" />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>

      <div>
        <select name="category" value={form.category} onChange={onChange} className="w-full px-4 py-2 border rounded-lg">
          <option value="">Catégorie</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      <div>
        <select name="condition" value={form.condition} onChange={onChange} className="w-full px-4 py-2 border rounded-lg">
          <option value="">État</option>
          {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
      </div>

      <div>
        <input name="size" value={form.size} onChange={onChange} placeholder="Taille (ex: M, 42...)" className="w-full px-4 py-2 border rounded-lg" />
        {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
      </div>

      <div>
        <input name="imageUrl" value={form.imageUrl} onChange={onChange} placeholder="URL de l'image" className="w-full px-4 py-2 border rounded-lg" />
        {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
      </div>

      <button onClick={onSubmit} disabled={isPending} className="px-4 py-2 bg-teal-600 text-white rounded-lg">
        {isPending ? "En cours..." : submitLabel}
      </button>
    </div>
  );
};