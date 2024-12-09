
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

// Ensure this script runs after the DOM is fully loaded


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAqGYp2JLW3zgfNtcnHhtBJxHuBCJjJhm8",
    authDomain: "sustainabilitylogin.firebaseapp.com",
    projectId: "sustainabilitylogin",
    storageBucket: "sustainabilitylogin.appspot.com",
    messagingSenderId: "890836111581",
    appId: "1:890836111581:web:fa0450b2dca2039e800b34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

// Get references to buttons and forms
const submitSignIn = document.getElementById('submitSignIn');

// Sign up functionality
const submitSignUp = document.getElementById('submitSignUp');
submitSignUp.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form from submitting
    alert("Sign Up Button Clicked!"); // Debugging alert

    // Get user input values
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    // Check if values are not empty
    if (!email || !password || !firstName || !lastName) {
        alert("Please fill in all fields."); // Alert if fields are empty
        return; // Stop the function if fields are empty
    }

    // Firebase sign-up logic
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up successfully
            const user = userCredential.user;
            console.log('User signed up:', user);

            // Save additional user info in Firestore
            const userRef = doc(db, "users", user.uid); // Reference to the user's document
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName
            };

            // Set user data in Firestore
            setDoc(userRef, userData)
                .then(() => {
                    console.log("User data saved in Firestore successfully!");
                    // Redirect to homepage after signup
                    window.location.href = 'homepage.html'; // Redirect to homepage
                })
                .catch((error) => {
                    console.error("Error saving user data in Firestore:", error);
                    alert("Error saving user data. Please try again.");
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error during sign-up:', errorCode, errorMessage);
            alert(`Sign-up error: ${errorMessage}`); // Show error to the user
        });
});

// Sign in functionality
submitSignIn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form from submitting

    // Get user input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Firebase sign-in logic
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in successfully
            const user = userCredential.user;
            console.log('User signed in:', user);

            // Redirect to homepage after successful login
            window.location.href = 'homepage.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error during sign-in:', errorCode, errorMessage);
            alert(`Sign-in error: ${errorMessage}`); // Show error to the user
        });
});

// Add this at the end of your firebaseauth.js file
