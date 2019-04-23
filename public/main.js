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
    $('#relation-summary', '#status', '#prediction-text').text('');
    $('#card').css('display', 'none'); 
}

function updateProgressBar(status) {
    if (status == 'show') {
        $('#progress-bar').css('display', 'inline-block');
        $('#progress-bar').addClass('mdl-progress__indeterminate');
    } else if (status == 'hide') {
        $('#progress-bar').css('display', 'none');
    }
}

function displayPrediction(data) {
    $('#card').css('display', 'inline-block');
    $('#status').text('Got a prediction!');

    // This demo assumes only one label returned

    let relationType = Object.keys(data)[0];
    let resultText = `${relationType}: ${(data[relationType] * 100).toFixed(2)}%\n`;

   $('#prediction-text').text(resultText);
   $('#relation-summary').text(relation[relationType].des);
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

    $('#file-select').on('click', () => {
        $('#img-upload').trigger("click");
    });

    $('#img-upload').on('change', (e) => {
        let localFile = e.target.files[0];
        clearPrediction();
        updateProgressBar('show');

        // Upload the image to Firebase Storage
        $('#status').text('Uploading image...');
        let imgRef = storageRef.child(localFile.name);
        imgRef.put(localFile).then(() => {
            $('#status').text('Querying model...');
            db.collection("images")
                .doc(localFile.name)
                .onSnapshot(function (doc) {
                    if (doc.exists) {
                        let relationData = doc.data();
                        updateProgressBar('hide');
                        if (relationData.predictionErr) {
                            $('#status').text(`${relationData.predictionErr} :(`);
                        } else {
                            displayPrediction(relationData);
                            displayImage(localFile);
                        }
                    }
                });
        });
    });
});