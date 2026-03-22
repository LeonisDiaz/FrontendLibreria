import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LibroNuevo } from '../../interfaces/libro.interfaces';
import { LibroService } from '../../services/libro';

@Component({
  selector: 'app-lista',
  imports: [FormsModule],
  templateUrl: './lista.html',
  styleUrl: './lista.css',
})
export class Lista {
  libroService = inject(LibroService);
  private router = inject(Router);

  mostrarFormulario = signal(false);
  guardando = signal(false);
  errorCreacion = signal<string | null>(null);
  eliminando = signal<string | null>(null);

  nuevoLibro: LibroNuevo = {
    titulo: '',
    autor: '',
    apublicacion: '',
    editorial: '',
    categoria: '',
    sede: '',
  };

  libros = computed(() => {
    const response = this.libroService.libroResource.value();
    return response?.libros ?? [];
  });

  isLoadingLibros = computed(() => this.libroService.libroResource.isLoading());

  hasErrorLibros = computed(() => !!this.libroService.libroResource.error());

  guardarLibro(form?: NgForm) {
    if (form?.invalid) {
      return;
    }
    this.errorCreacion.set(null);
    this.guardando.set(true);
    this.libroService
      .crearLibro(this.nuevoLibro)
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.libroService.refetchLibros();
            this.resetNuevoLibro();
            form?.resetForm({
              titulo: '',
              autor: '',
              apublicacion: '',
              editorial: '',
              categoria: '',
              sede: '',
            });
            this.mostrarFormulario.set(false);
          } else {
            this.errorCreacion.set(res.msg ?? res.message ?? 'No se pudo crear el libro');
          }
        },
        error: (err) => {
          const msg =
            err.error?.msg ?? err.error?.message ?? err.message ?? 'Error al crear el libro';
          this.errorCreacion.set(msg);
        },
      });
  }

  cancelarFormulario(form?: NgForm) {
    this.mostrarFormulario.set(false);
    this.errorCreacion.set(null);
    this.resetNuevoLibro();
    form?.resetForm({
      titulo: '',
      autor: '',
      apublicacion: '',
      editorial: '',
      categoria: '',
      sede: '',
    });
  }

  private resetNuevoLibro() {
    this.nuevoLibro = {
      titulo: '',
      autor: '',
      apublicacion: '',
      editorial: '',
      categoria: '',
      sede: '',
    };
  }

  verDetalle(id: string) {
    this.router.navigate(['/lists', id]);
  }

  eliminarLibro(id: string) {
    this.eliminando.set(id);
    this.libroService
      .eliminarLibro(id)
      .pipe(finalize(() => this.eliminando.set(null)))
      .subscribe({
        next: () => this.libroService.refetchLibros(),
      });
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-MX', { dateStyle: 'medium' });
  }
}
