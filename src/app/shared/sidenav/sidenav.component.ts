import { AuthService } from './../../auth/auth.service';
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

  constructor(private authService: AuthService) {}

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

  logout(): void {
    this.authService.logout();
    this.closeNav();
  }
}
