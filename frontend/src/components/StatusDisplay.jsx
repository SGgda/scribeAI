import React from 'react';

function StatusDisplay({ status, isProcessing }) {
    const colorClasses = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        red: 'text-red-600'
    };

    return (
        <div className="mb-6 rounded-lg border bg-gray-50 p-4 text-center">
            <p className="text-lg font-semibold text-gray-700">Status</p>
            <p className={`min-h-[28px] text-xl font-bold ${colorClasses[status.color] || 'text-blue-600'}`}>
                {status.message}
            </p>
            {isProcessing && (
                <div className="mx-auto mt-2 h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
            )}
        </div>
    );
}

export default StatusDisplay;