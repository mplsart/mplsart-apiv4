// Firebase Admin Client Wrapper

import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  // Construct the credential
  const credential: admin.credential.Credential = admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  });

  admin.initializeApp({
    credential: credential,
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

const exported = {
  firebase: admin,
  auth: admin.auth(),
  db: admin.firestore()
};
export default exported;
