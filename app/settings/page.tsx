'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Button } from '@/components/ui/Button';
import { QRCode } from '@/components/QRCode';
import { AddEmailModal } from '@/components/AddEmailModal';
import { useTheme } from '@/components/ThemeProvider';
import { UserDemeritsView } from '@/components/UserDemeritsView';
import { VirtualNameCard } from '@/components/VirtualNameCard';
import { ContactRequestsPanel } from '@/components/ContactRequestsPanel';
import { NetworkingAnalytics } from '@/components/NetworkingAnalytics';
import { FavoriteCategories } from '@/components/FavoriteCategories';
import { ChatButton } from '@/components/ChatButton';

type Tab = 'account' | 'preferences' | 'payment' | 'demerits' | 'networking';

function SettingsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as Tab | null;
  const [activeTab, setActiveTab] = useState<Tab>(tabParam && ['account', 'preferences', 'payment', 'demerits', 'networking'].includes(tabParam) ? tabParam : 'account');

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam && ['account', 'preferences', 'payment', 'demerits', 'networking'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  const [profileData, setProfileData] = useState<{
    name: string;
    username: string;
    bio: string;
    instagram: string;
    website: string;
    twitter: string;
    youtube: string;
    tiktok: string;
    linkedin: string;
    logo?: File | null;
    logoPreview?: string | null;
  }>({
    name: 'GrowthLab',
    username: 'growthlabsg',
    bio: 'Building the "Linkedin for Startups"\nFounder & startup community\nWeekly events • Workshops • Networking',
    instagram: 'growthlab.sg',
    website: 'https://www.growthlab.sg',
    twitter: 'Growthlabsg',
    youtube: 'growthlabsg',
    tiktok: 'growthlab.sg',
    linkedin: '/in/arul-murugar',
    logo: null,
    logoPreview: null,
  });

  const [emails, setEmails] = useState([
    { id: '1', email: 'growthlab.sg@gmail.com', isPrimary: true },
  ]);

  const [mobileNumber, setMobileNumber] = useState('+65 8123 4567');

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Save to API
    console.log('Saving profile:', profileData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          {/* Header */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-8 sm:mb-10 lg:mb-12 tracking-tight">
            Settings
          </h1>

          {/* Tabs - Scrollable on mobile */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 sm:mb-10">
            <div className="flex space-x-1 border-b border-slate-200 dark:border-slate-700 min-w-max sm:min-w-0">
              <button
                onClick={() => setActiveTab('account')}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
                  activeTab === 'account'
                    ? 'text-slate-900 dark:text-white border-b-2 border-teal-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Account
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
                  activeTab === 'preferences'
                    ? 'text-slate-900 dark:text-white border-b-2 border-teal-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Preferences
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
                  activeTab === 'payment'
                    ? 'text-slate-900 dark:text-white border-b-2 border-teal-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Payment
              </button>
              <button
                onClick={() => setActiveTab('demerits')}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
                  activeTab === 'demerits'
                    ? 'text-slate-900 dark:text-white border-b-2 border-teal-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Demerits
              </button>
              <button
                onClick={() => setActiveTab('networking')}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
                  activeTab === 'networking'
                    ? 'text-slate-900 dark:text-white border-b-2 border-teal-500'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Networking
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl">
            {activeTab === 'account' && (
              <AccountTab 
                profileData={profileData} 
                onInputChange={handleInputChange}
                onProfileDataChange={setProfileData}
                onSave={handleSave}
                emails={emails}
                onEmailsChange={setEmails}
                mobileNumber={mobileNumber}
                onMobileNumberChange={setMobileNumber}
              />
            )}
            {activeTab === 'preferences' && (
              <PreferencesTab />
            )}
            {activeTab === 'payment' && (
              <PaymentTab />
            )}
            {activeTab === 'demerits' && (
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                    My Demerits
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    View your demerit history and submit appeals if you believe a demerit was issued incorrectly.
                  </p>
                  <UserDemeritsView userId="current-user" />
                </div>
              </div>
            )}
            {activeTab === 'networking' && (
              <div className="space-y-6 sm:space-y-8">
                {/* Virtual Name Card */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                    Virtual Name Card
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    Create and share your digital business card with QR code.
                  </p>
                  <VirtualNameCard userId="current-user" editable={true} />
                </div>

                {/* Networking Analytics */}
                <div>
                  <NetworkingAnalytics userId="current-user" />
                </div>

                {/* Contact Requests */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Received Requests
                    </h3>
                    <ContactRequestsPanel userId="current-user" type="received" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Sent Requests
                    </h3>
                    <ContactRequestsPanel userId="current-user" type="sent" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Chat Button */}
      <ChatButton />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <HorizontalNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading settings...</p>
          </div>
        </main>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}

// Account Tab Component
function AccountTab({
  profileData,
  onInputChange,
  onProfileDataChange,
  onSave,
  emails,
  onEmailsChange,
  mobileNumber,
  onMobileNumberChange,
}: {
  profileData: {
    name: string;
    username: string;
    bio: string;
    instagram: string;
    website: string;
    twitter: string;
    youtube: string;
    tiktok: string;
    linkedin: string;
    logo?: File | null;
    logoPreview?: string | null;
  };
  onInputChange: (field: string, value: string) => void;
  onProfileDataChange: React.Dispatch<React.SetStateAction<typeof profileData>>;
  onSave: () => void;
  emails: Array<{ id: string; email: string; isPrimary: boolean }>;
  onEmailsChange: (emails: Array<{ id: string; email: string; isPrimary: boolean }>) => void;
  mobileNumber: string;
  onMobileNumberChange: (number: string) => void;
}) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const handleAddEmail = (email: string) => {
    const newEmail = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      isPrimary: false,
    };
    onEmailsChange([...emails, newEmail]);
  };

  const handleRemoveEmail = (id: string) => {
    if (emails.find(e => e.id === id)?.isPrimary) {
      return; // Don't allow removing primary email
    }
    onEmailsChange(emails.filter(e => e.id !== id));
  };

  const handleSetPrimary = (id: string) => {
    onEmailsChange(
      emails.map(e => ({
        ...e,
        isPrimary: e.id === id,
      }))
    );
  };

  const handleRemoveSocialLink = (field: string) => {
    onInputChange(field, '');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Your Profile Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Your Profile
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6">
          Choose how you are displayed as a host or guest.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Form Fields */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => onInputChange('name', e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">@</span>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => onInputChange('username', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl pl-8 pr-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => onInputChange('bio', e.target.value)}
                rows={5}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Social Links
              </label>
              <div className="space-y-3">
                {/* Instagram */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441c.795 0 1.439-.645 1.439-1.44s-.644-1.439-1.439-1.439z"/>
                    </svg>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400 text-sm">instagram.com/</span>
                    <input
                      type="text"
                      value={profileData.instagram}
                      onChange={(e) => onInputChange('instagram', e.target.value)}
                      placeholder="yourusername"
                      className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={profileData.website}
                      onChange={(e) => onInputChange('website', e.target.value)}
                      placeholder="yourwebsite.com"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Twitter/X */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-slate-600 dark:text-slate-400 text-sm">x.com/</span>
                    <input
                      type="text"
                      value={profileData.twitter}
                      onChange={(e) => onInputChange('twitter', e.target.value)}
                      placeholder="yourusername"
                      className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <Button
                onClick={onSave}
                variant="primary"
                className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Save Changes
              </Button>
            </div>
          </div>

          {/* Right Column - Profile Picture/Logo */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Profile Logo
            </label>
            <div className="relative">
              <label className="block w-full max-w-[200px] mx-auto aspect-square rounded-full bg-white dark:bg-slate-800 flex flex-col items-center justify-center border-2 border-slate-200 dark:border-slate-700 shadow-lg relative overflow-hidden group cursor-pointer hover:border-teal-500 dark:hover:border-teal-500 transition-all">
                {/* Uploaded Logo Preview or Default Icon */}
                {profileData.logoPreview ? (
                  <img 
                    src={profileData.logoPreview} 
                    alt="Profile logo" 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <>
                    {/* Profile Icon - Green hand symbol */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-green-500 rounded-full flex items-center justify-center mb-2">
                      <div className="text-white text-4xl sm:text-5xl">✋</div>
                    </div>
                    <div className="text-slate-900 dark:text-white font-semibold text-sm sm:text-base">Growth</div>
                  </>
                )}
                
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium">Upload Logo</span>
                  </div>
                </div>
                
                {/* Upload Arrow Icon at bottom center (only when no logo) */}
                {!profileData.logoPreview && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-700 dark:bg-slate-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Validate file size (max 5MB for logo)
                      if (file.size > 5 * 1024 * 1024) {
                        alert('Logo size must be less than 5MB');
                        return;
                      }
                      // Validate file type
                      if (!file.type.startsWith('image/')) {
                        alert('Please upload an image file');
                        return;
                      }
                      onProfileDataChange((prev: typeof profileData) => ({ ...prev, logo: file }));
                      // Create preview URL
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        onProfileDataChange((prev: typeof profileData) => ({ ...prev, logoPreview: reader.result as string }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              
              {/* Remove logo button (only when logo exists) */}
              {profileData.logoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    onProfileDataChange((prev: typeof profileData) => ({ 
                      ...prev, 
                      logo: null, 
                      logoPreview: null 
                    }));
                  }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-lg transition-all"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
              {profileData.logoPreview ? 'Click to change logo' : 'Click to upload your logo'}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-center">
              Recommended: Square image, max 5MB
            </p>
          </div>

          {/* QR Code */}
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4 text-center">
              Check-in QR Code
            </label>
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <QRCode 
                  value={`user:${profileData.username}:${profileData.name}`}
                  size={180}
                  className="mb-0"
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">
                Scan this QR code to check in at events
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-teal-500 text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 w-full sm:w-auto"
                onClick={() => window.open('/checkin', '_blank')}
              >
                Open Check-in Scanner
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Emails Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Emails
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
          Add additional emails to receive event invitations sent to those addresses.
        </p>

        <div className="space-y-3">
          {emails.map((email) => (
            <div
              key={email.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 dark:text-white font-medium">{email.email}</span>
                  {email.isPrimary && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full">
                      Primary
                    </span>
                  )}
                </div>
                {email.isPrimary && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    This email will be shared with hosts when you register for their events.
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!email.isPrimary && (
                  <>
                    <button
                      onClick={() => handleSetPrimary(email.id)}
                      className="text-xs text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 px-2 py-1 rounded hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
                    >
                      Set Primary
                    </button>
                    <button
                      onClick={() => handleRemoveEmail(email.id)}
                      className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                      title="Remove email"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Button
            onClick={() => setIsEmailModalOpen(true)}
            variant="primary"
            size="sm"
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Email
          </Button>
        </div>

        <AddEmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          onAdd={handleAddEmail}
          existingEmails={emails.map(e => e.email)}
        />
      </div>

      {/* Mobile Number Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Mobile Number
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
          Manage the mobile number you use to sign in to GrowthLab and receive SMS updates.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-2">
          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => onMobileNumberChange(e.target.value)}
            placeholder="Enter mobile number"
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
          />
          <Button
            onClick={() => {
              // TODO: Update mobile number
              console.log('Update mobile number:', mobileNumber);
            }}
            variant="primary"
            size="sm"
            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 w-full sm:w-auto"
          >
            Update
          </Button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          For your security, we will send you a code to verify any change to your mobile number.
        </p>
      </div>

      {/* Password & Security Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Password & Security
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
          Secure your account with password and two-factor authentication.
        </p>

        <div className="space-y-4">
          {/* Account Password */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900 dark:text-white mb-1">Account Password</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Please follow the instructions in the email to finish setting your password.
                </p>
                <Button
                  onClick={() => {
                    // TODO: Set password
                    console.log('Set password');
                  }}
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Set Password
                </Button>
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900 dark:text-white mb-1">Two-Factor Authentication</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Please set a password before enabling two-factor authentication.
                </p>
                <Button
                  onClick={() => {
                    // TODO: Enable 2FA
                    console.log('Enable 2FA');
                  }}
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Enable 2FA
                </Button>
              </div>
            </div>
          </div>

          {/* Passkeys */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11h.01M12 11h.01M16 11h.01" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900 dark:text-white mb-1">Passkeys</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  You have 1 active passkey.
                </p>
                <Button
                  onClick={() => {
                    // TODO: Manage passkeys
                    console.log('Manage passkeys');
                  }}
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Manage Passkeys
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Third Party Accounts Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Third Party Accounts
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
          Link your accounts to sign in to GrowthLab and automate your workflows.
        </p>

        <div className="space-y-3">
          {/* Google Account */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm card-elegant">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Google</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Not connected</p>
              </div>
            </div>
            <Button
              onClick={() => {
                // TODO: Connect Google
                console.log('Connect Google');
              }}
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Connect
            </Button>
          </div>

          {/* Apple Account */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm card-elegant">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-black dark:bg-slate-700 rounded-xl">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 4.96 7.59 9.38 7.38c1.44.13 2.49.93 3.18.93.66 0 1.79-.75 3.04-.64 1.3.12 2.36.77 3.12 1.8-2.7 1.57-2.26 4.74.5 5.83-.03.18-.05.36-.05.54 0 .2.02.4.03.6-.97.05-1.95.15-2.93.26-.98.12-1.96.24-2.94.36-.98.12-1.96.24-2.94.36zM12.03 7.25c-.15-1.23.35-2.4 1.1-3.25.82-.94 2.05-1.5 3.2-1.58.15 1.23-.35 2.4-1.1 3.25-.82.94-2.05 1.5-3.2 1.58z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Apple</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Not connected</p>
              </div>
            </div>
            <Button
              onClick={() => {
                // TODO: Connect Apple
                console.log('Connect Apple');
              }}
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Connect
            </Button>
          </div>

          {/* GitHub Account */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm card-elegant">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-slate-800 dark:bg-slate-700 rounded-xl">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">GitHub</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Not connected</p>
              </div>
            </div>
            <Button
              onClick={() => {
                // TODO: Connect GitHub
                console.log('Connect GitHub');
              }}
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Connect
            </Button>
          </div>

          {/* Zoom Account */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm card-elegant">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-blue-500 rounded-xl">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-2.25 2.25v5.18c0 .414-.336.75-.75.75h-5.18l-2.25 2.25H6v-2.25l2.25-2.25h5.18V8.16l2.25-2.25H17.568v2.25z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Zoom</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Not Linked</p>
              </div>
            </div>
            <Button
              onClick={() => {
                // TODO: Connect Zoom
                console.log('Connect Zoom');
              }}
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Link
            </Button>
          </div>

          {/* Solana Account */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm card-elegant">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <div className="w-5 h-5 flex flex-col gap-0.5">
                  <div className="h-0.5 bg-white w-full"></div>
                  <div className="h-0.5 bg-white w-full"></div>
                  <div className="h-0.5 bg-white w-full"></div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Solana</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Not Linked</p>
              </div>
            </div>
            <Button
              onClick={() => {
                // TODO: Connect Solana
                console.log('Connect Solana');
              }}
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Link
            </Button>
          </div>

          {/* Ethereum Account */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm card-elegant">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-slate-700 rounded-xl">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">Ethereum</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Not Linked</p>
              </div>
            </div>
            <Button
              onClick={() => {
                // TODO: Connect Ethereum
                console.log('Connect Ethereum');
              }}
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Link
            </Button>
          </div>
        </div>
      </div>

      {/* Favorite Categories Section */}
      <div className="mb-8">
        <FavoriteCategories userId="current-user" />
      </div>

      {/* Account Syncing Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Account Syncing
        </h2>

        <div className="space-y-4">
          {/* Calendar Syncing */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-medium text-slate-900 dark:text-white mb-2">Calendar Syncing</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Sync your GrowthLab events with your Google, Outlook, or Apple calendar.
            </p>
            <Button
              onClick={() => {
                // TODO: Add iCal subscription
                console.log('Add iCal subscription');
              }}
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Add iCal Subscription
            </Button>
          </div>

          {/* Sync Contacts with Google */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-medium text-slate-900 dark:text-white mb-2">Sync Contacts with Google</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Sync your Gmail contacts to easily invite them to your events.
            </p>
            <Button
              onClick={() => {
                // TODO: Enable syncing
                console.log('Enable syncing');
              }}
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Enable Syncing
            </Button>
          </div>
        </div>
      </div>

      {/* Active Devices Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Active Devices
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
          See the list of devices you are currently signed into GrowthLab from.
        </p>

        <div className="space-y-3">
          {/* Device 1 - This Device */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm card-elegant">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-slate-900 dark:text-white">Chrome on macOS</h3>
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                    This Device
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Singapore, SG</p>
              </div>
            </div>
          </div>

          {/* Device 2 */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm card-elegant">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900 dark:text-white">iOS App on Arul</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active 22 minutes ago · Singapore, SG</p>
              </div>
            </div>
            <button
              onClick={() => {
                // TODO: Sign out device
                console.log('Sign out device');
              }}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Device 3 */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm card-elegant">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900 dark:text-white">GSA on iOS</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active 9 Nov · Singapore, SG</p>
              </div>
            </div>
            <button
              onClick={() => {
                // TODO: Sign out device
                console.log('Sign out device');
              }}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Device 4 */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm card-elegant">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-slate-100 dark:bg-slate-700 rounded-xl">
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900 dark:text-white">iOS App on Iniya</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active 7 Nov · Singapore, SG</p>
              </div>
            </div>
            <button
              onClick={() => {
                // TODO: Sign out device
                console.log('Sign out device');
              }}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
          See something you don't recognise?{' '}
          <button
            onClick={() => {
              // TODO: Sign out all other devices
              console.log('Sign out all other devices');
            }}
            className="text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 underline"
          >
            You may sign out of all other devices.
          </button>
        </p>
      </div>

      {/* Delete Account Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Delete Account
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
          If you no longer wish to use GrowthLab, you can permanently delete your account.
        </p>
        <Button
          onClick={() => {
            // TODO: Delete account
            console.log('Delete account');
          }}
          variant="primary"
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Delete My Account
        </Button>
      </div>
    </div>
  );
}

// Preferences Tab Component
function PreferencesTab() {
  const [favoriteCategoriesVisible, setFavoriteCategoriesVisible] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [preferences, setPreferences] = useState({
    display: 'light' as 'light' | 'dark',
    language: 'en-SG',
    emailNotifications: true,
    eventReminders: true,
    marketingEmails: false,
    timezone: 'Asia/Singapore',
  });

  const [showMobileLinkCard, setShowMobileLinkCard] = useState(true);

  // Sync display preference with theme on mount and when theme changes
  useEffect(() => {
    if (theme) {
      setPreferences(prev => ({ ...prev, display: theme }));
    }
  }, [theme]);

  const handleDisplayChange = (newDisplay: 'light' | 'dark') => {
    setPreferences(prev => ({ ...prev, display: newDisplay }));
    // Update theme if it's different
    if (newDisplay !== theme) {
      toggleTheme();
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Display Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Display
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
          Choose your desired GrowthLab interface.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {/* Light */}
          <button
            onClick={() => handleDisplayChange('light')}
            className={`p-4 rounded-xl border-2 transition-all ${
              preferences.display === 'light'
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="aspect-video bg-white rounded mb-2 relative">
              {preferences.display === 'light' && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white text-center">Light</p>
          </button>

          {/* Dark */}
          <button
            onClick={() => handleDisplayChange('dark')}
            className={`p-4 rounded-xl border-2 transition-all ${
              preferences.display === 'dark'
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="aspect-video bg-slate-800 rounded mb-2 relative">
              {preferences.display === 'dark' && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white text-center">Dark</p>
          </button>
        </div>
      </div>

      {/* Language Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Language
        </h2>
        <select
          value={preferences.language}
          onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
          className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="en-SG">English (Singapore)</option>
          <option value="en">English</option>
          <option value="zh">中文</option>
          <option value="ms">Bahasa Melayu</option>
          <option value="ta">தமிழ்</option>
        </select>
      </div>

      {/* Timezone Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Timezone
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
          Set your timezone to ensure event times are displayed correctly.
        </p>
        <select
          value={preferences.timezone}
          onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
          className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
          <option value="Asia/Kuala_Lumpur">Asia/Kuala Lumpur (MYT)</option>
          <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
          <option value="Asia/Bangkok">Asia/Bangkok (ICT)</option>
          <option value="Asia/Manila">Asia/Manila (PHT)</option>
          <option value="Asia/Hong_Kong">Asia/Hong Kong (HKT)</option>
          <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
          <option value="Asia/Seoul">Asia/Seoul (KST)</option>
          <option value="Asia/Shanghai">Asia/Shanghai (CST)</option>
          <option value="Asia/Dubai">Asia/Dubai (GST)</option>
          <option value="Europe/London">Europe/London (GMT)</option>
          <option value="America/New_York">America/New York (EST)</option>
          <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
          <option value="Australia/Sydney">Australia/Sydney (AEDT)</option>
        </select>
      </div>

      {/* Notifications Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Notifications
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
          Choose how you would like to be notified about updates, invitations and subscriptions.
        </p>

        {/* Link Mobile Number Card */}
        {showMobileLinkCard && (
          <div className="relative p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mb-4">
            <button
              onClick={() => setShowMobileLinkCard(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-slate-200 dark:bg-slate-700 rounded-xl">
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-slate-900 dark:text-white mb-1">Link Your Mobile Number</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Get notifications on your mobile and never miss an important message.
                </p>
                <Button
                  onClick={() => {
                    // TODO: Link mobile number
                    console.log('Link mobile number');
                  }}
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Link Mobile Number
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Events You Attend Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Events You Attend</h3>
            <div className="space-y-3">
              {[
                { icon: '📧', label: 'Event Invitations', value: 'Email, Push' },
                { icon: '⏰', label: 'Event Reminders', value: 'Email, Push' },
                { icon: '📢', label: 'Event Blasts', value: 'Email, Push' },
                { icon: '📅', label: 'Event Updates', value: 'Email, Push' },
                { icon: '💬', label: 'Feedback Requests', value: 'Email' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-slate-900 dark:text-white font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.value}</span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Events You Host Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Events You Host</h3>
            <div className="space-y-3">
              {[
                { icon: '👥', label: 'Guest Registrations', value: 'Email, Push' },
                { icon: '⭐', label: 'Feedback Responses', value: 'Email' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-slate-900 dark:text-white font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.value}</span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendars You Manage Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Calendars You Manage</h3>
            <div className="space-y-3">
              {[
                { icon: '👤', label: 'New Members', value: 'Email, Push' },
                { icon: '📝', label: 'Event Submissions', value: 'Email' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-slate-900 dark:text-white font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.value}</span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GrowthLab Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">GrowthLab</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💎</span>
                  <span className="text-slate-900 dark:text-white font-medium">Product Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Email</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Your Subscriptions Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Your Subscriptions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🌐</span>
                  <span className="text-slate-900 dark:text-white font-medium">GrowthLab Discovery Pages</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">3 Pages</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📅</span>
                  <span className="text-slate-900 dark:text-white font-medium">Calendars</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">8 Calendars</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Payment Tab Component
function PaymentTab() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'bank',
      name: 'DBS Bank',
      accountNumber: '****1234',
      isDefault: true,
    },
  ]);

  const [payoutSettings, setPayoutSettings] = useState({
    frequency: 'weekly',
    minimumAmount: 100,
    currency: 'SGD',
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
        Payment
      </h2>

      <div className="space-y-6">
        {/* Payment Methods */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-medium text-slate-900 dark:text-white mb-2">Payment Methods</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Add payment methods to receive payouts from ticket sales.
          </p>

          <div className="space-y-3 mb-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                    <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-6 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-white">{method.name}</span>
                      {method.isDefault && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{method.accountNumber}</p>
                  </div>
                </div>
                <button
                  className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  onClick={() => {
                    // TODO: Remove payment method
                    console.log('Remove payment method');
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Payment Method
          </Button>
        </div>

        {/* Payout Settings */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-medium text-slate-900 dark:text-white mb-2">Payout Settings</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Configure how and when you receive payouts from your events.
          </p>

          <div className="space-y-6">
            {/* Payout Frequency */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Payout Frequency
              </label>
              <select
                value={payoutSettings.frequency}
                onChange={(e) => setPayoutSettings(prev => ({ ...prev, frequency: e.target.value }))}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Payouts will be processed according to your selected frequency.
              </p>
            </div>

            {/* Minimum Payout Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Minimum Payout Amount ({payoutSettings.currency})
              </label>
              <input
                type="number"
                value={payoutSettings.minimumAmount}
                onChange={(e) => setPayoutSettings(prev => ({ ...prev, minimumAmount: Number(e.target.value) }))}
                min="0"
                step="1"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Payouts will only be processed when your balance reaches this amount.
              </p>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Currency
              </label>
              <select
                value={payoutSettings.currency}
                onChange={(e) => setPayoutSettings(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="SGD">SGD - Singapore Dollar</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="MYR">MYR - Malaysian Ringgit</option>
                <option value="IDR">IDR - Indonesian Rupiah</option>
                <option value="THB">THB - Thai Baht</option>
                <option value="PHP">PHP - Philippine Peso</option>
                <option value="HKD">HKD - Hong Kong Dollar</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
            </div>

            <div className="pt-4">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  // TODO: Save payout settings
                  console.log('Saving payout settings:', payoutSettings);
                }}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100"
              >
                Save Payout Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-medium text-slate-900 dark:text-white mb-2">Transaction History</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            View your payout history and transaction details.
          </p>
          <Button variant="outline" size="sm">
            View Transactions
          </Button>
        </div>
      </div>
    </div>
  );
}

