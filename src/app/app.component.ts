import { Component, OnInit } from '@angular/core';
import { Auth0Service } from './auth/auth0.service';
import { ChatService } from './chat/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'next-shop-manufacturer';

  constructor(
    private authService: Auth0Service,
    private chatService: ChatService,
  ) {}

  ngOnInit(): void {
    this.authService.init();
    this.chatService.init();
  }
}
