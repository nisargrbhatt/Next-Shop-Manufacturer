import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatsComponent } from './chats/chats.component';
import { ChatTalkComponent } from './chat-talk/chat-talk.component';
import { AngularMaterialModule } from '../angular-material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ChatsComponent, ChatTalkComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    AngularMaterialModule,
    RouterModule,
  ],
})
export class ChatModule {}
