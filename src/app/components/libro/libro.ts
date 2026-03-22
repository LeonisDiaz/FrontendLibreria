import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LibroNuevo } from '../../interfaces/libro.interfaces';
import { LibroService } from '../../services/libro';

@Component({
  selector: 'app-libro',
  imports: [RouterLink, FormsModule],
  templateUrl: './libro.html',
  styleUrl: './libro.css',
})
export class Libro implements OnInit {
  libroService = inject(LibroService);
  private route = inject(ActivatedRoute);

  libroId = signal('');

  libroResource = this.libroService.libroDetalleResource(() => this.libroId());

  libro = computed(() => {
    const response = this.libroResource.value();
    return response?.libro ?? null;
  });

  isLoadingLibro = computed(() => this.libroResource.isLoading());

  hasError = computed(() => !!this.libroResource.error());

  notFound = computed(() => {
    if (this.isLoadingLibro() || this.hasError()) {
      return false;
    }
    return !this.libro();
  });

  modoEdicion = signal(false);
  guardando = signal(false);
  errorEdicion = signal<string | null>(null);

  libroEdicion: LibroNuevo = {
    titulo: '',
    autor: '',
    apublicacion: '',
    editorial: '',
    categoria: '',
    sede: '',
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.libroId.set(id);
    }
  }

  entrarEdicion() {
    const l = this.libro();
    if (!l) {
      return;
    }
    this.libroEdicion = {
      titulo: l.titulo,
      autor: l.autor,
      apublicacion: l.apublicacion,
      editorial: l.editorial,
      categoria: l.categoria,
      sede: l.sede,
    };
    this.errorEdicion.set(null);
    this.modoEdicion.set(true);
  }

  cancelarEdicion() {
    this.modoEdicion.set(false);
    this.errorEdicion.set(null);
  }

  guardarCambios(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const id = this.libroId();
    if (!id) {
      return;
    }
    this.errorEdicion.set(null);
    this.guardando.set(true);
    this.libroService
      .actualizarLibro(id, this.libroEdicion)
      .pipe(finalize(() => this.guardando.set(false)))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.libroResource.reload();
            this.modoEdicion.set(false);
          } else {
            this.errorEdicion.set(res.msg ?? res.message ?? 'No se pudo actualizar el libro');
          }
        },
        error: (err) => {
          const msg =
            err.error?.msg ?? err.error?.message ?? err.message ?? 'Error al actualizar el libro';
          this.errorEdicion.set(msg);
        },
      });
  }

  formatDate(iso: string | undefined): string {
    if (!iso) {
      return '';
    }
    return new Date(iso).toLocaleDateString('es-MX', { dateStyle: 'medium' });
  }
}
