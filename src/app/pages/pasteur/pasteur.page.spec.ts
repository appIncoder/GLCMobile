import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasteurPage } from './pasteur.page';

describe('PasteurPage', () => {
  let component: PasteurPage;
  let fixture: ComponentFixture<PasteurPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PasteurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
