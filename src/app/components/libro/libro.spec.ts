import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Libro } from './libro';

describe('Libro', () => {
  let component: Libro;
  let fixture: ComponentFixture<Libro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Libro],
    }).compileComponents();

    fixture = TestBed.createComponent(Libro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
