import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireOfflineDatabase } from 'angularfire2-offline/database';

@Injectable()
export class AuthService {
  userId: string;
  constructor(public afAuth: AngularFireAuth,
    public db: AngularFireOfflineDatabase) { }

  logoutUser() {
    this.db.reset();
    return this.afAuth.auth.signOut();
  }

  loginUser() {
    return this.afAuth.auth.signInWithEmailAndPassword(
      'afo@example.com',
      '123456'
    ).then(user => {
      user.subscribe(user => this.userId = user.uid);
      return user;
    })
  }
}
