const video = document.getElementById('video')
const happyText = document.getElementById('happy')
const surprisedText = document.getElementById('surprised')
const neutralText = document.getElementById('neutral')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  var constraints = { audio: false, video: { width: 1280, height: 720 } };
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function (mediaStream) {
      var video = document.querySelector('video');
      video.srcObject = mediaStream;
    })
}

const videoSection = document.querySelector('.video')

video.addEventListener('play', () => {
  let expressions, expression;

  const canvas = faceapi.createCanvasFromMedia(video)
  videoSection.append(canvas)

  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  setInterval(async () => {
    let prevExpression = expression

    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

    // faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)


    if (detections[0] === undefined) {
      expression = null
    } else {
      expressions = detections[0].expressions
      expression = Object.keys(expressions).reduce((a, b) => expressions[a] > expressions[b] ? a : b), neutral = expressions.neutral;
    }

    if (prevExpression !== expression) {
      createStory(expression)
    }

  }, 1000)

})


// const words = words

