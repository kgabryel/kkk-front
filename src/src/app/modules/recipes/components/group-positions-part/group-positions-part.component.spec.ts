import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupPositionsPartComponent} from './group-positions-part.component';

describe('GroupPositionsPartComponent', () => {
  let component: GroupPositionsPartComponent;
  let fixture: ComponentFixture<GroupPositionsPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupPositionsPartComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupPositionsPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
