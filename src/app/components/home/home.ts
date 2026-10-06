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

  topVentas = signal<Pelicula[]>([]);
  enCartelera = signal<Pelicula[]>([]);
  proximamente = signal<Pelicula[]>([]);

  async ngOnInit() {
    await this.cargarPeliculas();
  }

  async cargarPeliculas() {
    const data = await this.supabaseService.getPeliculas();
    
    const peliculasFormateadas: Pelicula[] = data.map((pelicula: any) => {
      const generosArray = pelicula.generos ? pelicula.generos.map((g: any) => g.nombre) : [];
      
      return {
        ...pelicula,
        generosStr: generosArray.join(', ')
      };
    });

    this.enCartelera.set(peliculasFormateadas.filter(p => p.estado === 'En Cartelera'));
    this.proximamente.set(peliculasFormateadas.filter(p => p.estado === 'Próximamente'));
    
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = element.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: yOffset, behavior: 'smooth' });
    }
  }
}