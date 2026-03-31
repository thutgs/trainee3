import { Routes } from '@angular/router';
import { ListagemComponent } from './components/listagem/listagem.component';
import { FormularioComponent } from './components/formulario/formulario.component';

export const routes: Routes = [
  { path: '', component: ListagemComponent }, // A URL vazia carrega a Listagem
  { path: 'novo', component: FormularioComponent }, // Rota de Criação
  { path: 'editar/:id', component: FormularioComponent }, // Rota de Edição
];
