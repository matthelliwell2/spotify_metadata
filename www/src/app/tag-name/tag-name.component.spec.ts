import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TagNameComponent} from './tag-name.component';

describe('TagNameComponent', () => {
  let component: TagNameComponent;
  let fixture: ComponentFixture<TagNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
