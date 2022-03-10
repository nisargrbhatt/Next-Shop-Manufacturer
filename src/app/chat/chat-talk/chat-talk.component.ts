import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth0ProfileData } from 'src/app/auth/auth.interface';
import { Auth0Service } from 'src/app/auth/auth0.service';
import { IUserData, IChat } from '../chat.interface';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-talk',
  templateUrl: './chat-talk.component.html',
  styleUrls: ['./chat-talk.component.scss'],
})
export class ChatTalkComponent implements OnInit {
  member1: string;
  member2: string;

  senderId: string;
  recieverId: string;

  senderUserData: IUserData;
  recieverUserData: IUserData;

  roomId: string;

  profileClaims: Auth0ProfileData | undefined;

  chats$: Observable<IChat[]>;

  chatInput: FormControl = new FormControl();

  constructor(
    private authService: Auth0Service,
    private route: ActivatedRoute,
    private chatService: ChatService,
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.params['id1']) {
      this.member1 = this.route.snapshot.params['id1'];
    }
    if (this.route.snapshot.params['id2']) {
      this.member2 = this.route.snapshot.params['id2'];
    }

    this.profileClaims = this.authService.ProfileClaims;
    if (this.profileClaims?.userId) {
      if (this.member1 === this.profileClaims.userId) {
        this.senderId = this.member1;
        this.recieverId = this.member2;
      } else {
        this.senderId = this.member2;
        this.recieverId = this.member1;
      }

      const members = [this.senderId, this.recieverId];
      members.sort();
      this.roomId = members.join('-');

      this.chatService.onJoinChat(this.roomId, this.profileClaims.userId);
    }

    this.chats$ = this.chatService.ChatObservable;
  }

  onSend(): void {
    if (this.chatInput.value.trim().length === 0) {
      return;
    }

    this.chatService.onMessage(
      this.chatInput.value,
      this.senderId,
      this.recieverId,
    );

    this.chatInput.setValue('');
  }
}
