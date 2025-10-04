import React from 'react';
import { useNavigate } from 'react-router-dom';
import myBackgroundImage from '../assets/background.jpg'; // Ensure you have an appropriate background image in the assets folder

function LandingPage() {
    const navigate = useNavigate();

    const goToDetailsPage = () => {
        navigate('/details');
    };

    return (
        <div className=" h-screen w-full bg-cover bg-center 
        flex items-center justify-center"
         style={{ backgroundImage: `url(${myBackgroundImage})` }}
        >
            <div className=" max-w-2xl rounded-2xl p-10 text-center shadow-xl
                border border-white/30 
                bg-white/20 
                backdrop-blur-sm">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                    Welcome to the Scribe AI
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    This tool helps you automatically fill out complex medical forms by transcribing and analyzing patient consultations. Get started by navigating to the form.
                </p>
                <button
                    onClick={goToDetailsPage}
                    className="mt-8 rounded-full bg-blue-600 px-10 py-4 font-bold text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    Go to Form
                </button>
            </div>
        </div>
    );
}

export default LandingPage;