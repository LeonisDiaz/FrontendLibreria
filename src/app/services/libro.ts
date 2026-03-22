import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
  LibroNuevo,
  LibroResponse,
} from '../interfaces/libro.interfaces';

@Injectable({
  providedIn: 'root',
})
export class LibroService {
  http = inject(HttpClient);
  base_url = environment.url;

  private dataUrl = `${this.base_url}lists`;

  libroResource = httpResource<LibroResponse>(() => this.dataUrl, {
    defaultValue: { libros: [], success: true },
  });

  libroDetalleResource = (id: () => string) =>
    httpResource<LibroResponse>(() => {
      const _id = id();
      return _id ? `${this.dataUrl}/${_id}` : undefined;
    });

  crearLibro(data: LibroNuevo) {
    return this.http.post<LibroResponse>(this.dataUrl, data);
  }

  actualizarLibro(id: string, data: LibroNuevo) {
    return this.http.put<LibroResponse>(`${this.dataUrl}/${id}`, data);
  }

  eliminarLibro(id: string) {
    return this.http.delete<LibroResponse>(`${this.dataUrl}/${id}`);
  }

  refetchLibros() {
    this.libroResource.reload();
  }
}
