import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMotion } from './ngx-motion';

describe('NgxMotion', () => {
  let component: NgxMotion;
  let fixture: ComponentFixture<NgxMotion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMotion],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxMotion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
