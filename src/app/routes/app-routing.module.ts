import { LayoutComponent } from '../navigation/layout/layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { D1Component } from '../pages/d1/d1.component';
import { ProductsComponent } from '../pages/products/products.component';
import { BlogComponent } from '../pages/blog/blog.component';
import { LoginComponent } from '../navigation/login/login.component';
import { AuthGuard } from '../guards/auth.guard';



const routes: Routes = [
  { path: '', component: LayoutComponent,
    children: [
      { path: '', component: D1Component, canActivate: [AuthGuard] },
      { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
      { path: 'blog', component: BlogComponent, canActivate: [AuthGuard] },
    ]},
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
