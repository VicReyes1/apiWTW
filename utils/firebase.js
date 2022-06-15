const { initializeApp } =  require('firebase/app');
const { getAuth } =  require('firebase/auth');

//Trouble reading environment variables: process.env.ACCESS_KEY
const firebaseConfig = JSON.parse('{"apiKey":"AIzaSyB3LPbf2WYSmyh-vFSYFK2EQOipBnXIoZU","authDomain":"authwtw.firebaseapp.com","projectId":"authwtw","storageBucket":"authwtw.appspot.com","messagingSenderId":"264736460392","appId":"1:264736460392:web:366148409713462d45f5dd"}');

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

module.exports = {auth}

