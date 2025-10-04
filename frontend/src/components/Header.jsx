import React from 'react';

function Header() {
    return (
        <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold md:text-4xl">Medical Scribe AI</h1>
            <p className="mt-2 text-gray-600">Record the patient consultation. The AI will fill the text fields automatically.</p>
        </header>
    );
}

export default Header;