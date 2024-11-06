import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Your Firebase configuration
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
const auth = getAuth();
const db = getFirestore();

// Monitor user authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Store user ID in local storage when user is logged in
        localStorage.setItem('loggedInUserId', user.uid);

        const loggedInUserId = localStorage.getItem('loggedInUserId');
        console.log("Logged in user:", loggedInUserId); // Debugging

        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById('loggedUserFName').innerText = userData.firstName;
                    document.getElementById('loggedUserEmail').innerText = userData.email;
                    document.getElementById('loggedUserLName').innerText = userData.lastName;
                } else {
                    console.log("No document found matching ID.");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    } else {
        console.log("User is not logged in");
        // Handle the case where no user is logged in
    }
});

// Logout functionality
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
        .then(() => {
            window.location.href = 'index.html'; // Redirect to login page
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
});
