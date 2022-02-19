import firebase from 'firebase';
require("@firebase/firestore");


const firebaseConfig = {
    apiKey: "AIzaSyAJg6QTufR6ERny-ROOwD8FeM_yj6MqyhA",
    authDomain: "wireless-lib-8019d.firebaseapp.com",
    projectId: "wireless-lib-8019d",
    storageBucket: "wireless-lib-8019d.appspot.com",
    messagingSenderId: "3500306756",
    appId: "1:3500306756:web:c338395f3016563b98a711"
  };
if (!firebase.apps.length)
    firebase.initializeApp(firebaseConfig);
export default firebase.firestore();