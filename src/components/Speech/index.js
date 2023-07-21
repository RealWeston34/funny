import React, { useState } from 'react';

const SpeechToText = () => {
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];
    mediaRecorder.addEventListener('dataavailable', event => {
      audioChunks.push(event.data);
    });
    mediaRecorder.addEventListener('stop', async () => {
      // Convert the recorded audio to a Blob and send it to the Whisper API for ASR
      const audioBlob = new Blob(audioChunks);
      const formData = new FormData();
      formData.append('file', audioBlob);
      const response = await fetch('<URL>', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      // Update the transcription state with the resulting speech-to-text transcription
      setTranscription(data.transcription);
      setIsRecording(false);
    });
    mediaRecorder.start();
  };

  const handleStopRecording = () => {
    // Stop recording audio
    mediaRecorder.stop();
  };

  return (
    <div>
      <h1>Speech-to-Text</h1>
      <button onClick={handleStartRecording} disabled={isRecording}>Start Recording</button>
      <button onClick={handleStopRecording} disabled={!isRecording}>Stop Recording</button>
      <p>Transcription: {transcription}</p>
    </div>
  );
};

export default SpeechToText;
