import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Session } from '../interfaces/session';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private _snackBar:MatSnackBar) { }

  showAlert(message:string, type:string) {
    this._snackBar.open(message, type, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000
    })
  }

  saveUserSession(userSession:Session){
    localStorage.setItem('userSession', JSON.stringify(userSession))
  }

  getUserSession() {
    return JSON.parse(localStorage.getItem('userSession')!)
  }

  deleteUserSession() {
    localStorage.removeItem('userSession')
  }
}
