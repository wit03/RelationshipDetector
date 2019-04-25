if (typeof firebase === 'undefined') throw new Error('hosting/init-error: Firebase SDK not detected. You must include it before /__/firebase/init.js');
firebase.initializeApp({
	"apiKey": "AIzaSyCxsAjv5D4zK5BNk_t6ELjlDwAk55VVaiY",
	"databaseURL": "https://ace-ensign-237816.firebaseio.com",
	"storageBucket": "ace-ensign-237816.appspot.com",
	"authDomain": "ace-ensign-237816.firebaseapp.com",
	"messagingSenderId": "1013652714885",
	"projectId": "ace-ensign-237816"
});