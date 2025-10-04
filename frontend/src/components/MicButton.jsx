import React, { useState, useRef } from 'react';

// Microphone Icon SVG
const MicIcon = ({ isRecording }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic-fill" viewBox="0 0 16 16">
  <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z"/>
  <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/>
</svg>
);

function MicButton({ onTranscription, fieldId, onStatusChange }) {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleMicClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                setIsRecording(true);
                onStatusChange(`Recording for ${fieldId}...`, 'blue');
                const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.addEventListener("dataavailable", event => {
                    audioChunksRef.current.push(event.data);
                });

                mediaRecorder.addEventListener("stop", async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    await transcribeAudio(audioBlob);
                });

                mediaRecorder.start();
            })
            .catch(err => {
                console.error("Mic access error:", err);
                onStatusChange("Error: Could not access microphone.", 'red');
            });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            onStatusChange(`Transcribing for ${fieldId}...`, 'blue');
        }
    };

    const transcribeAudio = async (audioBlob) => {
        const formData = new FormData();
        formData.append('audio_data', audioBlob);

        try {
            // Use the new, simpler endpoint
            const response = await fetch('http://127.0.0.1:5000/transcribe', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Server error during transcription');

            const result = await response.json();
            if (result.error) throw new Error(result.error);
            
            // Call the callback to update the parent form's state
            onTranscription(fieldId, result.text);
            onStatusChange(`Transcription completed.`, 'green');

        } catch (error) {
            console.error('Error transcribing audio:', error);
            onStatusChange(`Error: ${error.message}`, 'red');
        } finally {
            audioChunksRef.current = [];
        }
    };

    return (
        <button
            type="button"
            onClick={handleMicClick}
            className={`absolute inset-y-0 right-0 flex items-center pr-3 ${isRecording ? 'animate-pulse' : ''}`}
            aria-label={`Transcribe for ${fieldId}`}
        >
            <MicIcon isRecording={isRecording} />
        </button>
    );
}

export default MicButton;