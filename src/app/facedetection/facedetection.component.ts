import {Component, OnInit, ViewChild} from '@angular/core';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-facedetection',
  templateUrl: './facedetection.component.html',
  styleUrls: ['./facedetection.component.css']
})


export class FacedetectionComponent implements OnInit {

  @ViewChild('inputVideo') videoplayer: any;
  @ViewChild('overlay') canvas: any;

  constructor() {
  }

  async Load() {
    //const net = new faceapi.TinyFaceDetector();
    //await net.load(await faceapi.fetchNetWeights('./assets/weights/tiny_face_detector_model-weights_manifest.json'));
    // await faceapi.loadFaceLandmarkModel('./assets/weights/face_landmark_68_model-weights_manifest.json');
    await faceapi.loadTinyFaceDetectorModel('./assets/weights');
    await faceapi.loadFaceLandmarkTinyModel('./assets/weights');
    const input = this.videoplayer.nativeElement;
    const canvas = this.canvas.nativeElement;
    this.onPlay(input,canvas);
  }

  async onPlay(videoEl,canvas) {
    if(!videoEl.currentTime || videoEl.paused || videoEl.ended)
      return setTimeout(() => this.onPlay(videoEl,canvas));

    const detectionsWithLandmarks = await faceapi.detectAllFaces(videoEl,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true);
    const { width, height } = videoEl instanceof HTMLVideoElement
      ? faceapi.getMediaDimensions(videoEl)
      : videoEl;
    canvas.width = width;
    canvas.height = height;
    console.log(canvas.width);
    console.log(canvas.height);
   // const detectionsWithLandmarksForSize = detectionsWithLandmarks.map(det => det.forSize(videoEl.width, videoEl.height));
    console.log(detectionsWithLandmarks);
    let detectionsL = [];
    let detectionsB = [];
    let l = detectionsWithLandmarks.length;
    for (let i=0;i<l;i++){
      detectionsL.push(detectionsWithLandmarks[i]['faceLandmarks']);
      detectionsB.push(detectionsWithLandmarks[i]['faceDetection']);
    }
    faceapi.drawDetection(canvas, detectionsB, { withScore: true });
    faceapi.drawLandmarks(canvas, detectionsL, { drawLines: true });
    setTimeout(() => this.onPlay(videoEl,canvas))
  }

  ngOnInit() {

    this.Load();



  }



}
