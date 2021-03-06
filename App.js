const videoElement = document.getElementsByClassName('input_video')[0];
const video = document.getElementById('input_video');
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const outputText = document.getElementsByClassName('output_text')[0];
const loader = document.getElementById('loader');
const canvasCtx = canvasElement.getContext('2d');

function onResults(results) {
    loader.style.display="none";
    canvasElement.style.display="block";
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                        {color: '#FFFFFF', lineWidth: 5});
        drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 5});
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
  }, width:(canvasElement.width),height:(canvasElement.height)
});

// const setupCam = () =>{
//     navigator.mediaDevices.getUserMedia({
//         video:{width:600,height:400},
//         audio : false
//     })
//     .then((stream) => {
//         video.srcObject = stream;
        
//     });
// };
// setupCam();
// hands.send({image: video});
camera.start();