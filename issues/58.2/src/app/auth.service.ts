import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireOfflineDatabase } from 'angularfire2-offline/database';

@Injectable()
export class AuthService {
  constructor(public afAuth: AngularFireAuth,
    public db: AngularFireOfflineDatabase) { }

  logoutUser() {
    this.db.reset();
    return this.afAuth.auth.signOut();
  }
}
