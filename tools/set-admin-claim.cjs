const admin = require('firebase-admin');
require('dotenv').config();

const expectedProject = 'kohleyed-a8060';
const uid = process.argv[2];
const expectedEmail = process.argv[3];
const apply = process.argv[4] === '--apply';

if (!uid || !expectedEmail || !expectedEmail.includes('@') || (process.argv[4] && !apply)) {
  console.error('Usage: node tools/set-admin-claim.cjs <existing Firebase UID> <expected email> [--apply]');
  process.exit(1);
}

const { FIREBASE_PROJECT_ID: projectId, FIREBASE_CLIENT_EMAIL: clientEmail, FIREBASE_PRIVATE_KEY: privateKey } = process.env;
if (projectId !== expectedProject || !clientEmail || !privateKey || !clientEmail.endsWith(`@${expectedProject}.iam.gserviceaccount.com`)) {
  console.error('Kohleyed Firebase Admin credentials are required. No account was changed.');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  }),
});

(async () => {
  const user = await admin.auth().getUser(uid);
  if (user.email?.toLowerCase() !== expectedEmail.toLowerCase()) {
    throw new Error('UID and email do not identify the same existing Kohleyed user. No claim was changed.');
  }
  if (!apply) {
    console.log(`Existing Kohleyed user found. Admin claim: ${user.customClaims?.admin === true}.`);
    return;
  }
  if (user.customClaims?.admin === true) {
    console.log('Existing Kohleyed user already has the admin claim.');
    return;
  }
  await admin.auth().setCustomUserClaims(user.uid, { ...(user.customClaims || {}), admin: true });
  const updated = await admin.auth().getUser(user.uid);
  if (updated.customClaims?.admin !== true) throw new Error('Admin claim verification failed.');
  console.log('Admin claim granted to the existing Kohleyed user. Sign in again to refresh the ID token.');
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
