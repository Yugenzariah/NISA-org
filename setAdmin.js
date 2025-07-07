const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./nisa-organization-firebase-adminsdk-63w8a-f64a39bf10.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://nisa-organization.firebaseio.com"
});

// Email of the user to make admin
const email = "nisa.org.nmit@gmail.com"; 

// Set the custom claim
admin.auth().getUserByEmail(email)
    .then((user) => {
        return admin.auth().setCustomUserClaims(user.uid, { admin: true });
    })
    .then(() => {
        console.log(`Successfully made ${email} an admin.`);
    })
    .catch((error) => {
        console.error("Error assigning admin role:", error);
    });