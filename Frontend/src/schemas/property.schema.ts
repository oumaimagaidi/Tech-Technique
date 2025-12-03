import { z } from 'zod';


export const PropertySchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string()
        .min(1, 'Le titre est requis')
        .max(200, 'Le titre ne doit pas dépasser 200 caractères'),
    city: z.string()
        .min(1, 'La ville est requise')
        .max(100, 'La ville ne doit pas dépasser 100 caractères'),
    price: z.coerce.number()
        .positive('Le prix doit être positif')
        .max(10000000, 'Le prix est trop élevé'),
    surface: z.coerce.number()
        .positive('La surface doit être positive')
        .int('La surface doit être un nombre entier')
        .max(1000, 'La surface est trop grande'),
    bedrooms: z.coerce.number()
        .int('Nombre de chambres invalide')
        .min(0, 'Le nombre de chambres ne peut pas être négatif')
        .max(10, 'Trop de chambres')
        .optional()
        .or(z.literal('').transform(() => undefined)),
    bathrooms: z.coerce.number()
        .int('Nombre de salles de bain invalide')
        .min(0, 'Le nombre de salles de bain ne peut pas être négatif')
        .max(10, 'Trop de salles de bain')
        .optional()
        .or(z.literal('').transform(() => undefined)),
    type: z.enum(['apartment', 'house', 'villa', 'studio'], {
        errorMap: () => ({ message: 'Type de bien invalide' })
    }),
    imageUrl: z.string()
        .url('URL invalide')
        .optional()
        .or(z.literal('')),
});


export type PropertyFormData = z.infer<typeof PropertySchema>;