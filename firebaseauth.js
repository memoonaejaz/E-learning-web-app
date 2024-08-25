// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBuAgUg2V4K6M_uhK5NWLm6Rk1IyiVj7VY",
    authDomain: "online-education-8dd2a.firebaseapp.com",
    projectId: "online-education-8dd2a",
    storageBucket: "online-education-8dd2a.appspot.com",
    messagingSenderId: "982856643691",
    appId: "1:982856643691:web:7b8cabfc5128e9e2f4ad2e"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Function to show messages
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Sign-up event
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                role: 'user'  // Set default role
            };
            showMessage('Account Created Successfully', 'signUpMessage');
            const docRef = doc(db, "users", user.uid);
            return setDoc(docRef, userData);
        })
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error("Error writing document", error);
            showMessage('Unable to create User', 'signUpMessage');
        });
});

// Sign-in event
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            showMessage('Login is successful', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);

            // Fetch user role from Firestore
            const userDoc = await doc(db, "users", user.uid).get();
            const userData = userDoc.data();

            if (userData.role === 'admin') {
                window.location.href = 'admin-dashboard.html'; // Redirect to admin dashboard
            } else {
                window.location.href = 'homepage.html'; // Redirect to user homepage
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('Account does not exist', 'signInMessage');
            }
        });
});


// Google Sign-In for the sign-up form
const googleSignInSignUp = document.getElementById('googleSignInSignUp');
googleSignInSignUp.addEventListener('click', (event) => {
    event.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log('Google Sign-In Successful:', user);
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Google Sign-In Error: ", error.message);
            showMessage('Failed to sign in with Google', 'signUpMessage');
        });
});

// Google Sign-In for the sign-in form
const googleSignInSignIn = document.getElementById('googleSignInSignIn');
googleSignInSignIn.addEventListener('click', (event) => {
    event.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log('Google Sign-In Successful:', user);
            window.location.href = "homepage.html";
        })
        .catch((error) => {
            console.error("Google Sign-In Error: ", error.message);
            showMessage('Failed to sign in with Google', 'signInMessage');
        });
});
// Facebook Sign-In button for the sign-up form
const facebookSignInButtonSignUp = document.getElementById('facebookSignInSignUp');
facebookSignInButtonSignUp.addEventListener('click', (event) => {
    event.preventDefault();
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log('Facebook Sign-In Successful:', user);
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Facebook Sign-In Error:', error.message);
            showMessage('Facebook Sign-In Failed', 'signUpMessage');
        });
});

// Facebook Sign-In button for the sign-in form
const facebookSignInButtonSignIn = document.getElementById('facebookSignInSignIn');
facebookSignInButtonSignIn.addEventListener('click', (event) => {
    event.preventDefault();
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log('Facebook Sign-In Successful:', user);
            window.location.href = 'homepage.html';
        })
        .catch((error) => {
            console.error('Facebook Sign-In Error:', error.message);
            showMessage('Facebook Sign-In Failed', 'signInMessage');
        });
});
// handle user and admin dashboard
// Firebase initialization (Ensure you've initialized Firebase properly)
firebase.initializeApp(firebaseConfig);

// Get references to auth and firestore
const auth = firebase.auth();
const db = firebase.firestore();

// Login function
function loginUser(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      // Get the user's role from Firestore
      const userRef = db.collection('users').doc(user.uid);
      userRef.get().then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          const userRole = userData.role;

          // Redirect based on user role
          if (userRole === 'admin') {
            window.location.href = 'course management.html'; // Admin dashboard
          } else {
            window.location.href = 'dashboard.html'; // User dashboard
          }
        } else {
          console.error("No such document!");
        }
      }).catch((error) => {
        console.error("Error getting document:", error);
      });

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
}

// Example usage
document.getElementById('loginButton').addEventListener('click', function() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  loginUser(email, password);
});
