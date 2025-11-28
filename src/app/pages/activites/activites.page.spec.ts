import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitesPage } from './activites.page';

describe('ActivitesPage', () => {
  let component: ActivitesPage;
  let fixture: ComponentFixture<ActivitesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
