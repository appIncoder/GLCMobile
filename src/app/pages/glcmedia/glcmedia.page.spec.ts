import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlcmediaPage } from './glcmedia.page';

describe('GlcmediaPage', () => {
  let component: GlcmediaPage;
  let fixture: ComponentFixture<GlcmediaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GlcmediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
