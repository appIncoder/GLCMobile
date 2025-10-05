import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NousRejoindrePage } from './nous-rejoindre.page';

describe('NousRejoindrePage', () => {
  let component: NousRejoindrePage;
  let fixture: ComponentFixture<NousRejoindrePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NousRejoindrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
