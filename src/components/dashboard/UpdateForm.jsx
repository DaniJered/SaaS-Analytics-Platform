import React, { useState } from 'react';
import { addKPIMetric } from '../../utils/api';

export default function UpdateForm({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        Month: '',
        MRR: '',
        ARR: '',
        ChurnRate: '',
        NRR: '',
        CAC: '',
        LTV: '',
        Subscribers: '',
        NewCustomers: '',
        ChurnedCustomers: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const dataToSubmit = {
                Month: formData.Month,
                MRR: Number(formData.MRR),
                ARR: Number(formData.ARR),
                ChurnRate: Number(formData.ChurnRate),
                NRR: Number(formData.NRR),
                CAC: Number(formData.CAC),
                LTV: Number(formData.LTV),
                Subscribers: Number(formData.Subscribers),
                NewCustomers: Number(formData.NewCustomers),
                ChurnedCustomers: Number(formData.ChurnedCustomers),
            };
            await addKPIMetric(dataToSubmit);
            onSuccess();
            onClose();
            // Reset form fields
            setFormData({
                Month: '', MRR: '', ARR: '', ChurnRate: '', NRR: '',
                CAC: '', LTV: '', Subscribers: '', NewCustomers: '', ChurnedCustomers: ''
            });
        } catch (error) {
            console.error("Failed to add metrics:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputFields = [
        { name: 'Month', type: 'month', label: 'Month', required: true },
        { name: 'MRR', type: 'number', label: 'MRR ($)' },
        { name: 'ARR', type: 'number', label: 'ARR ($)' },
        { name: 'ChurnRate', type: 'number', label: 'Churn Rate (%)', step: '0.1' },
        { name: 'NRR', type: 'number', label: 'NRR (%)' },
        { name: 'CAC', type: 'number', label: 'CAC ($)' },
        { name: 'LTV', type: 'number', label: 'LTV ($)' },
        { name: 'Subscribers', type: 'number', label: 'Active Subscribers' },
        { name: 'NewCustomers', type: 'number', label: 'New Customers' },
        { name: 'ChurnedCustomers', type: 'number', label: 'Churned Customers' }
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" data-name="update-form">
            <div className="bg-[var(--surface-color)] border border-[var(--border-color)] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <div className="icon-plus-circle text-[var(--primary-color)]"></div>
                        Update Metrics
                    </h2>
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                        <div className="icon-x w-6 h-6"></div>
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <form id="metrics-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {inputFields.map((field) => (
                            <div key={field.name} className="flex flex-col gap-1.5 text-left">
                                <label htmlFor={field.name} className="text-sm font-medium text-[var(--text-muted)]">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    type={field.type}
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    required={field.required}
                                    step={field.step || 'any'}
                                    className="input-field"
                                    placeholder={`Enter ${field.label}`}
                                />
                            </div>
                        ))}
                    </form>
                </div>

                <div className="p-6 border-t border-[var(--border-color)] bg-[var(--surface-color)] flex justify-end gap-3 shrink-0 rounded-b-xl">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="btn bg-transparent border border-[var(--border-color)] hover:bg-[var(--bg-color)]"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        form="metrics-form"
                        disabled={isSubmitting}
                        className="btn btn-primary flex items-center gap-2 min-w-[120px] justify-center disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="icon-loader animate-spin w-4 h-4"></div>
                        ) : (
                            <div className="icon-save w-4 h-4"></div>
                        )}
                        {isSubmitting ? 'Saving...' : 'Save Metrics'}
                    </button>
                </div>
            </div>
        </div>
    );
}
