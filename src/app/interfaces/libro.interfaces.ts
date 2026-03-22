export interface Libro {
    _id?: string;
    titulo: string;
    autor: string;
    apublicacion: string;
    editorial: string;
    categoria: string;
    sede: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

/** Cuerpo para crear un libro (sin campos de servidor). */
export type LibroNuevo = Pick<
    Libro,
    'titulo' | 'autor' | 'apublicacion' | 'editorial' | 'categoria' | 'sede'
>;

export interface LibroResponse {
    libros?: Libro[];
    libro?: Libro;
    message?: string;
    msg?: string;
    success?: boolean;
}