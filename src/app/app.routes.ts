import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login,
        canActivate: [authGuard]
    },
    {
        path: 'registro',
        component: Registro,
        canActivate: [authGuard]
    },
    {
        path: '**',
        component: Home
    }
];
