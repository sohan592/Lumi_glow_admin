import React, { useEffect, useRef, useState } from 'react';
import { FaceDetection, Results } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';

type Status = 'LOOK_STRAIGHT' | 'COME_CLOSER' | 'OK' | 'NO_FACE';
type LightStatus = 'LOW' | 'MODERATE' | 'OK';
type DistanceStatus = 'TOO_FAR' | 'PERFECT' | 'TOO_CLOSE';

const FaceDetectionApp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [positionStatus, setPositionStatus] = useState<Status>('NO_FACE');
  const [lightStatus, setLightStatus] = useState<LightStatus>('LOW');
  const [distanceStatus, setDistanceStatus] =
    useState<DistanceStatus>('TOO_FAR');
  const [instruction, setInstruction] = useState<string>(
    'Position your face in the center of the screen.',
  );

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const faceDetection = new FaceDetection({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      model: 'short',
      minDetectionConfidence: 0.5,
    });

    faceDetection.onResults((results: Results) => {
      const canvasCtx = canvasRef.current?.getContext('2d');
      if (!canvasCtx || !canvasRef.current) return;

      // Clear canvas
      canvasCtx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );

      // Draw video feed
      const videoSource = results.image as unknown as HTMLVideoElement;
      canvasCtx.drawImage(
        videoSource,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );

      // Light detection
      const brightness = calculateAverageBrightness(
        canvasCtx,
        canvasRef.current,
      );
      if (brightness < 50) {
        setLightStatus('LOW');
      } else if (brightness < 150) {
        setLightStatus('MODERATE');
      } else {
        setLightStatus('OK');
      }

      if (results.detections && results.detections.length > 0) {
        const detection = results.detections[0];
        const boundingBox = detection.boundingBox;

        const xMin = boundingBox.xCenter - boundingBox.width / 2;
        const yMin = boundingBox.yCenter - boundingBox.height / 2;
        const xMax = boundingBox.xCenter + boundingBox.width / 2;
        const yMax = boundingBox.yCenter + boundingBox.height / 2;

        const faceWidth = xMax - xMin;
        const faceHeight = yMax - yMin;

        // Draw bounding box
        canvasCtx.strokeStyle = 'green';
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeRect(
          xMin * canvasRef.current.width,
          yMin * canvasRef.current.height,
          faceWidth * canvasRef.current.width,
          faceHeight * canvasRef.current.height,
        );

        // Check if the user is looking straight
        const centerX = canvasRef.current.width / 2;
        const centerY = canvasRef.current.height / 2;

        const faceCenterX = boundingBox.xCenter * canvasRef.current.width;
        const faceCenterY = boundingBox.yCenter * canvasRef.current.height;

        const threshold = 0.1;

        if (
          Math.abs(faceCenterX - centerX) >
            threshold * canvasRef.current.width ||
          Math.abs(faceCenterY - centerY) > threshold * canvasRef.current.height
        ) {
          setPositionStatus('LOOK_STRAIGHT');
          setInstruction('Please look straight at the camera.');
        } else if (faceWidth > 0.6 || faceHeight > 0.6) {
          setPositionStatus('COME_CLOSER');
          setInstruction('You are too close! Step back slightly.');
        } else if (faceWidth < 0.2 || faceHeight < 0.2) {
          setPositionStatus('LOOK_STRAIGHT');
          setInstruction('Move closer to the camera.');
        } else {
          setPositionStatus('OK');
          setInstruction('Perfect! Hold still.');
        }

        if (faceWidth > 0.8) {
          setDistanceStatus('TOO_CLOSE');
        } else if (faceWidth < 0.5) {
          setDistanceStatus('TOO_FAR');
        } else {
          setDistanceStatus('PERFECT');
        }
      } else {
        setPositionStatus('NO_FACE');
        setInstruction('No face detected. Position your face in view.');
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceDetection.send({ image: videoRef.current! });
      },
    });
    camera.start();

    return () => {
      camera.stop();
    };
  }, []);

  const calculateAverageBrightness = (
    canvasCtx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ): number => {
    const imageData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let totalBrightness = 0;

    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      totalBrightness += brightness;
    }

    return totalBrightness / (canvas.width * canvas.height);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <h1 className="text-2xl font-bold text-white/90 text-center mb-8">
          Face Detection
        </h1>

        {/* Main Camera View */}
        <div className="relative aspect-square max-w-md mx-auto">
          {/* Circular Frame */}
          <div className="absolute inset-0 rounded-full border-8 border-white/10 overflow-hidden bg-black/20">
            <video
              ref={videoRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
              style={{ display: 'none' }}
            />
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="w-full h-full"
            />

            {/* Face Guide Overlay */}
            <div className="absolute inset-0 border-4 border-dashed border-white/20 rounded-full" />
          </div>

          {/* Status Indicators */}
          <div className="absolute -bottom-24 left-0 right-0">
            <div className="flex justify-center items-center space-x-8">
              {/* Face Position */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full mb-2 transition-colors ${
                    positionStatus === 'LOOK_STRAIGHT'
                      ? 'bg-yellow-400 animate-pulse'
                      : positionStatus === 'OK'
                        ? 'bg-green-400 animate-pulse'
                        : 'bg-red-500'
                  }`}
                />
                <span className="text-white/70 text-sm">Position</span>
              </div>

              {/* Light Level */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full mb-2 transition-colors ${
                    lightStatus === 'OK'
                      ? 'bg-green-400 animate-pulse'
                      : lightStatus === 'MODERATE'
                        ? 'bg-yellow-400'
                        : 'bg-red-500'
                  }`}
                />
                <span className="text-white/70 text-sm">Light</span>
              </div>

              {/* Distance */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full mb-2 transition-colors ${
                    distanceStatus === 'PERFECT'
                      ? 'bg-green-400 animate-pulse'
                      : distanceStatus === 'TOO_CLOSE'
                        ? 'bg-red-500'
                        : 'bg-yellow-400'
                  }`}
                />
                <span className="text-white/70 text-sm">Distance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-28 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 border border-white/10">
            <span
              className={`w-2 h-2 rounded-full mr-3 ${
                positionStatus === 'OK'
                  ? 'bg-green-400 animate-pulse'
                  : 'bg-yellow-400'
              }`}
            />
            <p className="text-white/90 font-medium">{instruction}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceDetectionApp;
