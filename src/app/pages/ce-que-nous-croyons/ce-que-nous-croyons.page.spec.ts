import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CeQueNousCroyonsPage } from './ce-que-nous-croyons.page';

describe('CeQueNousCroyonsPage', () => {
  let component: CeQueNousCroyonsPage;
  let fixture: ComponentFixture<CeQueNousCroyonsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CeQueNousCroyonsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
