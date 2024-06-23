import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TypeComponent } from './type/type.component';
import { RegistrationComponent } from './registration/registration.component';
import { AboutComponent } from './about/about.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'type',
        component: TypeComponent,
    },
    {
        path: 'form',
        component: RegistrationComponent,
    },
    {
        path: 'about',
        component: AboutComponent,
    },
    {
        path: 'not-found',
        component: NotFoundComponent,
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'not-found',
    }
];