import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiarioDetailComponent } from './components/diario-detail/diario-detail.component';
import { DiarioListComponent } from './components/diario-list/diario-list.component';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';


//configura uma guarda para redirecioar o suário para /login
//caso ele nao esteja logado
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'diarios',
    pathMatch: 'full'
  }, //rota home com redirecionamento
  {
    path: 'diarios',
    component: DiarioListComponent,
    ...canActivate(redirectUnauthorizedToLogin) //só pode acessar a rota quem estiver logado
  },

  //Essa rota é dinâmica
  // diarios/dasdas2133
  {
    path: 'diarios/:id',
    component: DiarioDetailComponent,
    ...canActivate(redirectUnauthorizedToLogin) //só pode acessar a rota quem estiver logado
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiariosRoutingModule { }
