import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NousjoindrePage } from './nousjoindre.page';

describe('NousjoindrePage', () => {
  let component: NousjoindrePage;
  let fixture: ComponentFixture<NousjoindrePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NousjoindrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
