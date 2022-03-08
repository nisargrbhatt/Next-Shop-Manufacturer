import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, shareReplay } from 'rxjs';
import { io, Socket } from 'socket.io-client';

import { environment, basicAPIURIs } from 'src/environments/environment';
import {
  IChat,
  IGetRooms,
  IUserData,
  IGetUserResponse,
} from './chat.interface';

const BACKEND_CHAT_URL = environment.backend_chat_url;

const BACKEND_URL = environment.production
  ? environment.backend_url_secure
  : environment.backend_url;

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private chats: IChat[] = [];
  private chatsSub: BehaviorSubject<IChat[]> = new BehaviorSubject<IChat[]>([]);

  private rooms: any[] = [];
  private roomsSub: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  public socket: Socket;

  constructor(private httpService: HttpClient) {
    this.socket = io(BACKEND_CHAT_URL);

    this.socket.on('old-chats', (chats) => {
      const oldChats = JSON.parse(chats);
      this.chats = oldChats;
      this.chatsSub.next([...this.chats]);
    });

    this.socket.on('create-message', (message, senderId, receiverId) => {
      this.chats.push({
        message,
        senderId,
        receiverId,
      });
      this.chatsSub.next([...this.chats]);
    });
  }

  onJoinChat(roomId: string, userId: string): void {
    this.chats = [];
    this.chatsSub.next([]);

    this.socket.emit('join-chat', roomId, userId);
  }

  onMessage(message: string, senderId: string, receiverId: string): void {
    this.socket.emit('message', message, senderId, receiverId);
  }

  listenOldChats() {
    this.socket.on('old-chats', (chats) => {
      const oldChats = JSON.parse(chats);
      this.chats = oldChats;
      this.chatsSub.next(this.chats);
    });
  }

  get ChatObservable(): Observable<IChat[]> {
    return this.chatsSub.asObservable();
  }

  get Chat(): IChat[] {
    return this.chats;
  }

  getRooms(userId: string): void {
    this.httpService
      .get<IGetRooms>(BACKEND_CHAT_URL + '/room/get-rooms/' + userId)
      .pipe(map((response) => response.rooms))
      .subscribe((rooms) => {
        this.rooms = [];
        rooms.forEach((roomData) => {
          const otherId =
            roomData.member1Id === userId
              ? roomData.member2Id
              : roomData.member1Id;
          this.getUserData(otherId).subscribe((userData) => {
            this.rooms.push({
              ...roomData,
              otherUserData: userData,
              senderId: userId,
              recieverId: otherId,
            });
            this.roomsSub.next(this.rooms);
          });
        });
      });
  }

  getUserData(userId: string): Observable<IUserData | undefined> {
    return this.httpService
      .get<IGetUserResponse>(
        BACKEND_URL + basicAPIURIs.getUserBasicData + `/?userId=${userId}`,
      )
      .pipe(
        map((response) => response?.data),
        shareReplay(),
      );
  }

  get RoomObservable(): Observable<any[]> {
    return this.roomsSub.asObservable().pipe(shareReplay());
  }

  get Room(): any[] {
    return this.rooms;
  }

  init(): void {
    console.log('Chat init');
  }
}
