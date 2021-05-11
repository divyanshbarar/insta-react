import firebase from "firebase"
import "firebase/auth"

const firebaseApp =firebase.initializeApp(
    {
        // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    
        apiKey: "AIzaSyBrL6eRXMArMCN79VI9FosQh3cHkxrImt4",
        authDomain: "insta-react-25fdf.firebaseapp.com",
        projectId: "insta-react-25fdf",
        storageBucket: "insta-react-25fdf.appspot.com",
        messagingSenderId: "321470990480",
        appId: "1:321470990480:web:f15258eb0582acf7683015",
        measurementId: "G-4QP7TBZW72"
      
    }
    

) 
// Initialize Firebase

const auth = firebase.auth();
const db = firebaseApp.firestore();
const storage=firebase.storage();

// //initiating references to the databases
// const usersRef = db.collection('users')

// // for privileges purposes
// const functions = firebase.functions();

// //google provider sign-in
// const googleProvider = new firebase.auth.GoogleAuthProvider();


export {  db, auth,storage};