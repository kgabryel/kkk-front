import {ComponentFixture, TestBed} from '@angular/core/testing';

import {IngredientPositionComponent} from './ingredient-position.component';

describe('IngredientPositionComponent', () => {
  let component: IngredientPositionComponent;
  let fixture: ComponentFixture<IngredientPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IngredientPositionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
