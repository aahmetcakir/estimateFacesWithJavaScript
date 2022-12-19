let video = document.getElementById("video");
let model;

// declare the canvas variable and setting up the context 

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const accessCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: { width: 600, height: 500 },
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    });
};

const detectFaces = async () => {
  const prediction = await model.estimateFaces(video, false);
  ctx.drawImage(video, 0, 0, 600, 500);

  prediction.forEach((predictions) => {

    // Drawing rectangle that'll detect the face
    ctx.beginPath();
    ctx.lineWidth = "4";
    ctx.strokeStyle = "red";
    ctx.rect(
      predictions.topLeft[0],
      predictions.topLeft[1],
      predictions.bottomRight[0] - predictions.topLeft[0],
      predictions.bottomRight[1] - predictions.topLeft[1]
    );
    // The last two arguments denotes the width and height
    // but since the blazeface models only returns the coordinates  
    // so we have to subtract them in order to get the width and height
    ctx.stroke();
    ctx.font = "50px sans";
    ctx.fillStyle = "yellow";
    if (prediction[0]?.probability) {
      ctx.fillText(Number.parseFloat(prediction[0]?.probability).toFixed(5), predictions.bottomRight[0] / 2, predictions.bottomRight[1] + 50);
    }

  });
  if (prediction[0]?.probability == undefined) {
    ctx.fillStyle = "red";
    ctx.fillText("yüz algılanmadı", canvas.width / 4, canvas.height / 2);
  }
};

accessCamera();

video.addEventListener("loadeddata", async () => {
  model = await blazeface.load();
  // Calling the detectFaces every 16 millisecond
  setInterval(detectFaces, 1000 / 60);
});