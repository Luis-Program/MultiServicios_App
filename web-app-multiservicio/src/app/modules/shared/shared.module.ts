import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './pages/profile/profile.component';
import { TelefonoComponent } from './pages/telefono/telefono.component';
import { HomeComponent } from './pages/home/home.component';
import { NavSideBarComponent } from './components/nav-side-bar/nav-side-bar.component';
import { RepuestoComponent } from './pages/repuesto/repuesto.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';


@NgModule({
  declarations: [
    ProfileComponent,
    TelefonoComponent,
    HomeComponent,
    NavSideBarComponent,
    RepuestoComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class SharedModule { }
