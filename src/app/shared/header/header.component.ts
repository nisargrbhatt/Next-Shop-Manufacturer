import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  sideNavShow = false;

  constructor() {}

  ngOnInit(): void {}

  changeSideNavState(state: boolean): void {
    this.sideNavShow = state;
  }
}
