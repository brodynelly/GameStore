export interface Game {
  id: number;
  title: string;
  price: number;
  description: string;
  shortDescription: string;
  imageUrl: string;
  developer: string;
  releaseDate: string;
  genres: string[];
  rating: number;
  inStock: boolean;
}