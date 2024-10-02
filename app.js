// Import Firebase SDK
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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

// Function to log daily entry
async function logEntry(text) {
    const user = auth.currentUser; // รับข้อมูลผู้ใช้ปัจจุบัน
    if (user) {
        try {
            // บันทึกข้อความใน Firestore
            await addDoc(collection(db, 'users', user.uid, 'dailyLogs'), {
                text: text,
                timestamp: new Date().toISOString(), // บันทึกเวลาที่บันทึกข้อมูล
            });
            console.log('Log entry saved successfully');
            
            // เรียกใช้ API หลังจากบันทึกข้อมูล
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

// Example usage
async function submitLog() {
    const userInput = document.getElementById('userInput').value; // รับค่าจาก input ของผู้ใช้
    await logEntry(userInput);
}
