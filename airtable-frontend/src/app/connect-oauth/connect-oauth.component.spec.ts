import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectOAuthComponent } from './connect-oauth.component';

describe('ConnectOAuthComponent', () => {
  let component: ConnectOAuthComponent;
  let fixture: ComponentFixture<ConnectOAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectOAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectOAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
