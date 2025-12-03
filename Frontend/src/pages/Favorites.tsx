import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react'; 
import { Link } from 'react-router-dom';
import { Property } from '@/types/property';
import { propertyService } from '@/services/propertyService';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { Layout } from '@/components/layout/Layout';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { Button } from '@/components/ui/button';

const Favorites = () => {
  const { favorites, removeFavorite } = useFavoritesContext(); 
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFavorites, setSelectedFavorites] = useState<string[]>([]); 

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAll();
      setAllProperties(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des propriétés');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const favoriteProperties = allProperties.filter((property) =>
    favorites.includes(property.id)
  );

 
  const toggleSelection = (propertyId: string) => {
    setSelectedFavorites(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  
  const removeSelectedFavorites = async () => {
    if (selectedFavorites.length === 0) return;
    
    if (window.confirm(`Supprimer ${selectedFavorites.length} favori(s) ?`)) {
      try {
        for (const propertyId of selectedFavorites) {
          await removeFavorite(propertyId);
        }
        setSelectedFavorites([]);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  return (
    <Layout>
     
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-2"
            >
              <Link to="/">
                <ArrowLeft size={16} />
                Retour aux biens
              </Link>
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-favorite/10">
                <Heart size={20} className="text-favorite" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                  Mes Favoris
                </h1>
                <p className="mt-1 text-muted-foreground">
                  {favoriteProperties.length} bien{favoriteProperties.length !== 1 ? 's' : ''} sauvegardé{favoriteProperties.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

        
          {selectedFavorites.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={removeSelectedFavorites}
              className="gap-2"
            >
              <Heart size={16} />
              Supprimer ({selectedFavorites.length})
            </Button>
          )}
        </div>
      </motion.div>

     
      {selectedFavorites.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 rounded-lg bg-primary/10 p-4"
        >
          <p className="text-primary">
            {selectedFavorites.length} favori(s) sélectionné(s)
          </p>
        </motion.div>
      )}

     
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

     
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      ) : favoriteProperties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-16"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Heart size={32} className="text-muted-foreground" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            Aucun favori pour le moment
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            Explorez nos biens et cliquez sur le cœur pour ajouter vos favoris
          </p>
          <Button asChild className="mt-6">
            <Link to="/">Découvrir les biens</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteProperties.map((property) => (
            <FavoritePropertyCard
              key={property.id}
              property={property}
              isSelected={selectedFavorites.includes(property.id)}
              onToggleSelect={() => toggleSelection(property.id)}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

interface FavoritePropertyCardProps {
  property: Property;
  isSelected: boolean;
  onToggleSelect: () => void;
}

function FavoritePropertyCard({ property, isSelected, onToggleSelect }: FavoritePropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();

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
      className={`group relative overflow-hidden rounded-lg bg-card card-shadow transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
   
      <div className="absolute left-3 top-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="h-5 w-5 cursor-pointer rounded border-border text-primary focus:ring-primary"
        />
      </div>

      
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        
        <div className="absolute right-3 top-3">
          <button
            onClick={() => toggleFavorite(property.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
          >
            <Heart
              size={20}
              className={isFavorite(property.id) ? 'fill-favorite text-favorite' : 'text-gray-600'}
            />
          </button>
        </div>
      </div>


      <div className="p-4">
        <p className="text-xl font-bold text-primary">
          {formatPrice(property.price)}
        </p>

        <h3 className="mt-1 text-base font-semibold text-card-foreground line-clamp-1">
          {property.title}
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          {property.city}
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              {property.surface} m²
            </span>
            {property.bedrooms && (
              <span className="text-sm text-muted-foreground">
                🛏️ {property.bedrooms}
              </span>
            )}
          </div>
          
          <button
            onClick={() => toggleFavorite(property.id)}
            className="text-sm font-medium text-favorite hover:text-favorite/80"
          >
            Retirer des favoris
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default Favorites;