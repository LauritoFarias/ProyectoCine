export interface Pelicula {
  id: number;
  nombre: string;
  sinopsis?: string;
  duracion: number;
  clasificacion_edad: string;
  estado: string;
  imagen_url: string;
  fecha_estreno?: string;
  precio_base: number;
  precio_preventa?: number;
  
  // Propiedad extra para el front-end
  generosStr?: string; 
}