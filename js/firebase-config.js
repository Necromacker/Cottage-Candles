// Replace these with your actual Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyCH2k8qiIlQUO7hcFY1LB8I7CvSbTa-8l8",
    authDomain: "cottage-candles0.firebaseapp.com",
    projectId: "cottage-candles0",
    storageBucket: "cottage-candles0.firebasestorage.app",
    messagingSenderId: "974337305310",
    appId: "1:974337305310:web:5df42fface9f455bea704f",
    measurementId: "G-F1JT9124ZF"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export { auth, googleProvider };
