//import and config
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js"; 
  const firebaseConfig = {
  apiKey: "AIzaSyD9tMYYbrrIeg8IzJr6HsmSLTQkrpPS6O0",
  authDomain: "userlogindb-76260.firebaseapp.com",
  projectId: "userlogindb-76260",
  storageBucket: "userlogindb-76260.firebasestorage.app",
  messagingSenderId: "1010679264774",
  appId: "1:1010679264774:web:780f788497e943015b7587"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

//show message of logging in and regestering
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

//register email and password
const signUp = document.getElementById('register-btn');
signUp.addEventListener('click', (event) => {
  event.preventDefault();
  const name = document.getElementById('rName').value;
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = { email, name };
      showMessage('Account Created Successfully', 'regMessageDiv');
      return setDoc(doc(db, "users", user.uid), userData);
    })
    .then(() => {
      window.location.href = 'login-register.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/email-already-in-use') {
        showMessage('Email Address Already Exists !!!', 'regMessageDiv');
      } else {
        showMessage('Unable to create user', 'regMessageDiv');
      }
    });
});

//login with email and password
const signIn = document.getElementById('login-btn');
signIn.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('lEmail').value;
  const password = document.getElementById('lPassword').value;

  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      return signInWithEmailAndPassword(auth, email, password);
    })
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem('loggedInUserId', user.uid);
      showMessage('Login is successful', 'logMessageDiv');
      window.location.href = 'home.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-credential') {
        showMessage('Incorrect Email or Password', 'logMessageDiv');
      } else {
        showMessage('Account does not Exist', 'logMessageDiv');
      }
    });
});

//google login
const googleButtons = document.querySelectorAll('#google-login-btn');
googleButtons.forEach(button => {
  button.addEventListener('click', () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        window.location.href = "home.html";
      })
      .catch((error) => {
        console.error("Google login failed:", error.message);
      });
  });
});
