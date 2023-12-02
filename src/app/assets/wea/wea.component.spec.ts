import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaComponent } from './wea.component';

describe('WeaComponent', () => {
  let component: WeaComponent;
  let fixture: ComponentFixture<WeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
