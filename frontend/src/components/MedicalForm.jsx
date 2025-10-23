import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { EventDetails, PatientDemographics, MedicalHistory, Habits, ClinicalExam, GingivaOralHealth, Plan } from './FormSections.jsx';

const getInitialState = () => ({
    organised_by: '', department: '', event_date: '', event_place: '', event_district: '',
    patient_name: '', patient_age: '', patient_contact: '', patient_education: '', gender: '', family_monthly_income: '',
    chief_complaint: '', diabetes: '', hypertension: '', thyroid: '', cardio: '', respiratory: '', bleeding: '',
    past_medical_history_others: '', past_dental_visit_details: '',
    smoking: '', alcohol: '', tobacco: '', personal_habits_others: '',
    clinical_decayed: '', clinical_missing: '', clinical_filled: '', clinical_pain: '', clinical_fractured_teeth: '', clinical_mobility: '', clinical_examination_others: '',
    calculus: '', stains: '', fluorosis: '', malocclusion: '', gingivitis: '', periodontitis: '', oral_mucosal_lesion: '', teeth_cleaning_method: '',
    doctors_name: '', treatment_plan: ''
});

const FIXED_FIELDS = ["organised_by", "department", "event_date", "event_place", "event_district"];

const MedicalForm = forwardRef(({ onStatusChange }, ref) => {
    const [formData, setFormData] = useState(getInitialState());

    // Load fixed fields from localStorage on mount
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("fixedFields"));
        if (saved) setFormData(prev => ({ ...prev, ...saved }));
    }, []);

    // Save fixed fields to localStorage whenever they change
    useEffect(() => {
        const fixedData = {};
        FIXED_FIELDS.forEach(key => {
            fixedData[key] = formData[key];
        });
        localStorage.setItem("fixedFields", JSON.stringify(fixedData));
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, type, id } = e.target;
        const key = type === 'radio' ? name : id;
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleTranscription = (fieldId, text) => {
        setFormData(prev => ({ ...prev, [fieldId]: text }));
    };

    useImperativeHandle(ref, () => ({
        fillForm: (apiData) => setFormData(prev => ({ ...prev, ...apiData })),
        resetForm: () => {
            const initial = getInitialState();
            const saved = JSON.parse(localStorage.getItem("fixedFields")) || {};
            setFormData({ ...initial, ...saved }); // reset others but keep fixed
        },
        startNewDay: () => {
            localStorage.removeItem("fixedFields"); // remove fixed field cache
            setFormData(getInitialState());
        },
        getFormData: () => ({ ...formData })
    }));

    return (
        <form id="medical-form" className="space-y-6 pt-6">
            <EventDetails data={formData} onChange={handleChange} onTranscription={handleTranscription} onStatusChange={onStatusChange} />
            <PatientDemographics data={formData} onChange={handleChange} onTranscription={handleTranscription} onStatusChange={onStatusChange} />
            <MedicalHistory data={formData} onChange={handleChange} onTranscription={handleTranscription} onStatusChange={onStatusChange} />
            <Habits data={formData} onChange={handleChange} onTranscription={handleTranscription} onStatusChange={onStatusChange} />
            <ClinicalExam data={formData} onChange={handleChange} onTranscription={handleTranscription} onStatusChange={onStatusChange} />
            <GingivaOralHealth data={formData} onChange={handleChange} onTranscription={handleTranscription} onStatusChange={onStatusChange} />
            <Plan data={formData} onChange={handleChange} onTranscription={handleTranscription} onStatusChange={onStatusChange} />
        </form>
    );
});

export default MedicalForm;