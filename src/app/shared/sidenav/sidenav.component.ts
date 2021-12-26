import { Auth0Service } from '../../auth/auth0.service';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, OnChanges {
  @Input() sideNavShow: boolean;
  @Output() changeSideNavState: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  isAuthenticated = false;
  private authStatusSub: Subscription;

  constructor(
    private authService: Auth0Service,
    private auth0Service: AuthService,
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.IsAuth;
    this.authStatusSub = this.authService.AuthStatusListener.subscribe(
      (authStatus) => {
        this.isAuthenticated = authStatus;
      },
    );
  }

  closeNav(): void {
    this.changeSideNavState.emit(false);
    document.getElementById('mySidenav').style.width = '0';
  }

  ngOnChanges(): void {
    if (this.sideNavShow === true) {
      this.changeSideNavState.emit(true);
      document.getElementById('mySidenav').style.width = '250px';
    } else {
      this.changeSideNavState.emit(false);
      document.getElementById('mySidenav').style.width = '0';
    }
  }

  auth0Login(): void {
    this.auth0Service.loginWithRedirect().subscribe(() => {});
  }

  auth0Logout(): void {
    this.authService.logout();
    this.closeNav();
  }
}
