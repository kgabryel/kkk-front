import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RecipePositionComponent} from './recipe-position.component';

describe('RecipePositionComponent', () => {
  let component: RecipePositionComponent;
  let fixture: ComponentFixture<RecipePositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipePositionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipePositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
