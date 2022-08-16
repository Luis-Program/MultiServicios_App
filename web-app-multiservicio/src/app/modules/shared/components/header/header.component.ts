import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthB2cService } from 'src/app/services/auth-b2c.service';
import { NotificacionService } from 'src/app/services/notificacion.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  protected rol: string | null = null;

  constructor(
    private router: Router,
    private authB2C: AuthB2cService,
    private notificacionService: NotificacionService
  ) { }

  ngOnInit(): void {
  }

  protected logout() {
    this.authB2C.logout();
  }
}
