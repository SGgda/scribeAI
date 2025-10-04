import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import StatusDisplay from '../components/StatusDisplay';
import Controls from '../components/Controls';
import MedicalForm from '../components/MedicalForm';

function DetailsPage() {
    // State for the main status display
    const [status, setStatus] = useState({
        message: "Start recording the consultation or use the mic on any field.",
        color: 'blue'
    });

    // State for the global recording feature
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Refs for the form and media recorder logic
    const formRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // --- Global Recording Logic (for /process_audio) ---

    const handleApiResponse = (result) => {
        if (result.error) {
            setStatus({ message: `Error: ${result.error}`, color: 'red' });
            return;
        }
        const data = result.extracted_data;
        if (formRef.current) {
            formRef.current.fillForm(data); // This calls the method on MedicalForm to fill all fields
        }
        const filledCount = Object.values(data).filter(Boolean).length;
        setStatus({
            message: `Analysis complete. ${filledCount} fields were filled. Please review.`,
            color: 'green'
        });
    };

    const processAudio = async () => {
        setStatus({ message: 'Transcribing and analyzing... Please wait.', color: 'blue' });
        setIsProcessing(true);

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFormData = new FormData();
        audioFormData.append('audio_data', audioBlob, 'consultation.webm');

        try {
            // THIS IS THE FETCH CALL FOR THE GLOBAL RECORDING FEATURE
            const response = await fetch('http://127.0.0.1:5000/process_audio', {
                method: 'POST',
                body: audioFormData
            });
            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.error || `Server error: ${response.statusText}`);
            }
            const result = await response.json();
            handleApiResponse(result);
        } catch (error) {
            console.error('Error processing audio:', error);
            setStatus({ message: `Error: ${error.message}`, color: 'red' });
        } finally {
            setIsProcessing(false);
            audioChunksRef.current = [];
        }
    };

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.addEventListener("dataavailable", event => {
                    audioChunksRef.current.push(event.data);
                });
                
                // Set the 'processAudio' function to run when recording stops
                mediaRecorder.addEventListener("stop", processAudio);

                mediaRecorder.start();
                setIsRecording(true);
                setStatus({ message: 'Recording full consultation...', color: 'red' });
            })
            .catch(err => {
                console.error("Mic access error:", err);
                setStatus({ message: "Error: Could not access microphone.", color: 'red' });
            });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };
    
    // --- Shared Logic ---
    const handleStatusChange = (message, color) => {
        setStatus({ message, color });
    };

    const handleReset = () => {
        if (formRef.current) {
            formRef.current.resetForm();
        }
        if (isRecording) {
            stopRecording();
        }
        setStatus({
            message: "Form reset. Start a new consultation when ready.",
            color: 'blue'
        });
    };

    return (
        <div className="bg-gray-100 font-sans text-gray-900">
            <div className="container mx-auto max-w-5xl p-4 md:p-8">
                <Header />
                <main className="rounded-2xl bg-white p-6 shadow-xl md:p-8">
                    <StatusDisplay status={status} isProcessing={isProcessing} />
                    {/* The Controls component triggers startRecording and stopRecording */}
                    <Controls
                        isRecording={isRecording}
                        isProcessing={isProcessing}
                        onStart={startRecording}
                        onStop={stopRecording}
                        onReset={handleReset}
                    />
                    {/* The MedicalForm receives the function to update status from individual mics */}
                    <MedicalForm ref={formRef} onStatusChange={handleStatusChange} />
                </main>
            </div>
        </div>
    );
}

export default DetailsPage;