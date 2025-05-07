import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';
import { BahiasComponent } from './components/bahias/bahias.component';
const routes: Routes = [
  { path: 'bahias', component: BahiasComponent },
  { path: 'registro', component: RegistroComponent },
  { path: '', redirectTo: 'bahias', pathMatch: 'full' },
  { path: '**', redirectTo: 'bahias' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
