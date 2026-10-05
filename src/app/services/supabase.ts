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
}
