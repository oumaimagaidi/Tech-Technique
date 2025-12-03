import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface Filters {
  priceRange: string;
  propertyType: string;
  city: string;
}

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  cities: string[];
}

const priceRanges = [
  { value: 'all', label: 'Tous les prix' },
  { value: '0-200000', label: 'Moins de 200 000 €' },
  { value: '200000-400000', label: '200 000 € - 400 000 €' },
  { value: '400000-600000', label: '400 000 € - 600 000 €' },
  { value: '600000-1000000', label: '600 000 € - 1 000 000 €' },
  { value: '1000000+', label: 'Plus de 1 000 000 €' },
];

const propertyTypes = [
  { value: 'all', label: 'Tous les types' },
  { value: 'apartment', label: 'Appartement' },
  { value: 'house', label: 'Maison' },
  { value: 'villa', label: 'Villa' },
  { value: 'studio', label: 'Studio' },
];

export function FilterBar({ filters, onFiltersChange, cities }: FilterBarProps) {
  const hasActiveFilters =
    filters.priceRange !== 'all' ||
    filters.propertyType !== 'all' ||
    filters.city !== 'all';

  const clearFilters = () => {
    onFiltersChange({
      priceRange: 'all',
      propertyType: 'all',
      city: 'all',
    });
  };

  const updateFilter = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 rounded-xl border border-border bg-card p-4 card-shadow"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-2 text-foreground">
          <SlidersHorizontal size={18} className="text-primary" />
          <span className="font-medium">Filtres</span>
        </div>


        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-center">

          <Select
            value={filters.priceRange}
            onValueChange={(value) => updateFilter('priceRange', value)}
          >
            <SelectTrigger className="w-full sm:w-[200px] bg-background">
              <SelectValue placeholder="Prix" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {priceRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>


          <Select
            value={filters.propertyType}
            onValueChange={(value) => updateFilter('propertyType', value)}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-background">
              <SelectValue placeholder="Type de bien" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.city}
            onValueChange={(value) => updateFilter('city', value)}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-background">
              <SelectValue placeholder="Ville" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              <SelectItem value="all">Toutes les villes</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>


        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={16} className="mr-1" />
              Effacer
            </Button>
          </motion.div>
        )}
      </div>


      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4"
        >
          {filters.priceRange !== 'all' && (
            <FilterPill
              label={priceRanges.find((r) => r.value === filters.priceRange)?.label || ''}
              onRemove={() => updateFilter('priceRange', 'all')}
            />
          )}
          {filters.propertyType !== 'all' && (
            <FilterPill
              label={propertyTypes.find((t) => t.value === filters.propertyType)?.label || ''}
              onRemove={() => updateFilter('propertyType', 'all')}
            />
          )}
          {filters.city !== 'all' && (
            <FilterPill
              label={filters.city}
              onRemove={() => updateFilter('city', 'all')}
            />
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
    >
      {label}
      <button
        onClick={onRemove}
        className="rounded-full p-0.5 hover:bg-primary/20 transition-colors"
      >
        <X size={14} />
      </button>
    </motion.span>
  );
}
