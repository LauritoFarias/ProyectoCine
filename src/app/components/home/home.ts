import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase';
import { AuthService } from '../../services/auth';
import { Pelicula } from '../../models/pelicula';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private supabaseService = inject(SupabaseService);
  public authService = inject(AuthService);

  // Declaramos los signals tipados con nuestra interfaz
  topVentas = signal<Pelicula[]>([]);
  enCartelera = signal<Pelicula[]>([]);
  proximamente = signal<Pelicula[]>([]);

  // (Opcional) Como mencionaste, si necesitaras un modelo individual para un formulario:
  // peliculaActual = signal<Pelicula>({ ...valores por defecto... });

  async ngOnInit() {
    await this.cargarPeliculas();
  }

  async cargarPeliculas() {
    const data = await this.supabaseService.getPeliculas();
    
    const peliculasFormateadas: Pelicula[] = data.map((pelicula: any) => {
      const generosArray = pelicula.generos ? pelicula.generos.map((g: any) => g.nombre) : [];
      
      return {
        ...pelicula, // Operador spread: copia id, nombre, duracion, etc. automáticamente
        generosStr: generosArray.join(', ') // Agregamos nuestro string formateado
      };
    });

    // Filtramos y ACTUALIZAMOS los signals usando .set()
    this.enCartelera.set(peliculasFormateadas.filter(p => p.estado === 'En Cartelera'));
    this.proximamente.set(peliculasFormateadas.filter(p => p.estado === 'Próximamente'));
    
    // Si tuvieras datos de topVentas, harías lo mismo:
    // this.topVentas.set(peliculasFormateadas.filter(p => ...));
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}