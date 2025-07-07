import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Firebase Authentication
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Redirects to events page if user is an admin
            user.getIdTokenResult().then((idTokenResult) => {
                if (idTokenResult.claims.admin) {
                    window.location.href = '/html/events.html';
                } else {
                    errorMessage.textContent = 'Access denied: You are not an admin.';
                    auth.signOut();
                }
            });
        })
        .catch((error) => {
            errorMessage.textContent = `Login failed: ${error.message}`;
        });
});