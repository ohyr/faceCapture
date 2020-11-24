import './style.scss';

const {
  navigator,
  document,
  requestAnimationFrame,
} = global;

const getWebcamStream = async function getRealtimeWebcamStream() {
  const video = document.createElement('video');
  video.crossOrigin = 'anonymous';
  video.playsInline = true;

  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: {
        ideal: 'user',
      },
      height: {
        min: 360,
        ideal: 480,
        max: 720,
      },
    },
  })
    .then((stream) => {
      try {
        video.srcObject = stream;
      } catch (error) {
        video.src = URL.createObjdectURL(stream);
      }
    });

  return new Promise((resolve) => {
    video.onloadeddata = () => {
      video.muted = true;
      video.play();
      resolve(video);
    };
  });
};

const sendFace = function sendFaceFindFaceShape(imgBase64) {
  const decodeImg = atob(imgBase64.split(',')[1]);

  const array = [];
  for (let i = 0; i < decodeImg.length; i++) {
    array.push(decodeImg.charCodeAt(i));
  }

  const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  const fname = 'user_' + new Date().getMilliseconds() + '.jpg';
  const data = new FormData();
  data.append('file', blob, fname);

  const faceShape = document.querySelector('.js-faceShape');
  faceShape.textContent = 'Loading...';

  const xhr = new XMLHttpRequest();
  xhr.onload = function (e) {
    const res = e.target.responseText;
    const jsonData = JSON.parse(res);
    faceShape.textContent = jsonData.faceShape;
  }
  xhr.open('POST', 'http://localhost:5000/face/analysis', true);
  xhr.send(data);
}

let input;
const snapShot = function snapShotForFindFaceShape() {
  const img = document.querySelector('.js-shotImg');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext ? canvas.getContext('2d') : null;
  if (ctx === null) throw new Error('Unavailable');

  canvas.width = 224;
  canvas.height = 224;

  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  ctx.drawImage(input,
    100, 100, 324, 324,
    0, 0, canvas.width, canvas.height);

  img.src = canvas.toDataURL('image/jpeg', 'image/octet-stream');
  sendFace(img.src);
}

const viewFace = async function loadFaceCapture() {
  const display = document.querySelector('.js-display');

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext ? canvas.getContext('2d') : null;
  if (ctx === null) throw new Error('Unavailable');

  // canvas.style.width = '100%';

  const video = await getWebcamStream();

  canvas.width = 224;
  canvas.height = 224;

  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  display.append(canvas);
  input = video;
  const loop = async () => {

    ctx.drawImage(video,
      100, 100, 324, 324,
      0, 0, canvas.width, canvas.height);

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

const btn = document.querySelector('.js-snapshot');
btn.addEventListener('click', snapShot);

document.addEventListener('DOMContentLoaded', viewFace);
