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
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FilterReplacementPipe } from './pipes/filter-replacement.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterServicePipe } from './pipes/filter-service.pipe';
import { FilterEquipmentPipe } from './pipes/filter-equipment.pipe';
import { FilterPhonePipe } from './pipes/filter-phone.pipe';


@NgModule({
  declarations: [
    ProfileComponent,
    TelefonoComponent,
    HomeComponent,
    NavSideBarComponent,
    RepuestoComponent,
    HeaderComponent,
    SidebarComponent,
    FilterReplacementPipe,
    FilterServicePipe,
    FilterEquipmentPipe,
    FilterPhonePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FilterServicePipe,
    FilterEquipmentPipe,
    FilterPhonePipe,
    FormsModule
  ]
})
export class SharedModule { }
