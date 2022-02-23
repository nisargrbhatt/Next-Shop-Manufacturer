import { DialogData } from './res-mes.interface';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-res-mes',
  templateUrl: './res-mes.component.html',
  styleUrls: ['./res-mes.component.scss'],
})
export class ResMesComponent {
  constructor(
    public dialogRef: MatDialogRef<ResMesComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
  ) {}
}
