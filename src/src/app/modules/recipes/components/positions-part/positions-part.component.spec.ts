import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PositionsPartComponent} from './positions-part.component';

describe('PositionsPartComponent', () => {
  let component: PositionsPartComponent;
  let fixture: ComponentFixture<PositionsPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PositionsPartComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionsPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
