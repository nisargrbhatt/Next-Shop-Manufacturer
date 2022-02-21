import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent {
  constructor(
    public dialogRef: MatDialogRef<EmailVerificationComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: { productId: string },
  ) {}
}
