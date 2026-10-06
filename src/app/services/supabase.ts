import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private _supabase: SupabaseClient;

  constructor() {
    this._supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get cliente(): SupabaseClient {
    return this._supabase;
  }

  async getPeliculas() {
    const { data, error } = await this._supabase
      .from('peliculas')
      .select(`
        id,
        nombre,
        duracion,
        clasificacion_edad,
        estado,
        imagen_url,
        generos ( nombre )
      `);

    if (error) {
      console.error('Error al obtener películas:', error);
      return [];
    }

    return data;
  }

  async getPeliculaById(id: string) {
    const { data, error } = await this._supabase
      .from('peliculas')
      .select(`
        id, nombre, sinopsis, duracion, clasificacion_edad, imagen_url, 
        generos ( nombre )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al obtener la película:', error);
      return null;
    }
    return data;
  }

  async getFuncionesByPelicula(idPelicula: number) {
    const { data, error } = await this._supabase
      .from('funciones')
      .select('*')
      .eq('id_pelicula', idPelicula)
      .order('fecha_hora_inicio', { ascending: true });

    if (error) {
      console.error('Error al traer funciones:', error);
      return [];
    }
    return data;
  }

  async getButacasOcupadas(idFuncion: number) {
    const { data, error } = await this._supabase
      .from('butacas_reservadas')
      .select('*')
      .eq('id_funcion', idFuncion);

    if (error) console.error('Error al traer butacas:', error);
    return data || [];
  }

  async bloquearButaca(idFuncion: number, fila: string, columna: number, tipo: string, idUsuario: string) {
    const { error } = await this._supabase
      .from('butacas_reservadas')
      .insert({
        id_funcion: idFuncion,
        fila: fila,
        columna: columna,
        tipo: tipo,
        estado: 'Bloqueada',
        id_usuario: idUsuario
      });
    
    if (error) throw error; 
  }

  async liberarButaca(idFuncion: number, fila: string, columna: number) {
    const { error } = await this._supabase
      .from('butacas_reservadas')
      .delete()
      .match({ id_funcion: idFuncion, fila: fila, columna: columna });
      
    if (error) throw error;
  }
}
