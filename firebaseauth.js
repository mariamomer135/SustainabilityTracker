// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";





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





const nextToDietButton = document.getElementById('next-to-diet');
nextToDietButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form from submitting
    alert("Submit Car Details Button Clicked!"); // Debugging alert

    // Get user input values
    const carDistance = document.getElementById('car-distance').value;
    const fuelEfficiency = document.getElementById('fuel-efficiency').value;
    const carType = document.getElementById('car-type').value;
    const userEmail = document.getElementById('user-email').value; // Ensure this input exists

    // Check if values are not empty
    if (!carDistance || !fuelEfficiency || !carType || !userEmail) {
        alert("Please fill in all fields."); // Alert if fields are empty
        return; // Stop the function if fields are empty
    }

    // Sanitize the email for the document ID
    const sanitizedEmail = userEmail.replace(/[@.]/g, '_'); // Replace @ and . with underscores

    // Create a reference to the document using the sanitized email as the ID
    const docRef = doc(db, 'carDetails', sanitizedEmail); // 'carDetails' is your collection name

    // Set the document with the user's car details
    setDoc(docRef, {
        carDistance: parseFloat(carDistance), // Convert to number
        fuelEfficiency: parseFloat(fuelEfficiency), // Convert to number
        carType: carType,
        email: userEmail, // Store the original email
        timestamp: new Date(), // Optional: Store the timestamp
    })
    .then(() => {
        console.log("Car details successfully stored!");
        alert("Car details successfully stored!"); // Alert on success

        // Clear input fields after success
        document.getElementById('car-distance').value = '';
        document.getElementById('fuel-efficiency').value = '';
        document.getElementById('car-type').value = '';
        document.getElementById('user-email').value = '';
    })
    .catch((error) => {
        console.error('Error saving car details:', error);
        alert('Error saving data. Please try again.'); // Alert on error
    });
});