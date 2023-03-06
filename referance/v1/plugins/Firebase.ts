// Copyright (c) 2022 StasiunFile Inc
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { FIREBASE_SERVICE } from '@config';
import firebase from 'firebase-admin';
export default class Firebase {
  private static admin = firebase.initializeApp({
    credential: firebase.credential.cert(FIREBASE_SERVICE)
  });
  static sendNotification(title: string, body: string, topic: string) {
    const message = {
      notification: {
        title,
        body
      },
      topic
    };

    this.admin
      .messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }
}
