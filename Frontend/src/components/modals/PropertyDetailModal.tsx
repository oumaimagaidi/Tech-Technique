import { X, MapPin, Maximize2, BedDouble, Bath, Home, Calendar } from 'lucide-react';
import { Property } from '@/types/property';

interface PropertyDetailModalProps {
    property: Property;
    isOpen: boolean;
    onClose: () => void;
    onEditClick: () => void;
}

export function PropertyDetailModal({
    property,
    isOpen,
    onClose,
    onEditClick,
}: PropertyDetailModalProps) {
    if (!isOpen) return null;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const propertyTypeLabels = {
        apartment: 'Appartement',
        house: 'Maison',
        villa: 'Villa',
        studio: 'Studio',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                className="relative w-full max-w-4xl rounded-xl bg-white dark:bg-gray-900 shadow-2xl animate-in fade-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 rounded-full bg-gray-100 dark:bg-gray-800 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="grid md:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative h-64 md:h-auto md:min-h-[500px]">
                        <img
                            src={property.imageUrl}
                            alt={property.title}
                            className="h-full w-full rounded-l-xl object-cover"
                        />
                        <div className="absolute bottom-4 left-4">
                            <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                                {propertyTypeLabels[property.type]}
                            </span>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{property.title}</h2>
                            <div className="mt-2 flex items-center gap-2 text-xl font-bold text-blue-600">
                                {formatPrice(property.price)}
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <MapPin size={20} className="text-gray-500" />
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Ville</p>
                                    <p className="text-gray-500">{property.city}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Maximize2 size={20} className="text-gray-500" />
                                    <div>
                                        <p className="font-medium text-gray-700 dark:text-gray-300">Surface</p>
                                        <p className="text-gray-500">{property.surface} m²</p>
                                    </div>
                                </div>

                                {property.bedrooms && (
                                    <div className="flex items-center gap-3">
                                        <BedDouble size={20} className="text-gray-500" />
                                        <div>
                                            <p className="font-medium text-gray-700 dark:text-gray-300">Chambres</p>
                                            <p className="text-gray-500">{property.bedrooms}</p>
                                        </div>
                                    </div>
                                )}

                                {property.bathrooms && (
                                    <div className="flex items-center gap-3">
                                        <Bath size={20} className="text-gray-500" />
                                        <div>
                                            <p className="font-medium text-gray-700 dark:text-gray-300">Salles de bain</p>
                                            <p className="text-gray-500">{property.bathrooms}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <Home size={20} className="text-gray-500" />
                                    <div>
                                        <p className="font-medium text-gray-700 dark:text-gray-300">Type</p>
                                        <p className="text-gray-500 capitalize">
                                            {propertyTypeLabels[property.type]}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {property.createdAt && (
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <Calendar size={20} className="text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Ajouté le {new Date(property.createdAt).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={onEditClick}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                ✏️ Modifier ce bien
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}