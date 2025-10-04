import React from 'react';

function Controls({ isRecording, isProcessing, onStart, onStop, onReset }) {
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                <span>{buttonText}</span>
            </button>
            <button
                onClick={onReset}
                disabled={isRecording || isProcessing}
                className="ml-4 rounded-full bg-gray-500 px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50"
            >
                Reset Form
            </button>
        </div>
    );
}

export default Controls;