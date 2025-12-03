import { Property } from "@/types/property";
import { PropertyCard } from "./PropertyCard";

interface PropertyGridProps {
  properties: Property[];
  emptyMessage?: string;
  onViewClick?: (property: Property) => void; 
  onEditClick?: (property: Property) => void; 
}

export function PropertyGrid({ 
  properties, 
  emptyMessage = 'Aucun bien trouvé',
  onViewClick = () => {},  
  onEditClick = () => {}   
}: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property, index) => (
        <PropertyCard 
          key={property.id} 
          property={property} 
          index={index}
          onViewClick={onViewClick}   
          onEditClick={onEditClick}   
        />
      ))}
    </div>
  );
}