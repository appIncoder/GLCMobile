import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AVenirPage } from './a-venir.page';

describe('AVenirPage', () => {
  let component: AVenirPage;
  let fixture: ComponentFixture<AVenirPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AVenirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
