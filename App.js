// let video = document.getElementById("video");
// // let model;
// let canvas = document.getElementById("canvas");
// let ctx = canvas.getContext("2d");

// const setupCamera = () => {
//     navigator.mediaDevices.getUserMedia({
//         video : {width:600, height:400},
//         audio : false,
//     })
//     .then((stream) => {
//         video.srcObject = stream;
//     });
// };



// const detectHands = async () => {
//     const pred = await model.estimateFaces(video, false);
//     // const model = await handpose.load();
//     // const hands = await model.estimateHands(video);
//     ctx.drawImage(video, 0, 0, 600, 400);
//     pred.forEach(pre => {
//         ctx.beginPath();
//         ctx.lineWidth = "4";
//         ctx.strokeStyle = "blue";
//         ctx.rect(
//             pre.topLeft[0],
//             pre.topLeft[1],
//             pre.bottomRight[0] - pre.topLeft[0],
//             pre.bottomRight[1] - pre.topLeft[1]
//         );
//         ctx.stroke();
//         ctx.fillStyle="red";
//         pre.landmarks.forEach((landmark) => {
//             ctx.fillRect(landmark[0], landmark[1], 5,5);
//         });
//     });
// };

// const detectFaces = async () => {
//     const pred = await model.estimateFaces(video, false);
//     // const model = await handpose.load();
//     // const hands = await model.estimateHands(video);
//     ctx.drawImage(video, 0, 0, 600, 400);
//     pred.forEach(pre => {
//         ctx.beginPath();
//         ctx.lineWidth = "4";
//         ctx.strokeStyle = "blue";
//         ctx.rect(
//             pre.topLeft[0],
//             pre.topLeft[1],
//             pre.bottomRight[0] - pre.topLeft[0],
//             pre.bottomRight[1] - pre.topLeft[1]
//         );
//         ctx.stroke();
//         ctx.fillStyle="red";
//         pre.landmarks.forEach((landmark) => {
//             ctx.fillRect(landmark[0], landmark[1], 5,5);
//         });
//     });
// };

// setupCamera();
// video.addEventListener("loadeddata", async () =>{
//     model = await blazeface.load();
//     setInterval(detectFaces, 100);
// });

// video.addEventListener("loadeddata", async () =>{
//     const model = handPoseDetection.SupportedModels.MediaPipeHands;
//     const detectorConfig = {
//         runtime: 'mediapipe', // or 'tfjs',
//         solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
//         modelType: 'full'
//       }
    
//     const detector = await handPoseDetection.createDetector(model, detectorConfig);
//     const hands =  await detector.estimateHands(image);
//     console.log(hands);
//     // setInterval(detectFaces, 100);
// });
    
<script type="module">
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 5});
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
    }
  }
  canvasCtx.restore();
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 1280,
  height: 720
});
camera.start();
</script>