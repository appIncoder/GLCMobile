import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MotDuPasteurPage } from './mot-du-pasteur.page';

describe('MotDuPasteurPage', () => {
  let component: MotDuPasteurPage;
  let fixture: ComponentFixture<MotDuPasteurPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MotDuPasteurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
