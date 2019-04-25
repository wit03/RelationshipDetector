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

function clearPrediction() {
    $('#img-predicted').html('');
    document.querySelectorAll('#relation-summary', '#status', '#prediction-text')
    .forEach(el => el.text = (""))
    document.querySelector('#card').style.display = 'none' 
}

function updateProgressBar(status) {
    if (status) {
        document.querySelector('#progress-bar').style.display = 'inline-block'
        document.querySelector('#progress-bar').classList.add('mdl-progress__indeterminate');
    } else {
        document.querySelector('#progress-bar').style.display = 'none'
    }
}

function displayPrediction(data, timeout) {
  document.querySelector('#card').style.display = 'inline-block'
  document.querySelector('#status').innerText = 'Got a prediction!'

  // This demo assumes only one label returned

  let relationType = Object.keys(data)[0];
  let resultText = `${relationType}: ${(data[relationType] * 100).toFixed(2)}%\n`;
  document.querySelector('#prediction-text').innerText = resultText
  document.querySelector('#relation-summary').innerText = relation[relationType].des

  setTimeout(() => {
  	const block = document.getElementById('status')
  	block.parentNode.removeChild(block)
  }, (timeout || 1) * 1e3)
}

function displayImage(file) {
    let img = document.createElement("img");
    img.file = file;

    $('#img-predicted').append(img); 

    let reader = new FileReader();
    reader.onload = (function (imgDiv) { return function (e) { imgDiv.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
}

$(document).ready(() => {
    const storage = firebase.storage();
    const storageRef = storage.ref();
    const db = firebase.firestore();

    document.querySelector('#file-select').addEventListener('click', () => {
        document.querySelector('#img-upload').click()
    });

    document.querySelector('#img-upload').addEventListener('change', e => {
        let localFile = e.target.files[0];
        clearPrediction();
        updateProgressBar(true);

        // Upload the image to Firebase Storage
        document.querySelector('#status').innerText = 'Uploading image...'
        let imgRef = storageRef.child(localFile.name);
        imgRef.put(localFile).then(() => {
            document.querySelector('#status').innerText = 'Querying model...'
            db.collection("images")
                .doc(localFile.name)
                .onSnapshot(function (doc) {
                    if (doc.exists) {
                        let relationData = doc.data();
                        updateProgressBar(false);
                        if (relationData.predictionErr) {
                            document.querySelector('#status').innerText = `${relationData.predictionErr} :(`;
                        } else {
                            displayPrediction(relationData);
                            displayImage(localFile);
                        }
                    }
                });
        });
    });
});
