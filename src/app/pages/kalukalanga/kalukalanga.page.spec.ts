import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KalukalangaPage } from './kalukalanga.page';

describe('KalukalangaPage', () => {
  let component: KalukalangaPage;
  let fixture: ComponentFixture<KalukalangaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KalukalangaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
