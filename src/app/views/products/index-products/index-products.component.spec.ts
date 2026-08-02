import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexProductsComponent } from './index-products.component';

describe('IndexProductsComponent', () => {
  let component: IndexProductsComponent;
  let fixture: ComponentFixture<IndexProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
