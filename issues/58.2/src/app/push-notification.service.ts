import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireOfflineDatabase } from 'angularfire2-offline/database';
import { AngularFireDatabase } from 'angularfire2/database';
import { FCMPlugin } from './fcm-plugin.mock';

@Injectable()
export class PushNotificationService {
  constructor(public db: AngularFireOfflineDatabase,
    public db_online: AngularFireDatabase) { }

  deleteToken(userId) {
    // Prepares the token deletion
    return new Promise((resolve, reject) => {

      this.getCurrentToken().then(tokenToDelete => {

      this.getUsersDeviceTokensOnce(userId).subscribe(deviceTokens => {

        for (let token of deviceTokens){
          if (token.$value === tokenToDelete) {

          this.executeTokenDeletion(userId, token.$key)
            .then( res => resolve(res))
            .catch(err => reject(err));

          }
        }

        console.log("tokenToDelete doesn't exist.");
        resolve();

      }, error => reject(error));

      })
      .catch( err => reject(err));
    });
  }


  getCurrentToken() {
    // returns the current Device Token.
    return new Promise((resolve, reject) => {

      FCMPlugin.getToken(token => {
        resolve(token);
      }, (err) => {
        reject(err);
      });

    });
  }


  getUsersDeviceTokensOnce(userId){
    return (<any>this.db.list('/users/'+userId+'/device_token')).take(1);
  }


  executeTokenDeletion(userId, fbTokenId){
    return (<any>this.db.list('/users/'+userId+'/device_token/'+fbTokenId)).remove();
  }
}
