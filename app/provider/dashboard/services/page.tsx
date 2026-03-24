'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ServiceCard from '@/components/ServiceCard';
import AddServiceModal from '@/components/AddServiceModal';
import type { Service } from '@/lib/types';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [providerId, setProviderId] = useState('');

  const fetchData = useCallback(async (pid: string) => {
    const { data } = await supabase.from('services').select('*').eq('provider_id', pid);
    if (data) setServices(data);
  }, []);

  useEffect(() => {
    const id = localStorage.getItem('providerId');
    if (id) { setProviderId(id); fetchData(id); }
  }, [fetchData]);

  const handleAddService = async (serviceData: { name: string; description: string; category: string; price: number; duration: string }) => {
    await supabase.from('services').insert({ ...serviceData, provider_id: providerId });
    fetchData(providerId);
  };

  const handleDeleteService = async (serviceId: string) => {
    await supabase.from('services').delete().eq('id', serviceId);
    setServices(services.filter(s => s.id !== serviceId));
  };

  const demoServices: Service[] = [
    { id: 's1', provider_id: '', name: 'General Consultation', description: 'Standard consultation with general practitioner for routine healthcare check-ups and diagnosis.', category: 'Consultation', price: 5000, duration: '30 mins', created_at: '' },
    { id: 's2', provider_id: '', name: 'Laboratory Tests', description: 'Complete blood count, urinalysis, basic metabolic panel, and comprehensive lab work.', category: 'Laboratory', price: 12000, duration: '1 hour', created_at: '' },
    { id: 's3', provider_id: '', name: 'Dental Check-up', description: 'Comprehensive dental examination, cleaning, and oral health assessment.', category: 'Dental', price: 8000, duration: '45 mins', created_at: '' },
    { id: 's4', provider_id: '', name: 'Pediatrics Consultation', description: 'Child healthcare consultation, vaccination assessment, and growth tracking.', category: 'Consultation', price: 6500, duration: '30 mins', created_at: '' },
    { id: 's5', provider_id: '', name: 'X-Ray Scan', description: 'Full body or specific area X-ray imaging and diagnostic radiology services.', category: 'Radiology', price: 15000, duration: '30 mins', created_at: '' },
    { id: 's6', provider_id: '', name: 'Pharmacy Consultations', description: 'Medication review, drug interaction checks, and prescription counseling.', category: 'Pharmacy', price: 3000, duration: '20 mins', created_at: '' },
  ];

  const displayServices = services.length > 0 ? services : demoServices;
  const filtered = displayServices.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{
          flex: 1, minWidth: '240px', display: 'flex', alignItems: 'center', gap: '10px',
          padding: '0 16px', background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '12px',
        }}>
          <Search size={16} color="#94A3B8" />
          <input placeholder="Search services..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', flex: 1, padding: '12px 0', fontFamily: 'var(--font-sans)', fontSize: '14px', background: 'transparent' }} />
        </div>
        <button className="btn-green" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Services count */}
      <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px', fontWeight: 500 }}>
        Showing {filtered.length} service{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {filtered.map(s => (
          <ServiceCard key={s.id} name={s.name} category={s.category}
            description={s.description} duration={s.duration} price={s.price}
            onDelete={() => handleDeleteService(s.id)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
          <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>No services found</p>
          <p style={{ fontSize: '14px' }}>Try adjusting your search or add a new service.</p>
        </div>
      )}

      <AddServiceModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddService} />
    </div>
  );
}
