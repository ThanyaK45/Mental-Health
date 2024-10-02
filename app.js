// Import Firebase SDK
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import axios from 'axios';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDaP0AipG0VZySg3t0z0b7ICQHa0TGXqnM",
    authDomain: "mental-c75f6.firebaseapp.com",
    projectId: "mental-c75f6",
    storageBucket: "mental-c75f6.appspot.com",
    messagingSenderId: "393488445835",
    appId: "1:393488445835:web:945b992b008e35405d3f8e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to register a new user
export async function registerUser(email, password) {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('User registered successfully');
    } catch (error) {
        console.error('Error registering user:', error.message);
    }
}

// Function to log in a user
export async function loginUser(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in successfully');
    } catch (error) {
        console.error('Error logging in:', error.message);
    }
}

// Function to log out the user
export async function logoutUser() {
    try {
        await signOut(auth);
        console.log('User logged out successfully');
    } catch (error) {
        console.error('Error logging out:', error.message);
    }
}

// Function to log daily entry
export async function logEntry(text) {
    const user = auth.currentUser; // Get the currently logged in user
    if (user) {
        try {
            // Save the log entry to Firestore
            await addDoc(collection(db, 'users', user.uid, 'dailyLogs'), {
                text: text,
                timestamp: new Date().toISOString(), // Save the time of the log entry
            });
            console.log('Log entry saved successfully');
            
            // Call API after saving the entry
            await sendDataToAWS(user.uid, text);
        } catch (error) {
            console.error('Error saving log entry:', error);
        }
    } else {
        console.error('User is not authenticated');
    }
}

// Function to send data to AWS
async function sendDataToAWS(userId, text) {
    try {
        const response = await axios.post('https://2dgij1lw75.execute-api.ap-southeast-1.amazonaws.com/', {
            userId: userId,
            text: text,
        });
        console.log('Response from AWS:', response.data);
    } catch (error) {
        console.error('Error calling AWS API:', error);
    }
}

// Monitor the authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is logged in:', user);
        // Display journal section or any other user-related UI updates
    } else {
        console.log('No user is logged in');
        // Hide journal section or update UI accordingly
    }
});
