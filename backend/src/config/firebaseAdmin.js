// firebaseAdmin.js — Initialize Firebase Admin SDK for server-side token verification
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      // When using FIREBASE_PROJECT_ID only (no service account), 
      // the Admin SDK can verify tokens using the project ID via Google's public JWKS.
      // For full admin access use a service account JSON key.
    }),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

module.exports = admin;
