import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'lists',
        loadComponent: () => import('./components/lista/lista').then(m => m.Lista)
    },
    {
        path: 'lists/:id',
        loadComponent: () => import('./components/libro/libro').then(m => m.Libro)
    },
    {
        path: '',
        redirectTo: '/lists',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/lists',
    }
];
