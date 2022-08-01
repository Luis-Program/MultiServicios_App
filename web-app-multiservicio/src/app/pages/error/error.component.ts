import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  protected typeError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.typeError = this.route.snapshot.params['type'];
  }

  protected goToBack() {
    this.location.back();
  }

  protected goToHome() {
    this.router.navigate(['home']);
  }

}
