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

const checkGender = function checkGenderOfUser() {
  if (document.querySelector('.js-female').checked) {
    return 'female'
  }

  return 'male'
}

const sendFace = function sendFaceFindFaceShape(imgBase64) {
  const gender = checkGender();

  const decodeImg = atob(imgBase64.split(',')[1]);

  const array = [];
  for (let i = 0; i < decodeImg.length; i++) {
    array.push(decodeImg.charCodeAt(i));
  }

  const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  const fname = gender + '_' + new Date().getMilliseconds() + '.jpg';
  const data = new FormData();
  data.append('file', blob, fname);

  const faceShape = document.querySelector('.js-faceShape');
  faceShape.textContent = 'Loading...';

  const recom1 = document.querySelector('.js-recomImg1');
  const recom2 = document.querySelector('.js-recomImg2');
  recom1.style.opacity = 0.2;
  recom2.style.opacity = 0.2;

  const xhr = new XMLHttpRequest();
  xhr.onload = function (e) {
    const res = e.target.responseText;
    const jsonData = JSON.parse(res);

    // faceShape.textContent = jsonData.faceShape;
    // recom1.src = '../image/shape/' + jsonData.faceShape + '/' + jsonData.faceShape + 'G1.jpg'
    // recom2.src = '../image/shape/' + jsonData.faceShape + '/' + jsonData.faceShape + 'G2.jpg'

    faceShape.textContent = jsonData.celebName;
    recom1.src = '../image/celeb/' + gender + '/' + jsonData.celebName + '/' + jsonData.celebName + 'G1.jpg'
    recom2.src = '../image/celeb/' + gender + '/' + jsonData.celebName + '/' + jsonData.celebName + 'G2.jpg'

    recom1.style.opacity = 1;
    recom2.style.opacity = 1;
  }
  // xhr.open('POST', 'http://localhost:5000/face/analysis', true);
  xhr.open('POST', 'http://localhost:5000/face/celeb', true);
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
