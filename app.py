import os
import google.generativeai as genai
import whisper
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import uuid

# --- Configuration ---
# Make sure to set your GOOGLE_API_KEY as an environment variable
# for security reasons.
# Example for Linux/macOS: export GOOGLE_API_KEY="YOUR_API_KEY"
# Example for Windows: set GOOGLE_API_KEY="YOUR_API_KEY"
try:
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
except KeyError:
    print("FATAL: GOOGLE_API_KEY environment variable not set.")
    print("Please set it before running the application.")
    exit()


# --- Initializations ---
app = Flask(__name__)
CORS(app) # Enable Cross-Origin Resource Sharing for the app

# Load the Whisper model. "tiny" is fast and works well for this use case.
# You can use "base" for higher accuracy at the cost of speed.
try:
    print("Loading Whisper model...")
    whisper_model = whisper.load_model("tiny")
    print("Whisper model loaded successfully.")
except Exception as e:
    print(f"Error loading Whisper model: {e}")
    print("Please ensure you have whisper installed (`pip install git+https://github.com/openai/whisper.git`) and ffmpeg is available in your system's PATH.")
    exit()


# Initialize the Gemini model
gemini_model = genai.GenerativeModel('gemini-1.5-flash')

# In a real app, you might get this from a database or a config file.
# We define it here for simplicity. This list MUST match the frontend.
FORM_FIELDS = [
    {'key': 'patient_name', 'label': "Patient's Name"},
    {'key': 'age', 'label': 'Age'},
    {'key': 'gender', 'label': 'Gender'},
    {'key': 'chief_complaint', 'label': 'Chief Complaint'},
    {'key': 'history_of_present_illness', 'label': 'History of Present Illness'},
    {'key': 'past_medical_history', 'label': 'Past Medical History'},
    {'key': 'medications', 'label': 'Current Medications'},
    {'key': 'allergies', 'label': 'Allergies'},
    {'key': 'family_history', 'label': 'Family History'},
    {'key': 'social_history', 'label': 'Social History (Tobacco, Alcohol, etc.)'},
    {'key': 'review_of_systems', 'label': 'Review of Systems'},
    {'key': 'vitals_bp', 'label': 'Blood Pressure'},
    {'key': 'vitals_hr', 'label': 'Heart Rate'},
    {'key': 'vitals_temp', 'label': 'Temperature'},
]

# --- Flask Routes ---

@app.route('/')
def index():
    # The form fields are now primarily managed on the frontend,
    # but we can still pass them in case we need them for other reasons.
    return render_template('index.html', form_fields=FORM_FIELDS)

@app.route('/process_audio', methods=['POST'])
def process_audio():
    # --- THIS IS THE NEW DEBUGGING CODE ---
    print("\n--- Request received at /process_audio ---")
    print("Request files:", request.files)
    print("Request form data:", request.form)
    # ----------------------------------------

    if 'audio_data' not in request.files:
        print("Error: 'audio_data' not in request.files")
        return jsonify({'error': 'No audio file found'}), 400

    if 'field_key' not in request.form:
        print("Error: 'field_key' not in request.form")
        return jsonify({'error': 'No field_key in form data'}), 400

    audio_file = request.files['audio_data']
    field_key = request.form['field_key']
    
    # Find the label for the given key to use in the prompt
    field_label = next((item['label'] for item in FORM_FIELDS if item['key'] == field_key), 'the requested field')

    # Create a temporary file to save the audio
    temp_audio_path = f"temp_audio_{uuid.uuid4()}.webm"
    audio_file.save(temp_audio_path)
    print(f"Audio saved to temporary file: {temp_audio_path}")

    try:
        # 1. Transcribe audio to text using Whisper
        print("Transcribing audio...")
        result = whisper_model.transcribe(temp_audio_path,fp16=False)
        transcribed_text = result['text']
        print(f"Transcription result: '{transcribed_text}'")

        if not transcribed_text.strip():
             return jsonify({
                'error': 'No speech detected in the audio.',
                'field_filled': field_key,
                'extracted_data': ''
            })

        # 2. Extract information using Gemini
        print(f"Extracting info for '{field_label}'...")
        prompt = f"""
        You are a highly accurate medical data entry assistant.
        Analyze the following conversation transcript. The doctor is asking for the patient's "{field_label}".
        Your task is to extract only the specific value for this field.
        - Translate the answer to English if it is in another language (like Hindi or Tamil).
        - If the value is a number, write it as a digit (e.g., "forty-five" should be "45").
        - For blood pressure, format it as "systolic/diastolic" (e.g., "120/80").
        - Do not add any extra words, explanations, or labels. Respond ONLY with the extracted value.
        - If you cannot find a clear answer for the field, respond with an empty string.

        Transcript:
        "{transcribed_text}"

        Extracted Value:
        """
        
        response = gemini_model.generate_content(prompt)
        extracted_data = response.text.strip()
        print(f"Extracted data from Gemini: '{extracted_data}'")

        return jsonify({
            'transcribed_text': transcribed_text,
            'extracted_data': extracted_data,
            'field_filled': field_key
        })

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        # 3. Clean up the temporary file
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)
            print(f"Cleaned up temporary file: {temp_audio_path}")

if __name__ == '__main__':
    app.run(debug=True)


