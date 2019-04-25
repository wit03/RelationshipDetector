// Copyright 2018 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"

window.onload = () => {

    let ghostInput = document.getElementById("input-ghost"),
        navbarUpload = document.getElementById("navbar-upload"),
        cardUpload = document.getElementById("card-upload"),
        loadscreen = document.getElementById("loadscreen"),
        card = document.getElementById("card");

    const showProgress = () => {
        cardUpload.classList = "hidden";
        loadscreen.classList = "";
        card.classList = "hidden";
    },
    showResult = (data, localFile) => {
        cardUpload.classList = "hidden";
        loadscreen.classList = "hidden";
        card.classList = "";

        let relationType = Object.keys(data)[0];

        document.getElementById("card-progress").innerHTML = (data[relationType] * 100).toFixed(0);
        document.getElementById("card-title").innerHTML = relationType
        document.getElementById("card-detail").innerHTML = relation[relationType].des;
        document.getElementById("card-image").src = URL.createObjectURL(localFile);
    };

    navbarUpload.onclick = () => { openUpload(); }
    cardUpload.onclick = () => { openUpload(); }

    const openUpload = () => { ghostInput.click(); }

    firebase.initializeApp({
        "apiKey": "AIzaSyCxsAjv5D4zK5BNk_t6ELjlDwAk55VVaiY",
        "databaseURL": "https://ace-ensign-237816.firebaseio.com",
        "storageBucket": "ace-ensign-237816.appspot.com",
        "authDomain": "ace-ensign-237816.firebaseapp.com",
        "messagingSenderId": "1013652714885",
        "projectId": "ace-ensign-237816"
    });

    const storage = firebase.storage(),
        storageRef = storage.ref(),
        db = firebase.firestore();
    
    const relation = {
        "alone": {
            "des": "Press F to respect."
        },
        "couple": {
            "des": "Eww, That's disgusting."
        },
        "friend": {
            "des": "Whatever..., You can be only friend ;W;"
        }
    }

    ghostInput.onchange = (e) => {
        showProgress();

        let localFile = e.target.files[0];

        let imgRef = storageRef.child(localFile.name);

        imgRef.put(localFile).then(() => {
            db.collection("images")
                .doc(localFile.name)
                .onSnapshot(function (doc) {
                    if (doc.exists) {
                        let relationData = doc.data();
                        if (relationData.predictionErr) {
                            // Error
                        } else {
                            showResult(relationData, localFile);
                        }
                    }
                });
        });
    }
}