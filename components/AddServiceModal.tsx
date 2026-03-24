'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (service: { name: string; description: string; category: string; price: number; duration: string }) => void;
}

const categories = ['Consultation', 'Laboratory', 'Dental', 'Pediatrics', 'Surgery', 'Pharmacy', 'Radiology', 'Physiotherapy'];

export default function AddServiceModal({ isOpen, onClose, onAdd }: AddServiceModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name || !category || !price) return;
    onAdd({ name, description, category, price: parseFloat(price), duration });
    setName(''); setDescription(''); setCategory(''); setPrice(''); setDuration('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ alignItems: 'flex-start', paddingTop: '8vh' }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>Add New Service</h2>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>Fill in the service details below</p>
          </div>
          <button onClick={onClose}
            style={{ background: '#F1F5F9', border: 'none', cursor: 'pointer', color: '#64748B', padding: '8px', borderRadius: '10px', display: 'flex', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#E2E8F0'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F1F5F9'; }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Service Name</label>
            <input className="input" placeholder="e.g., X-Ray Scan" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Description</label>
            <textarea className="input" placeholder="Brief description of the service" value={description} onChange={(e) => setDescription(e.target.value)}
              style={{ minHeight: '90px', resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Category</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} style={{ cursor: 'pointer' }}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Price (₦)</label>
              <input className="input" type="number" placeholder="5000" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Duration</label>
              <input className="input" placeholder="30 mins" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button className="btn-green" onClick={handleSubmit}
              style={{ flex: 1, borderRadius: '14px', padding: '16px', fontSize: '15px' }}>
              Add Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
