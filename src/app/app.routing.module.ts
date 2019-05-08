import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontModule } from '@valueadd/front';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'front',
    pathMatch: 'full'
  },
  {
    path: 'front',
    loadChildren: '@valueadd/front#FrontModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, FrontModule]
})
export class AppRoutingModule {}
