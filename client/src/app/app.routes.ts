import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AccountComponent } from './pages/account/account.component';
import { authGuard } from './guards/auth.guard';
import { UserComponent } from './pages/user/user.component';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'account/:id',
    component: AccountComponent,
    canActivate: [authGuard]
  },
  {
    path: 'users',
    component: UserComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],
    },
  },
];