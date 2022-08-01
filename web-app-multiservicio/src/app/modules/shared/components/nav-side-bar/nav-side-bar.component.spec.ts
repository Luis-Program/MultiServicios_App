import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavSideBarComponent } from './nav-side-bar.component';

describe('NavSideBarComponent', () => {
  let component: NavSideBarComponent;
  let fixture: ComponentFixture<NavSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavSideBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
