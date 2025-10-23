import React from 'react';
import MicButton from './MicButton';

// --- Reusable Form Field Components ---

const Input = ({ id, label, value, onChange, onTranscription, onStatusChange, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="relative mt-1">
            <input 
                type="text" 
                id={id} 
                name={id} 
                value={value} 
                onChange={onChange} 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10" 
                {...props} 
            />
            <MicButton fieldId={id} onTranscription={onTranscription} onStatusChange={onStatusChange} />
        </div>
    </div>
);

const Textarea = ({ id, label, value, onChange, onTranscription, onStatusChange, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="relative mt-1">
            <textarea 
                id={id} 
                name={id} 
                value={value} 
                onChange={onChange} 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pr-10" 
                {...props}
            ></textarea>
            <MicButton fieldId={id} onTranscription={onTranscription} onStatusChange={onStatusChange} />
        </div>
    </div>
);

const RadioGroup = ({ name, value, onChange, options }) => (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {options.map(opt => (
            <label key={opt.value} className="flex items-center text-sm text-gray-700">
                <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={onChange} className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="ml-2">{opt.label}</span>
            </label>
        ))}
    </div>
);

const YesNoRadio = ({ name, value, onChange, label }) => (
    <div className="flex items-center justify-between p-2 rounded-md bg-gray-50">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <RadioGroup name={name} value={value} onChange={onChange} options={[{ value: 'yes', label: 'Y' }, { value: 'no', label: 'N' }]} />
    </div>
);

const SectionWrapper = ({ title, children }) => (
    <fieldset className="p-4 border rounded-lg shadow-sm space-y-4 bg-white">
        <legend className="text-lg font-semibold text-gray-800 px-2">{title}</legend>
        {children}
    </fieldset>
);

// --- FORM SECTION COMPONENTS ---

export const EventDetails = ({ data, onChange, onTranscription, onStatusChange }) => (
    <SectionWrapper title="Event Details">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input id="organised_by" label="Organised By:" value={data.organised_by} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange} />
            <Input id="department" label="Department:" value={data.department} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input id="event_date" label="Date:" value={data.event_date} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange} placeholder="YYYY-MM-DD"/>
            <Input id="event_place" label="Place:" value={data.event_place} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange} />
            <Input id="event_district" label="District:" value={data.event_district} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange} />
        </div>
    </SectionWrapper>
);

export const PatientDemographics = ({ data, onChange, onTranscription, onStatusChange }) => (
    <SectionWrapper title="Patient Demographics">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2"><Input id="patient_name" label="Name:" value={data.patient_name} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange}/></div>
            <Input id="patient_age" label="Age:" value={data.patient_age} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange}/>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input id="patient_contact" label="Contact:" value={data.patient_contact} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange}/>
            <Input id="patient_education" label="Education:" value={data.patient_education} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange}/>
            <div>
                 <label className="block text-sm font-medium text-gray-700">Gender:</label>
                 <div className="mt-2"><RadioGroup name="gender" value={data.gender} onChange={onChange} options={[{value: 'male', label: 'Male'}, {value: 'female', label: 'Female'}, {value: 'other', label: 'Other'}]}/></div>
            </div>
        </div>
        <Input id="family_monthly_income" label="Monthly Income of Family:" value={data.family_monthly_income} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange}/>
    </SectionWrapper>
);

export const MedicalHistory = ({ data, onChange, onTranscription, onStatusChange }) => (
    <SectionWrapper title="History & Complaint">
        <Textarea id="chief_complaint" rows="3" label="Chief Complaint:" value={data.chief_complaint} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange}/>
        <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Past Medical History:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-3">
                <YesNoRadio label="Diabetes" name="diabetes" value={data.diabetes} onChange={onChange}/>
                <YesNoRadio label="Hypertension" name="hypertension" value={data.hypertension} onChange={onChange}/>
                <YesNoRadio label="Thyroid disorders" name="thyroid" value={data.thyroid} onChange={onChange}/>
                <YesNoRadio label="Cardiovascular" name="cardio" value={data.cardio} onChange={onChange}/>
                <YesNoRadio label="Respiratory" name="respiratory" value={data.respiratory} onChange={onChange}/>
                <YesNoRadio label="Bleeding disorders" name="bleeding" value={data.bleeding} onChange={onChange}/>
            </div>
        </div>
        <Input id="past_medical_history_others" label="Others (Medical):" value={data.past_medical_history_others} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange}/>
        <Input id="past_dental_visit_details" label="Past Dental Visit:" value={data.past_dental_visit_details} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange}/>
    </SectionWrapper>
);

export const Habits = ({ data, onChange, onTranscription, onStatusChange }) => (
    <SectionWrapper title="Personal Habits">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-3">
            <YesNoRadio label="Smoking" name="smoking" value={data.smoking} onChange={onChange}/>
            <YesNoRadio label="Alcohol" name="alcohol" value={data.alcohol} onChange={onChange}/>
            <YesNoRadio label="Smokeless Tobacco" name="tobacco" value={data.tobacco} onChange={onChange}/>
        </div>
        <Input id="personal_habits_others" label="Others (Habits):" value={data.personal_habits_others} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange}/>
    </SectionWrapper>
);

export const ClinicalExam = ({ data, onChange, onTranscription, onStatusChange }) => (
    <SectionWrapper title="Clinical Examination">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Input id="clinical_decayed" label="Decayed:" value={data.clinical_decayed} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange} />
            <Input id="clinical_missing" label="Missing:" value={data.clinical_missing} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange} />
            <Input id="clinical_filled" label="Filled:" value={data.clinical_filled} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange} />
            <Input id="clinical_pain" label="Pain:" value={data.clinical_pain} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange} />
            <Input id="clinical_fractured_teeth" label="Fractured Teeth:" value={data.clinical_fractured_teeth} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange} />
            <Input id="clinical_mobility" label="Mobility:" value={data.clinical_mobility} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange} />
        </div>
        <Input id="clinical_examination_others" label="Others (Examination):" value={data.clinical_examination_others} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange} />
    </SectionWrapper>
);

export const GingivaOralHealth = ({ data, onChange, onTranscription, onStatusChange }) => (
    <SectionWrapper title="Gingiva & Oral Health">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
             <YesNoRadio label="Calculus" name="calculus" value={data.calculus} onChange={onChange}/>
             <YesNoRadio label="Stains" name="stains" value={data.stains} onChange={onChange}/>
             <YesNoRadio label="Dental Fluorosis" name="fluorosis" value={data.fluorosis} onChange={onChange}/>
             <YesNoRadio label="Malocclusion" name="malocclusion" value={data.malocclusion} onChange={onChange}/>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Chronic Gingivitis:</label>
                 <RadioGroup name="gingivitis" value={data.gingivitis} onChange={onChange} options={[{ value: 'localized', label: 'L' }, { value: 'generalized', label: 'G' }, { value: 'none', label: 'N' }]} />
             </div>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Chronic Periodontitis:</label>
                 <RadioGroup name="periodontitis" value={data.periodontitis} onChange={onChange} options={[{ value: 'localized', label: 'L' }, { value: 'generalized', label: 'G' }, { value: 'none', label: 'N' }]} />
             </div>
        </div>
        <Input id="oral_mucosal_lesion" label="Oral Mucosal Lesion:" value={data.oral_mucosal_lesion} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange}/>
        <Input id="teeth_cleaning_method" label="Method of Cleaning Teeth:" value={data.teeth_cleaning_method} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange}/>
    </SectionWrapper>
);

export const Plan = ({ data, onChange, onTranscription, onStatusChange }) => (
    <SectionWrapper title="Conclusion">
        <Input id="doctors_name" label="Doctor's Name:" value={data.doctors_name} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange} />
        <Textarea id="treatment_plan" rows="4" label="Treatment Plan:" value={data.treatment_plan} onChange={onChange} onTranscription={onTranscription} onStatusChange={onStatusChange} />
    </SectionWrapper>
);

