import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthB2cService } from './services/auth-b2c.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'web-app-multiservicio';
  constructor(
    private authB2C: AuthB2cService,
  ){}
  ngOnInit(): void {
    this.authB2C.startB2c();
  }
  ngOnDestroy(): void {
    this.authB2C.destroy();
  }

}
