import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Property } from '@/types/property';
import { propertyService } from '@/services/propertyService';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { FilterBar, Filters } from '@/components/property/FilterBar';
import { Layout } from '@/components/layout/Layout';
import { PropertyDetailModal } from '@/components/modals/PropertyDetailModal';
import { PropertyFormModal } from '@/components/modals/PropertyFormModal';
import { Plus } from 'lucide-react';

const Index = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    priceRange: 'all',
    propertyType: 'all',
    city: 'all',
  });


  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getAll();
      setProperties(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des propriétés');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const cities = useMemo(() => {
    const uniqueCities = [...new Set(properties.map((p) => p.city))];
    return uniqueCities.sort();
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Price filter
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map((v) => {
          if (v.includes('+')) return Infinity;
          return parseInt(v);
        });
        if (property.price < min || property.price > (max || Infinity)) {
          return false;
        }
      }

      // Type filter
      if (filters.propertyType !== 'all' && property.type !== filters.propertyType) {
        return false;
      }

      // City filter
      if (filters.city !== 'all' && property.city !== filters.city) {
        return false;
      }

      return true;
    });
  }, [properties, filters]);


  const handleViewClick = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailModalOpen(true);
  };

  const handleEditClick = (property: Property) => {
    setEditingProperty(property);
    setIsFormModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingProperty(null);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (formData.id) {
        // Mise à jour
        await propertyService.update(formData.id, formData);
      } else {
        // Création
        await propertyService.create(formData);
      }

      // Recharger la liste
      await loadProperties();
      setIsFormModalOpen(false);
      setEditingProperty(null);
    } catch (error) {
      console.error('Error saving property:', error);
      throw error;
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Découvrez nos biens
            </h1>
            <p className="mt-2 text-muted-foreground">
              {filteredProperties.length} propriété{filteredProperties.length !== 1 ? 's' : ''} disponible{filteredProperties.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus size={18} />
            Ajouter un bien
          </button>
        </div>
      </motion.div>


      <FilterBar filters={filters} onFiltersChange={setFilters} cities={cities} />


      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}


      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      ) : (
        <PropertyGrid
          properties={filteredProperties}
          emptyMessage="Aucun bien ne correspond à vos critères"
          onViewClick={handleViewClick}
          onEditClick={handleEditClick}
        />
      )}

      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onEditClick={() => {
            setIsDetailModalOpen(false);
            setEditingProperty(selectedProperty);
            setIsFormModalOpen(true);
          }}
        />
      )}

      <PropertyFormModal
        property={editingProperty}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProperty(null);
        }}
        onSubmit={handleFormSubmit}
      />
    </Layout>
  );
};

export default Index;