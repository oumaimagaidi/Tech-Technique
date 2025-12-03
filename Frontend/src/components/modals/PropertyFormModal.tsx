import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Property } from '@/types/property';
import { PropertySchema, PropertyFormData } from '@/schemas/property.schema';

interface PropertyFormModalProps {
    property?: Property | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PropertyFormData) => Promise<void>;
}

export function PropertyFormModal({
    property,
    isOpen,
    onClose,
    onSubmit,
}: PropertyFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<PropertyFormData>({
        title: '',
        city: '',
        price: 0,
        surface: 0,
        bedrooms: undefined,
        bathrooms: undefined,
        type: 'apartment',
        imageUrl: '',
        ...(property?.id && { id: property.id }),
    });

    const isEditMode = !!property;

    // Initialiser le formulaire
    useEffect(() => {
        if (property) {
            setFormData({
                id: property.id,
                title: property.title,
                city: property.city,
                price: property.price,
                surface: property.surface,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                type: property.type,
                imageUrl: property.imageUrl,
            });
        } else {
            setFormData({
                title: '',
                city: '',
                price: 0,
                surface: 0,
                bedrooms: undefined,
                bathrooms: undefined,
                type: 'apartment',
                imageUrl: '',
            });
        }
        setErrors({});
    }, [property, isOpen]);

    const handleChange = (field: keyof PropertyFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        try {
            if (isEditMode) {
                PropertySchema.parse(formData);
            } else {
                const { id, ...createData } = formData;
                PropertySchema.omit({ id: true }).parse(createData);
            }
            setErrors({});
            return true;
        } catch (error: any) {
            const newErrors: Record<string, string> = {};
            error.errors.forEach((err: any) => {
                if (err.path[0]) {
                    newErrors[err.path[0]] = err.message;
                }
            });
            setErrors(newErrors);
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                className="relative w-full max-w-2xl rounded-xl bg-white dark:bg-gray-900 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isEditMode ? 'Modifier le bien' : 'Ajouter un nouveau bien'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Titre */}
                        <div className="space-y-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Titre *
                            </label>
                            <input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                                placeholder="Ex: Appartement lumineux avec balcon"
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title}</p>
                            )}
                        </div>

                        {/* Ville */}
                        <div className="space-y-2">
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Ville *
                            </label>
                            <input
                                id="city"
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                                placeholder="Ex: Paris 11ème"
                            />
                            {errors.city && (
                                <p className="text-sm text-red-500">{errors.city}</p>
                            )}
                        </div>

                        {/* Prix */}
                        <div className="space-y-2">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Prix (€) *
                            </label>
                            <input
                                id="price"
                                type="number"
                                min="0"
                                step="1000"
                                value={formData.price || ''}
                                onChange={(e) => handleChange('price', e.target.value ? Number(e.target.value) : 0)}
                                className={`w-full px-3 py-2 border rounded-lg ${errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                            />
                            {errors.price && (
                                <p className="text-sm text-red-500">{errors.price}</p>
                            )}
                        </div>

                        {/* Surface */}
                        <div className="space-y-2">
                            <label htmlFor="surface" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Surface (m²) *
                            </label>
                            <input
                                id="surface"
                                type="number"
                                min="0"
                                value={formData.surface || ''}
                                onChange={(e) => handleChange('surface', e.target.value ? Number(e.target.value) : 0)}
                                className={`w-full px-3 py-2 border rounded-lg ${errors.surface ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                            />
                            {errors.surface && (
                                <p className="text-sm text-red-500">{errors.surface}</p>
                            )}
                        </div>

                        {/* Chambres */}
                        <div className="space-y-2">
                            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nombre de chambres
                            </label>
                            <input
                                id="bedrooms"
                                type="number"
                                min="0"
                                max="10"
                                value={formData.bedrooms || ''}
                                onChange={(e) => handleChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
                                className={`w-full px-3 py-2 border rounded-lg ${errors.bedrooms ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                            />
                            {errors.bedrooms && (
                                <p className="text-sm text-red-500">{errors.bedrooms}</p>
                            )}
                        </div>

                        {/* Salles de bain */}
                        <div className="space-y-2">
                            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nombre de salles de bain
                            </label>
                            <input
                                id="bathrooms"
                                type="number"
                                min="0"
                                max="10"
                                value={formData.bathrooms || ''}
                                onChange={(e) => handleChange('bathrooms', e.target.value ? Number(e.target.value) : undefined)}
                                className={`w-full px-3 py-2 border rounded-lg ${errors.bathrooms ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                            />
                            {errors.bathrooms && (
                                <p className="text-sm text-red-500">{errors.bathrooms}</p>
                            )}
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Type de bien *
                            </label>
                            <select
                                id="type"
                                value={formData.type}
                                onChange={(e) => handleChange('type', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg ${errors.type ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                            >
                                <option value="apartment">Appartement</option>
                                <option value="house">Maison</option>
                                <option value="villa">Villa</option>
                                <option value="studio">Studio</option>
                            </select>
                            {errors.type && (
                                <p className="text-sm text-red-500">{errors.type}</p>
                            )}
                        </div>

                        {/* Image URL */}
                        <div className="space-y-2 md:col-span-2">
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                URL de l'image
                            </label>
                            <input
                                id="imageUrl"
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) => handleChange('imageUrl', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg ${errors.imageUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                                placeholder="https://example.com/image.jpg"
                            />
                            {errors.imageUrl && (
                                <p className="text-sm text-red-500">{errors.imageUrl}</p>
                            )}
                            <p className="text-sm text-gray-500">
                                Laissez vide pour utiliser une image par défaut
                            </p>
                        </div>
                    </div>

                    {/* Footer avec boutons */}
                    <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>Enregistrement...</>
                            ) : (
                                <>
                                    <Save size={16} />
                                    {isEditMode ? 'Mettre à jour' : 'Créer le bien'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}