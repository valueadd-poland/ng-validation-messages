import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'front',
    pathMatch: 'full'
  },
  {
    path: 'front',
    loadChildren: () => import('./lazy/lazy-lib-wrapper.module').then(m => m.LazyLibWrapperModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
