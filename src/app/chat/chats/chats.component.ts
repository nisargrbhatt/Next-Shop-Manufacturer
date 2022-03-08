import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth0ProfileData } from 'src/app/auth/auth.interface';
import { Auth0Service } from 'src/app/auth/auth0.service';
import { SubSink } from 'subsink';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  public profileClaims: Auth0ProfileData | undefined;

  constructor(
    public chatService: ChatService,
    private authService: Auth0Service,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.profileClaims = this.authService.ProfileClaims;

    if (this.profileClaims?.userId) {
      this.chatService.getRooms(this.profileClaims.userId);
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
