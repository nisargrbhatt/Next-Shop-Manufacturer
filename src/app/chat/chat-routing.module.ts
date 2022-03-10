import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { ChatTalkComponent } from './chat-talk/chat-talk.component';
import { ChatsComponent } from './chats/chats.component';

const routes: Routes = [
  {
    path: 'list',
    component: ChatsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ':id1/:id2',
    component: ChatTalkComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class ChatRoutingModule {}
