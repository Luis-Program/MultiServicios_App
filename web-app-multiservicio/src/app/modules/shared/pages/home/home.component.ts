import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  rol: string | null = null;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getRol();
  }

  getRol(){
    this.rol = localStorage.getItem('rol');
    if (!this.rol) {
      this.router.navigate(['/']);
    }
  }

}
