import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase';
import { PerfilUsuario } from '../models/perfilUsuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private supabase = inject(SupabaseService).cliente;
  private router = inject(Router);

  // Ahora el signal usa la interfaz importada
  currentUser = signal<PerfilUsuario | null>(null);

  constructor() {
    this.iniciarListenerDeSesion();
  }

  private iniciarListenerDeSesion() {
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await this.cargarPerfil(session.user.id);
      } else {
        this.currentUser.set(null);
      }
    });
  }

  // Trae el nombre y el rol desde tu tabla 'clientes'
  private async cargarPerfil(userId: string) {
    console.log("Buscando perfil en tabla clientes para el ID:", userId);

    const { data, error } = await this.supabase
      .from('clientes')
      .select('id, nombre, apellido, id_rol')
      .eq('id', userId)
      .single();

    if (error) {
      // Si hay error (como RLS o que no exista la fila), lo imprimimos en rojo
      console.error("Error al buscar el perfil del cliente:", error);
      
      // COMENTAMOS ESTO TEMPORALMENTE PARA QUE NO TE CIERRE LA SESIÓN
      // await this.supabase.auth.signOut(); 
      // this.currentUser.set(null);
      return; 
    }

    if (data) {
      console.log("¡Perfil encontrado!", data);
      this.currentUser.set(data);
    }
  }

  // MÉTODO DE REGISTRO ACTUALIZADO (Asigna rol Cliente por defecto)
  async registrarCliente(datos: any) {
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email: datos.email,
      password: datos.password,
    });
    if (authError) throw authError;

    if (authData.user) {
      const { error: dbError } = await this.supabase.from('clientes').insert({
        id: authData.user.id,
        nombre: datos.nombre,
        apellido: datos.apellido,
        fecha_nacimiento: datos.fechaNacimiento,
        tipo_sangre: datos.tipoSangre,
        color_ojos: datos.colorOjos,
        dias_vacaciones: datos.diasVacaciones,
        id_rol: 1 // <-- ASIGNAMOS ROL CLIENTE
      });
      if (dbError) throw dbError;
    }
    return authData.user;
  }

  // NUEVO: MÉTODO DE LOGIN
  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  // NUEVO: MÉTODO DE LOGOUT
  async logout() {
    await this.supabase.auth.signOut();
    this.router.navigate(['/']);
  }

}
