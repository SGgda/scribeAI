import os
import google.generativeai as genai
import whisper
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import uuid
import json

# --- Configuration ---
try:
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
except KeyError:
    print("FATAL: GOOGLE_API_KEY environment variable not set.")
    exit()


# --- Initializations ---
app = Flask(__name__)
CORS(app)

print("Loading Whisper model...")
try:
    whisper_model = whisper.load_model("base") # Using 'base' for better accuracy on longer audio
    print("Whisper model loaded successfully.")
except Exception as e:
    print(f"Error loading Whisper model: {e}")
    exit()

gemini_model = genai.GenerativeModel('gemini-1.5-flash')

# This list is now used to construct the JSON schema for the AI
FORM_FIELDS_SCHEMA = {
    'patient_name': "Patient's Full Name",
    'age': 'Age in years',
    'gender': 'Gender (e.g., Male, Female, Other)',
    'chief_complaint': 'The main reason for the visit, in the patient\'s own words.',
    'history_of_present_illness': 'A detailed story of the chief complaint.',
    'past_medical_history': 'Any significant past illnesses or surgeries.',
    'medications': 'List of current medications.',
    'allergies': 'Any known allergies, especially to medication.',
    'family_history': 'Significant illnesses in the patient\'s family.',
    'social_history': 'Details on tobacco, alcohol, or drug use.',
    'review_of_systems': 'A summary of other potential symptoms mentioned.',
    'vitals_bp': 'Blood Pressure (e.g., "120/80")',
    'vitals_hr': 'Heart Rate (beats per minute)',
    'vitals_temp': 'Temperature'
}

# --- Flask Routes ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_audio', methods=['POST'])
def process_audio():
    print("\n--- Request received for full conversation processing ---")
    if 'audio_data' not in request.files:
        print("Error: 'audio_data' not in request.files")
        return jsonify({'error': 'No audio file found'}), 400

    audio_file = request.files['audio_data']
    temp_audio_path = f"temp_audio_{uuid.uuid4()}.webm"
    audio_file.save(temp_audio_path)
    print(f"Audio saved to: {temp_audio_path}")

    try:
        # 1. Transcribe the entire conversation
        print("Transcribing audio...")
        result = whisper_model.transcribe(temp_audio_path, fp16=False)
        transcribed_text = result['text']
        print(f"Full Transcription: '{transcribed_text}'")

        if not transcribed_text.strip():
            return jsonify({'error': 'No speech detected.'})

        # 2. Use a sophisticated prompt to extract all fields into a JSON object
        print("Extracting all fields with Gemini...")
        
        # We create a string representing the desired JSON keys from our schema
        json_keys = ", ".join(f'"{key}"' for key in FORM_FIELDS_SCHEMA.keys())

        prompt = f"""
        You are an expert medical scribe. Your task is to analyze a conversation transcript between a doctor and a patient and extract key information into a structured JSON object.
        
        - The JSON object must only contain the following keys: {json_keys}.
        - For each key, extract the corresponding information from the transcript.
        - If a piece of information for a specific key is not mentioned in the transcript, the value for that key should be an empty string "".
        - Translate any non-English information (e.g., Hindi, Tamil) into English before filling the value.
        - Normalize data: write ages and vital signs as digits. Format blood pressure as "systolic/diastolic".
        - Your final output MUST be a single, valid JSON object and nothing else. Do not include any explanatory text before or after the JSON.

        Transcript:
        ---
        {transcribed_text}
        ---

        JSON Output:
        """
        
        response = gemini_model.generate_content(prompt)
        
        # Clean the response to get a valid JSON string
        # LLMs sometimes wrap the JSON in ```json ... ``` or add extra text.
        response_text = response.text.strip().replace('```json', '').replace('```', '')
        print(f"Gemini Raw Response: {response_text}")

        # Parse the JSON string into a Python dictionary
        extracted_data = json.loads(response_text)
        print(f"Successfully Parsed JSON: {extracted_data}")

        return jsonify({
            'transcribed_text': transcribed_text,
            'extracted_data': extracted_data
        })

    except json.JSONDecodeError:
        print("Error: Failed to decode JSON from Gemini's response.")
        return jsonify({'error': "The AI failed to return valid JSON. Please check the server logs."}), 500
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)
            print(f"Cleaned up temp file: {temp_audio_path}")

if __name__ == '__main__':
    app.run(debug=True)

