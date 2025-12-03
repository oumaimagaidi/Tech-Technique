import { motion } from 'framer-motion';
import { MapPin, Maximize2, BedDouble, Bath, Eye, Edit } from 'lucide-react';
import { Property } from '@/types/property';
import { HeartButton } from '@/components/ui/HeartButton';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  index?: number;
  onViewClick: (property: Property) => void;
  onEditClick: (property: Property) => void; 
}

export function PropertyCard({ 
  property, 
  index = 0,
  onViewClick,
  onEditClick 
}: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const favorite = isFavorite(property.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-lg bg-card card-shadow hover:card-shadow-hover transition-shadow duration-300"
    >
     
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          src={property.imageUrl}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
       
        <div className="absolute right-3 top-3">
          <HeartButton
            isFavorite={favorite}
            onToggle={() => toggleFavorite(property.id)}
            size="md"
          />
        </div>

       
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
            {property.type === 'apartment' && 'Appartement'}
            {property.type === 'house' && 'Maison'}
            {property.type === 'villa' && 'Villa'}
            {property.type === 'studio' && 'Studio'}
          </span>
        </div>
      </div>

     
      <div className="p-4">
       
        <p className="text-xl font-bold text-primary">
          {formatPrice(property.price)}
        </p>

      
        <h3 className="mt-1 text-base font-semibold text-card-foreground line-clamp-1">
          {property.title}
        </h3>

     
        <div className="mt-2 flex items-center gap-1.5 text-muted-foreground">
          <MapPin size={14} className="shrink-0" />
          <span className="text-sm">{property.city}</span>
        </div>

        <div className="mt-3 flex items-center gap-4 border-t border-border pt-3">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Maximize2 size={14} />
            <span className="text-sm font-medium">{property.surface} m²</span>
          </div>
          {property.bedrooms && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <BedDouble size={14} />
              <span className="text-sm font-medium">{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Bath size={14} />
              <span className="text-sm font-medium">{property.bathrooms}</span>
            </div>
          )}
        </div>

      
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onViewClick(property)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            <Eye size={14} />
            Voir
          </button>
          <button
            onClick={() => onEditClick(property)} 
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Edit size={14} />
            Modifier
          </button>
        </div>
      </div>
    </motion.article>
  );
}