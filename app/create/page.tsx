'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Button } from '@/components/ui/Button';
import { UserRestrictionsBanner } from '@/components/UserRestrictionsBanner';
import { ChatButton } from '@/components/ChatButton';
import { RegistrationQuestion } from '@/types/event';
import { eventsApi } from '@/lib/api';
import { sanitizeInput, validateLength, validatePrice, validateDate, validateEmail } from '@/lib/security';

export default function CreateEventPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    organization: 'GrowthLab Events',
    eventName: '',
    visibility: 'public',
    startDate: '',
    startTime: '12:00 PM',
    endDate: '',
    endTime: '01:00 PM',
    timezone: 'GMT+08:00',
    location: '',
    locationType: 'physical' as 'physical' | 'online' | 'hybrid',
    description: '',
    theme: 'Minimal',
    color: 'Barney',
    style: 'default',
    font: 'Geist Mono',
    display: 'Auto',
    ticketType: 'free',
    ticketPrice: 0,
    requireApproval: false,
    capacity: 'unlimited',
    capacityLimit: 0,
    imageMode: 'theme' as 'theme' | 'upload', // New: theme or custom upload
    uploadedImage: null as File | null, // New: uploaded image file
    imagePreview: null as string | null, // New: preview URL for uploaded image
  });

  const themes = [
    { id: 'minimal', name: 'Minimal', preview: 'minimal' },
    { id: 'quantum', name: 'Quantum', preview: 'quantum' },
    { id: 'warp', name: 'Warp', preview: 'warp' },
    { id: 'emoji', name: 'Emoji', preview: 'emoji' },
    { id: 'confetti', name: 'Confetti', preview: 'confetti' },
    { id: 'pattern', name: 'Pattern', preview: 'pattern' },
    { id: 'seasonal', name: 'Seasonal', preview: 'seasonal' },
  ];

  const colors = [
    { id: 'barney', name: 'Barney', value: '#8B5CF6' },
    { id: 'teal', name: 'Teal', value: '#0F7377' },
    { id: 'amber', name: 'Amber', value: '#F59E0B' },
    { id: 'pink', name: 'Pink', value: '#EC4899' },
    { id: 'blue', name: 'Blue', value: '#3B82F6' },
  ];

  const [registrationQuestions, setRegistrationQuestions] = useState<RegistrationQuestion[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<RegistrationQuestion | null>(null);
  
  // Modal states
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  
  // Ticket modal state
  const [ticketPriceType, setTicketPriceType] = useState<'fixed' | 'flexible'>('fixed');
  const [ticketCurrency, setTicketCurrency] = useState('SGD');
  const [tempTicketPrice, setTempTicketPrice] = useState(0);
  
  // Capacity modal state
  const [tempCapacity, setTempCapacity] = useState(50);
  const [waitingListEnabled, setWaitingListEnabled] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionForm(true);
  };

  const handleSaveQuestion = (question: RegistrationQuestion) => {
    if (editingQuestion) {
      setRegistrationQuestions(prev =>
        prev.map(q => q.id === editingQuestion.id ? question : q)
      );
    } else {
      setRegistrationQuestions(prev => [...prev, question]);
    }
    setShowQuestionForm(false);
    setEditingQuestion(null);
  };

  const handleEditQuestion = (question: RegistrationQuestion) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  const handleDeleteQuestion = (id: string) => {
    setRegistrationQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security validation
    if (!validateLength(formData.eventName, 1, 200)) {
      alert('Event name must be between 1 and 200 characters.');
      return;
    }
    
    if (formData.description && !validateLength(formData.description, 0, 10000)) {
      alert('Description is too long. Maximum 10,000 characters.');
      return;
    }
    
    if (formData.ticketType === 'paid' && !validatePrice(formData.ticketPrice)) {
      alert('Invalid ticket price. Must be between 0 and 1,000,000.');
      return;
    }
    
    if (formData.capacity === 'limited' && (formData.capacityLimit < 1 || formData.capacityLimit > 100000)) {
      alert('Capacity must be between 1 and 100,000.');
      return;
    }
    
    if (formData.startDate && !validateDate(formData.startDate)) {
      alert('Invalid start date.');
      return;
    }
    
    if (formData.endDate && !validateDate(formData.endDate)) {
      alert('Invalid end date.');
      return;
    }
    
    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(formData.eventName);
    const sanitizedDescription = formData.description ? sanitizeInput(formData.description) : '';
    const sanitizedLocation = formData.location ? sanitizeInput(formData.location) : '';
    
    try {
      const response = await eventsApi.createEvent({
        title: sanitizedTitle,
        description: sanitizedDescription,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        startTime: formData.startTime,
        endDate: formData.endDate || formData.startDate || new Date().toISOString().split('T')[0],
        endTime: formData.endTime,
        location: sanitizedLocation,
        locationType: formData.locationType,
        visibility: formData.visibility as 'public' | 'private',
        ticketType: formData.ticketType as 'free' | 'paid',
        ticketPrice: formData.ticketPrice,
        requireApproval: formData.requireApproval,
        capacity: formData.capacity as 'unlimited' | 'limited',
        capacityLimit: formData.capacity === 'limited' ? formData.capacityLimit : undefined,
        theme: formData.theme,
        color: formData.color,
        style: formData.style,
        font: formData.font,
        display: formData.display,
        imageMode: formData.imageMode,
        uploadedImage: formData.uploadedImage,
        imagePreview: formData.imagePreview,
        registrationQuestions: registrationQuestions.map(q => ({
          type: q.type,
          label: sanitizeInput(q.label),
          placeholder: q.placeholder ? sanitizeInput(q.placeholder) : undefined,
          required: q.required,
          options: q.options?.map(opt => sanitizeInput(opt)),
          validation: q.validation,
        })),
      });
      
      if (response.success) {
        router.push('/events');
      } else {
        console.error('Failed to create event:', response.message);
        alert('Failed to create event. Please try again.');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('An error occurred while creating the event. Please try again.');
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const defaultStartDate = today;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          {/* User Restrictions Banner */}
          <UserRestrictionsBanner userId="current-user" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
            {/* Left Column - Visual/Theme Selection */}
            <div className="space-y-4 sm:space-y-6">
                  {/* Visual Preview Card */}
                  <div className="bg-slate-800 rounded-xl p-4 sm:p-8 aspect-square flex items-center justify-center border border-slate-700 relative group shadow-lg">
                <div className="grid grid-cols-2 gap-4 w-full h-full">
                  {/* Top Left: Cluster of cylinders */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-green-600/30 rounded-lg blur-xl"></div>
                    <div className="relative flex items-center justify-center gap-1">
                      <div className="w-8 h-16 bg-gradient-to-b from-green-300 to-green-500 rounded-full transform rotate-12 shadow-lg"></div>
                      <div className="w-8 h-16 bg-gradient-to-b from-green-400 to-green-600 rounded-full shadow-lg"></div>
                      <div className="w-8 h-16 bg-gradient-to-b from-green-500 to-green-700 rounded-full transform -rotate-12 shadow-lg"></div>
                    </div>
                  </div>
                  
                  {/* Top Right: Curved band */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-purple-600/30 rounded-lg blur-xl"></div>
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 border-8 border-purple-400 rounded-full transform rotate-45 shadow-lg"></div>
                      <div className="absolute inset-2 border-4 border-purple-300 rounded-full transform -rotate-45"></div>
                    </div>
                  </div>
                  
                  {/* Bottom Left: Arrow */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400/30 to-teal-600/30 rounded-lg blur-xl"></div>
                    <div className="relative">
                      <svg className="w-16 h-16 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 12h6v8h8v-8h6L12 2z" opacity="0.8" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Bottom Right: Organic folded shape */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400/30 to-purple-600/30 rounded-lg blur-xl"></div>
                    <div className="relative w-20 h-20">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg transform rotate-12 shadow-lg"></div>
                      <div className="absolute inset-2 bg-gradient-to-br from-purple-300 to-pink-500 rounded-lg transform -rotate-6"></div>
                      <div className="absolute inset-4 bg-gradient-to-br from-pink-200 to-purple-400 rounded-lg transform rotate-3"></div>
                    </div>
                  </div>
                </div>
                
                {/* Image Preview or Theme Preview */}
                {formData.imageMode === 'upload' && formData.imagePreview ? (
                  <img 
                    src={formData.imagePreview} 
                    alt="Event poster preview" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-4 w-full h-full">
                    {/* Top Left: Cluster of cylinders */}
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-green-600/30 rounded-lg blur-xl"></div>
                      <div className="relative flex items-center justify-center gap-1">
                        <div className="w-8 h-16 bg-gradient-to-b from-green-300 to-green-500 rounded-full transform rotate-12 shadow-lg"></div>
                        <div className="w-8 h-16 bg-gradient-to-b from-green-400 to-green-600 rounded-full shadow-lg"></div>
                        <div className="w-8 h-16 bg-gradient-to-b from-green-500 to-green-700 rounded-full transform -rotate-12 shadow-lg"></div>
                      </div>
                    </div>
                    
                    {/* Top Right: Curved band */}
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-purple-600/30 rounded-lg blur-xl"></div>
                      <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-8 border-purple-400 rounded-full transform rotate-45 shadow-lg"></div>
                        <div className="absolute inset-2 border-4 border-purple-300 rounded-full transform -rotate-45"></div>
                      </div>
                    </div>
                    
                    {/* Bottom Left: Arrow */}
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-400/30 to-teal-600/30 rounded-lg blur-xl"></div>
                      <div className="relative">
                        <svg className="w-16 h-16 text-teal-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 12h6v8h8v-8h6L12 2z" opacity="0.8" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Bottom Right: Organic folded shape */}
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-400/30 to-purple-600/30 rounded-lg blur-xl"></div>
                      <div className="relative w-20 h-20">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg transform rotate-12 shadow-lg"></div>
                        <div className="absolute inset-2 bg-gradient-to-br from-purple-300 to-pink-500 rounded-lg transform -rotate-6"></div>
                        <div className="absolute inset-4 bg-gradient-to-br from-pink-200 to-purple-400 rounded-lg transform rotate-3"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Mode Toggle and Upload Button */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  {/* Toggle between theme and upload */}
                  <div className="flex items-center gap-1 bg-slate-800/90 backdrop-blur-sm rounded-full p-1 border border-slate-600">
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('imageMode', 'theme');
                        handleInputChange('uploadedImage', null);
                        handleInputChange('imagePreview', null);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        formData.imageMode === 'theme'
                          ? 'bg-white text-slate-900'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Theme
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('imageMode', 'upload')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        formData.imageMode === 'upload'
                          ? 'bg-white text-slate-900'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Upload
                    </button>
                  </div>
                  
                  {/* Upload Button */}
                  {formData.imageMode === 'upload' && (
                    <label className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center border border-slate-600 cursor-pointer transition-all shadow-lg">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Validate file size (max 10MB)
                            if (file.size > 10 * 1024 * 1024) {
                              alert('Image size must be less than 10MB');
                              return;
                            }
                            // Validate file type
                            if (!file.type.startsWith('image/')) {
                              alert('Please upload an image file');
                              return;
                            }
                            handleInputChange('uploadedImage', file);
                            // Create preview URL
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              handleInputChange('imagePreview', reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </label>
                  )}
                  
                  {/* Remove uploaded image button */}
                  {formData.imageMode === 'upload' && formData.imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        handleInputChange('uploadedImage', null);
                        handleInputChange('imagePreview', null);
                      }}
                      className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center border border-red-700 transition-all shadow-lg"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Theme Selector - Compact */}
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-400">Theme</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="text-slate-400 hover:text-white"
                      onClick={() => {
                        const currentIndex = themes.findIndex(t => t.id === formData.theme.toLowerCase());
                        const prevIndex = currentIndex > 0 ? currentIndex - 1 : themes.length - 1;
                        handleInputChange('theme', themes[prevIndex].name);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-white"
                      onClick={() => {
                        const currentIndex = themes.findIndex(t => t.id === formData.theme.toLowerCase());
                        const nextIndex = (currentIndex + 1) % themes.length;
                        handleInputChange('theme', themes[nextIndex].name);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-red-400 ml-2"
                      onClick={() => handleInputChange('theme', 'Minimal')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center border-2 border-white">
                    <div className="w-full h-0.5 bg-slate-800 mb-1"></div>
                    <div className="w-full h-0.5 bg-slate-800 mb-1"></div>
                    <div className="w-full h-0.5 bg-slate-800"></div>
                  </div>
                  <span className="text-white font-medium text-sm">{formData.theme}</span>
                </div>
              </div>
            </div>

                {/* Right Column - Event Creation Form */}
                <div className="bg-slate-800 rounded-xl p-5 sm:p-6 lg:p-8 border border-slate-700 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Organization Dropdown */}
                <div>
                  <select
                    value={formData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="GrowthLab Events">GrowthLab Events</option>
                    <option value="My Events">My Events</option>
                  </select>
                </div>

                {/* Event Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Event Name"
                    value={formData.eventName}
                    onChange={(e) => handleInputChange('eventName', e.target.value)}
                    className="w-full bg-transparent border-none text-3xl font-bold text-white placeholder-slate-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Visibility */}
                <div className="flex justify-end">
                  <select
                    value={formData.visibility}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                {/* Date and Time */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Start Date/Time */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-teal-500 flex-shrink-0"></div>
                    <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-4">
                      <div className="relative">
                        <div className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white pointer-events-none">
                          {formData.startDate || defaultStartDate ? (
                            new Date(formData.startDate || defaultStartDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })
                          ) : (
                            <span className="text-slate-400">Select date</span>
                          )}
                        </div>
                        <input
                          type="date"
                          value={formData.startDate || defaultStartDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          required
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        placeholder="12:00 PM"
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>

                  {/* End Date/Time */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500 flex-shrink-0"></div>
                    <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-4">
                      <div className="relative">
                        <div className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white pointer-events-none">
                          {formData.endDate || formData.startDate || defaultStartDate ? (
                            new Date(formData.endDate || formData.startDate || defaultStartDate).toLocaleDateString('en-US', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })
                          ) : (
                            <span className="text-slate-400">Select date</span>
                          )}
                        </div>
                        <input
                          type="date"
                          value={formData.endDate || formData.startDate || defaultStartDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          required
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        placeholder="01:00 PM"
                        className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Timezone */}
                  <div className="flex justify-end">
                    <div className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white">
                      {formData.timezone} • Singapore
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowLocationModal(true)}
                    className="w-full flex items-center gap-2 p-4 bg-slate-700 border border-slate-600 rounded-lg hover:border-slate-500 transition-colors text-left"
                  >
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-300 mb-1">Add Event Location</div>
                      <div className="text-xs text-slate-400">
                        {formData.location || 'Offline location or virtual link'}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Description */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowDescriptionModal(true)}
                    className="w-full flex items-center gap-2 p-4 bg-slate-700 border border-slate-600 rounded-lg hover:border-slate-500 transition-colors text-left"
                  >
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-slate-400">
                      {formData.description || 'Add Description'}
                    </span>
                  </button>
                </div>

                {/* Tickets */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <span className="text-white font-medium">Tickets</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <span className="text-slate-300">
                        {formData.ticketType === 'free' ? 'Free' : `${ticketCurrency} ${formData.ticketPrice}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.ticketType === 'free') {
                            setTempTicketPrice(formData.ticketPrice || 0);
                            setShowTicketModal(true);
                          } else {
                            handleInputChange('ticketType', 'free');
                            handleInputChange('ticketPrice', 0);
                          }
                        }}
                        className="text-slate-400 hover:text-white"
                      >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Require Approval */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-white font-medium">Require Approval</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('requireApproval', !formData.requireApproval)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.requireApproval ? 'bg-teal-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.requireApproval ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Capacity */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-white font-medium">Capacity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300">
                      {formData.capacity === 'unlimited' ? 'Unlimited' : formData.capacityLimit}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.capacity === 'unlimited') {
                          setTempCapacity(formData.capacityLimit || 50);
                          setShowCapacityModal(true);
                        } else {
                          handleInputChange('capacity', 'unlimited');
                          handleInputChange('capacityLimit', 0);
                        }
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Registration Questions Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Registration Questions</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddQuestion}
                      className="border-teal-500 text-teal-500 hover:bg-teal-500/10"
                    >
                      + Add Question
                    </Button>
                  </div>

                  {registrationQuestions.length > 0 && (
                    <div className="space-y-3">
                      {registrationQuestions.map((question) => (
                        <div
                          key={question.id}
                          className="bg-slate-700 rounded-lg p-4 border border-slate-600"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-medium">{question.label}</span>
                                {question.required && (
                                  <span className="text-red-400 text-xs">*</span>
                                )}
                                <span className="text-slate-400 text-xs">
                                  ({question.type})
                                </span>
                              </div>
                              {question.placeholder && (
                                <p className="text-slate-400 text-sm">{question.placeholder}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditQuestion(question)}
                                className="text-slate-400 hover:text-teal-400"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="text-slate-400 hover:text-red-400"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {registrationQuestions.length === 0 && (
                    <p className="text-slate-400 text-sm">
                      Add custom questions to curate who can attend your event.
                    </p>
                  )}
                </div>

                {/* Question Form Modal */}
                {showQuestionForm && (
                  <QuestionFormModal
                    question={editingQuestion}
                    onSave={handleSaveQuestion}
                    onCancel={() => {
                      setShowQuestionForm(false);
                      setEditingQuestion(null);
                    }}
                  />
                )}

                {/* Ticket Price Modal */}
                {showTicketModal && (
                  <TicketPriceModal
                    priceType={ticketPriceType}
                    price={tempTicketPrice}
                    currency={ticketCurrency}
                    onPriceTypeChange={setTicketPriceType}
                    onPriceChange={setTempTicketPrice}
                    onCurrencyChange={setTicketCurrency}
                    onSetPrice={() => {
                      handleInputChange('ticketType', 'paid');
                      handleInputChange('ticketPrice', tempTicketPrice);
                      setShowTicketModal(false);
                    }}
                    onSetFree={() => {
                      handleInputChange('ticketType', 'free');
                      handleInputChange('ticketPrice', 0);
                      setShowTicketModal(false);
                    }}
                    onClose={() => setShowTicketModal(false)}
                  />
                )}

                {/* Capacity Modal */}
                {showCapacityModal && (
                  <CapacityModal
                    capacity={tempCapacity}
                    waitingList={waitingListEnabled}
                    onCapacityChange={setTempCapacity}
                    onWaitingListChange={setWaitingListEnabled}
                    onSetLimit={() => {
                      handleInputChange('capacity', 'limited');
                      handleInputChange('capacityLimit', tempCapacity);
                      setShowCapacityModal(false);
                    }}
                    onRemoveLimit={() => {
                      handleInputChange('capacity', 'unlimited');
                      handleInputChange('capacityLimit', 0);
                      setShowCapacityModal(false);
                    }}
                    onClose={() => setShowCapacityModal(false)}
                  />
                )}

                {/* Description Modal */}
                {showDescriptionModal && (
                  <DescriptionModal
                    description={formData.description}
                    onDescriptionChange={(desc) => handleInputChange('description', desc)}
                    onDone={() => setShowDescriptionModal(false)}
                    onClose={() => setShowDescriptionModal(false)}
                  />
                )}

                {/* Location Modal */}
                {showLocationModal && (
                  <LocationModal
                    location={formData.location}
                    onLocationChange={(loc) => handleInputChange('location', loc)}
                    onClose={() => setShowLocationModal(false)}
                  />
                )}

                {/* Create Event Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold"
                >
                  Create Event
                </Button>
              </form>

              {/* Theme Customization Section */}
              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                {/* Theme Thumbnails - Horizontal Scrollable */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-slate-400 mb-3">Themes</h3>
                  <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => handleInputChange('theme', theme.name)}
                        className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 transition-all duration-200 ${
                          formData.theme === theme.name
                            ? 'border-white shadow-lg scale-105'
                            : 'border-slate-600 hover:border-slate-500 hover:scale-102'
                        }`}
                      >
                        <ThemePreview theme={theme.id} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customization Options */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Colour */}
                  <div className="bg-slate-800 rounded-lg p-2 sm:p-3 border border-slate-700">
                    <label className="text-xs font-medium text-slate-400 mb-1.5 sm:mb-2 block">Colour</label>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white flex-shrink-0"
                        style={{ backgroundColor: colors.find(c => c.name === formData.color)?.value || '#8B5CF6' }}
                      ></div>
                      <select
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className="flex-1 bg-transparent text-white text-xs sm:text-sm focus:outline-none min-w-0"
                      >
                        {colors.map((color) => (
                          <option key={color.id} value={color.name} className="bg-slate-800">
                            {color.name}
                          </option>
                        ))}
                      </select>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Style */}
                  <div className="bg-slate-800 rounded-lg p-2 sm:p-3 border border-slate-700">
                    <label className="text-xs font-medium text-slate-400 mb-1.5 sm:mb-2 block">Style</label>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs sm:text-sm truncate">{formData.style}</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Font */}
                  <div className="bg-slate-800 rounded-lg p-2 sm:p-3 border border-slate-700">
                    <label className="text-xs font-medium text-slate-400 mb-1.5 sm:mb-2 block">Ag Font</label>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs sm:text-sm truncate">{formData.font}</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Display */}
                  <div className="bg-slate-800 rounded-lg p-2 sm:p-3 border border-slate-700">
                    <label className="text-xs font-medium text-slate-400 mb-1.5 sm:mb-2 block">Display</label>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs sm:text-sm truncate">{formData.display}</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Chat Button */}
      <ChatButton />
    </div>
  );
}

// Theme Preview Component
function ThemePreview({ theme }: { theme: string }) {
  switch (theme) {
    case 'minimal':
      return (
        <div className="w-full h-full bg-white rounded-lg flex flex-col items-center justify-center p-2">
          <div className="w-full h-0.5 bg-slate-800 mb-1"></div>
          <div className="w-full h-0.5 bg-slate-800 mb-1"></div>
          <div className="w-full h-0.5 bg-slate-800"></div>
        </div>
      );
    case 'quantum':
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <div className="w-full h-2 bg-blue-300 mb-1"></div>
          <div className="w-full h-2 bg-purple-400"></div>
        </div>
      );
    case 'warp':
      return (
        <div className="w-full h-full bg-gradient-to-br from-purple-900 to-black rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent transform -rotate-45"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-purple-400/20 to-transparent transform rotate-45"></div>
        </div>
      );
    case 'emoji':
      return (
        <div className="w-full h-full bg-yellow-400 rounded-lg flex items-center justify-center">
          <span className="text-4xl">😎</span>
        </div>
      );
    case 'confetti':
      return (
        <div className="w-full h-full bg-purple-600 rounded-lg relative overflow-hidden">
          <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-4 right-3 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute bottom-3 left-4 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      );
    case 'pattern':
      return (
        <div className="w-full h-full bg-purple-600 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 40 40">
              <path d="M0 20 Q 10 10, 20 20 T 40 20" stroke="white" strokeWidth="2" fill="none" />
              <path d="M0 20 Q 10 30, 20 20 T 40 20" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      );
    case 'seasonal':
      return (
        <div className="w-full h-full bg-amber-800 rounded-lg flex items-center justify-center">
          <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
      );
    default:
      return <div className="w-full h-full bg-slate-700 rounded-lg"></div>;
  }
}

// Ticket Price Modal
function TicketPriceModal({
  priceType,
  price,
  currency,
  onPriceTypeChange,
  onPriceChange,
  onCurrencyChange,
  onSetPrice,
  onSetFree,
  onClose,
}: {
  priceType: 'fixed' | 'flexible';
  price: number;
  currency: string;
  onPriceTypeChange: (type: 'fixed' | 'flexible') => void;
  onPriceChange: (price: number) => void;
  onCurrencyChange: (currency: string) => void;
  onSetPrice: () => void;
  onSetFree: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-lg p-4 sm:p-6 max-w-md w-full border border-slate-700 my-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg sm:text-xl font-bold text-white">$!</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">Set Ticket Price</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Ticket Type Selection */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onPriceTypeChange('fixed')}
              className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                priceType === 'fixed'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Fixed Price
            </button>
            <button
              type="button"
              onClick={() => onPriceTypeChange('flexible')}
              className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                priceType === 'flexible'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Flexible
            </button>
          </div>

          {/* Price Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Ticket Price</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={price}
                onChange={(e) => onPriceChange(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
              />
              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
              >
                <option value="SGD">SGD</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4">
            <button
              type="button"
              onClick={onSetFree}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02]"
            >
              Set Event Free
            </button>
            <button
              type="button"
              onClick={onSetPrice}
              className="flex-1 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02]"
            >
              Set Ticket Price
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Capacity Modal
function CapacityModal({
  capacity,
  waitingList,
  onCapacityChange,
  onWaitingListChange,
  onSetLimit,
  onRemoveLimit,
  onClose,
}: {
  capacity: number;
  waitingList: boolean;
  onCapacityChange: (capacity: number) => void;
  onWaitingListChange: (enabled: boolean) => void;
  onSetLimit: () => void;
  onRemoveLimit: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-lg p-4 sm:p-6 max-w-md w-full border border-slate-700 my-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">Max Capacity</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Auto-close registration when the capacity is reached. Only approved guests count towards the cap.
          </p>

          {/* Capacity Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => onCapacityChange(parseInt(e.target.value) || 0)}
              min="1"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Waiting List Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg border border-slate-600">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Over-Capacity Waiting List</label>
              <p className="text-xs text-slate-400">Allow guests to join a waiting list when capacity is reached</p>
            </div>
            <button
              type="button"
              onClick={() => onWaitingListChange(!waitingList)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                waitingList ? 'bg-teal-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  waitingList ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4">
            <button
              type="button"
              onClick={onRemoveLimit}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02]"
            >
              Remove Limit
            </button>
            <button
              type="button"
              onClick={onSetLimit}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02]"
            >
              Set Limit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Description Modal
function DescriptionModal({
  description,
  onDescriptionChange,
  onDone,
  onClose,
}: {
  description: string;
  onDescriptionChange: (desc: string) => void;
  onDone: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-lg p-4 sm:p-6 max-w-2xl w-full border border-slate-700 max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white">Event Description</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="+ Who should come? What's the event about?"
            rows={8}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                // TODO: Implement AI suggestion
                console.log('Suggest with AI');
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Suggest with AI
            </button>
            <button
              type="button"
              onClick={onDone}
              className="px-4 sm:px-6 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] text-sm sm:text-base"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Location Modal
function LocationModal({
  location,
  onLocationChange,
  onClose,
}: {
  location: string;
  onLocationChange: (loc: string) => void;
  onClose: () => void;
}) {
  const [inputValue, setInputValue] = useState(location);
  const [showRecent, setShowRecent] = useState(true);

  const recentLocations = [
    { name: 'Skysuites @ Anson', address: 'Enggor St, 8, Singapore 079718' },
    { name: 'Alpha Vitality', address: '1557 Keppel Rd, #01-01, Singapore 089066' },
    { name: 'Siloso Beach', address: '10A Siloso Bch Walk, Singapore 099008' },
  ];

  const handleLocationSelect = (loc: string) => {
    setInputValue(loc);
    onLocationChange(loc);
    setShowRecent(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-lg p-4 sm:p-6 max-w-2xl w-full border border-slate-700 max-h-[90vh] overflow-y-auto my-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-white">Add Event Location</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Enter location or virtual link
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowRecent(e.target.value === '');
              }}
              onBlur={() => onLocationChange(inputValue)}
              placeholder="Offline location or virtual link"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 sm:px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base"
            />
          </div>

          {showRecent && (
            <>
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2 sm:mb-3">Recent Locations</h4>
                <div className="space-y-2">
                  {recentLocations.map((loc, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleLocationSelect(loc.name + ', ' + loc.address)}
                      className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition-all duration-200 hover:border-teal-500/50"
                    >
                      <div className="font-medium text-white text-sm sm:text-base">{loc.name}</div>
                      <div className="text-xs sm:text-sm text-slate-400 mt-0.5">{loc.address}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2 sm:mb-3">Virtual Options</h4>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleLocationSelect('Zoom Meeting')}
                    className="w-full flex items-center gap-2 sm:gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition-all duration-200 hover:border-teal-500/50"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white text-sm sm:text-base">Create Zoom meeting</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLocationSelect('Google Meet')}
                    className="w-full flex items-center gap-2 sm:gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition-all duration-200 hover:border-teal-500/50"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white text-sm sm:text-base">Create Google Meet</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                If you have a virtual event link, you can enter or paste it above.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Question Form Modal Component
function QuestionFormModal({
  question,
  onSave,
  onCancel,
}: {
  question: RegistrationQuestion | null;
  onSave: (question: RegistrationQuestion) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Omit<RegistrationQuestion, 'id'>>({
    type: question?.type || 'text',
    label: question?.label || '',
    placeholder: question?.placeholder || '',
    required: question?.required || false,
    options: question?.options || [],
    validation: question?.validation || {},
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuestion: RegistrationQuestion = {
      id: question?.id || `q-${Date.now()}`,
      ...formData,
    };
    onSave(newQuestion);
  };

  const questionTypes = [
    { value: 'text', label: 'Short Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'number', label: 'Number' },
    { value: 'select', label: 'Dropdown' },
    { value: 'radio', label: 'Multiple Choice' },
    { value: 'checkbox', label: 'Checkboxes' },
  ];

  const needsOptions = ['select', 'radio', 'checkbox'].includes(formData.type);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-lg p-4 sm:p-6 max-w-2xl w-full border border-slate-700 max-h-[90vh] overflow-y-auto my-auto">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
          {question ? 'Edit Question' : 'Add Question'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Question Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any, options: [] }))}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {questionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Question Label */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Question Label *
            </label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              placeholder="e.g., What is your company name?"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Placeholder */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Placeholder Text
            </label>
            <input
              type="text"
              value={formData.placeholder}
              onChange={(e) => setFormData(prev => ({ ...prev, placeholder: e.target.value }))}
              placeholder="Optional placeholder text"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Options for select/radio/checkbox */}
          {needsOptions && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Options (one per line) *
              </label>
              <textarea
                value={formData.options?.join('\n') || ''}
                onChange={(e) => {
                  const options = e.target.value.split('\n').filter(opt => opt.trim());
                  setFormData(prev => ({ ...prev, options }));
                }}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                rows={4}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                required={needsOptions}
              />
              <p className="text-xs text-slate-400 mt-1">
                Enter each option on a new line
              </p>
            </div>
          )}

          {/* Required Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">
              Required Field
            </label>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, required: !prev.required }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.required ? 'bg-teal-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.required ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Validation for number type */}
          {formData.type === 'number' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Min Value
                </label>
                <input
                  type="number"
                  value={formData.validation?.min || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    validation: { ...prev.validation, min: e.target.value ? parseInt(e.target.value) : undefined }
                  }))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Max Value
                </label>
                <input
                  type="number"
                  value={formData.validation?.max || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    validation: { ...prev.validation, max: e.target.value ? parseInt(e.target.value) : undefined }
                  }))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="bg-teal-500 hover:bg-teal-600 text-white w-full sm:w-auto"
            >
              {question ? 'Update Question' : 'Add Question'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
