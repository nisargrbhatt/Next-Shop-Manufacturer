import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from './../auth.service';

@Injectable({ providedIn: 'any' })
export class EmailValidator {
  debouncer: any;

  constructor(public authService: AuthService) {}

  checkEmail(control: FormControl): any {
    clearTimeout(this.debouncer);

    return new Promise((resolve) => {
      this.debouncer = setTimeout(() => {
        if (
          control.value.match(
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
          )
        ) {
          this.authService.checkEmail(control.value).subscribe(
            (res) => {
              if (res.ok) {
                resolve(null);
              } else {
                resolve({ emailInUse: true });
              }
            },
            (err) => {
              resolve({ emailInUse: true });
            },
          );
        } else {
          resolve(null);
        }
      }, 1000);
    });
  }
}
