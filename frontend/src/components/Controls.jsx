import React from 'react';

// --- ICONS for the button ---
const MicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
);
const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h12v12H6z" />
    </svg>
);
const SpinnerIcon = () => (
    <svg className="h-6 w-6 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// Note: The props `onReset` and `onExport` are removed
function Controls({ isRecording, isProcessing, onStart, onStop }) {
    const recordButtonClasses = isRecording
        ? 'bg-red-600 hover:bg-red-700 status-pulse'
        : 'bg-blue-600 hover:bg-blue-700';

    const buttonText = isProcessing ? 'Processing...' : (isRecording ? 'Stop Recording' : 'Start Recording');

    return (
        <div className="mb-8 flex justify-center border-b border-gray-200 pb-8">
            <button
                onClick={isRecording ? onStop : onStart}
                disabled={isProcessing}
                className={`flex items-center space-x-2 rounded-full px-8 py-3 font-bold text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ${recordButtonClasses} ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
            >
                {/* --- Conditional Icon Logic --- */}
                {isProcessing ? (
                    <SpinnerIcon />
                ) : isRecording ? (
                    <StopIcon />
                ) : (
                    <MicIcon />
                )}
                <span>{buttonText}</span>
            </button>

            {/* The Reset and Export buttons have been removed from this component */}
            
        </div>
    );
}

export default Controls;
