import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPositionsFileComponent } from './map-positions-file.component';

describe('MapPositionsFileComponent', () => {
  let component: MapPositionsFileComponent;
  let fixture: ComponentFixture<MapPositionsFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPositionsFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPositionsFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
