'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { QRCode } from '@/components/QRCode';
import { VirtualNameCard as NameCardType } from '@/lib/networking';

interface VirtualNameCardProps {
  userId: string;
  editable?: boolean;
}

export function VirtualNameCard({ userId, editable = false }: VirtualNameCardProps) {
  const [nameCard, setNameCard] = useState<NameCardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    bio: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    website: '',
    github: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNameCard();
  }, [userId]);

  const fetchNameCard = async () => {
    try {
      const response = await fetch(`/api/networking/namecard?userId=${userId}`);
      const data = await response.json();
      if (data.success && data.data) {
        const card = data.data;
        setNameCard(card);
        setFormData({
          name: card.name || '',
          title: card.title || '',
          company: card.company || '',
          email: card.email || '',
          phone: card.phone || '',
          bio: card.bio || '',
          linkedin: card.socialLinks?.linkedin || '',
          twitter: card.socialLinks?.twitter || '',
          instagram: card.socialLinks?.instagram || '',
          website: card.socialLinks?.website || '',
          github: card.socialLinks?.github || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch name card:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/networking/namecard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: formData.name,
          title: formData.title,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
          socialLinks: {
            linkedin: formData.linkedin || undefined,
            twitter: formData.twitter || undefined,
            instagram: formData.instagram || undefined,
            website: formData.website || undefined,
            github: formData.github || undefined,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNameCard(data.data);
        setEditing(false);
      } else {
        alert('Failed to save name card: ' + data.message);
      }
    } catch (error) {
      console.error('Failed to save name card:', error);
      alert('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const generateQRCode = () => {
    // Generate QR code for name card sharing
    return `namecard:${userId}:${nameCard?.name || 'user'}`;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (editing && editable) {
    return (
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Edit Virtual Name Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              placeholder="Tell people about yourself..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Social Links
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="LinkedIn URL"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="url"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="Twitter/X URL"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="Instagram URL"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="Website URL"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                placeholder="GitHub URL"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setEditing(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!formData.name || !formData.email || saving}
              className="flex-1"
            >
              {saving ? 'Saving...' : 'Save Name Card'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!nameCard) {
    return (
      <Card className="rounded-xl shadow-sm">
        <CardContent className="pt-6 text-center py-8">
          <p className="text-slate-600 dark:text-slate-400 mb-4">No name card found</p>
          {editable && (
            <Button variant="primary" onClick={() => setEditing(true)}>
              Create Name Card
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-sm border-2 border-teal-500">
      <CardHeader className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-t-xl">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Virtual Name Card</CardTitle>
          {editable && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Left: QR Code */}
          <div className="flex-shrink-0">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700">
              <QRCode value={generateQRCode()} size={150} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
              Scan to connect
            </p>
          </div>

          {/* Right: Contact Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {nameCard.name}
              </h3>
              {nameCard.title && (
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  {nameCard.title}
                  {nameCard.company && ` at ${nameCard.company}`}
                </p>
              )}
            </div>

            {nameCard.bio && (
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {nameCard.bio}
              </p>
            )}

            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              {nameCard.email && (
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${nameCard.email}`} className="text-teal-600 dark:text-teal-400 hover:underline">
                    {nameCard.email}
                  </a>
                </div>
              )}
              {nameCard.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${nameCard.phone}`} className="text-teal-600 dark:text-teal-400 hover:underline">
                    {nameCard.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(nameCard.socialLinks.linkedin || nameCard.socialLinks.twitter || nameCard.socialLinks.instagram || nameCard.socialLinks.website || nameCard.socialLinks.github) && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                {nameCard.socialLinks.linkedin && (
                  <a
                    href={nameCard.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    title="LinkedIn"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
                {nameCard.socialLinks.twitter && (
                  <a
                    href={nameCard.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-lg hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors"
                    title="Twitter/X"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {nameCard.socialLinks.instagram && (
                  <a
                    href={nameCard.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
                    title="Instagram"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {nameCard.socialLinks.website && (
                  <a
                    href={nameCard.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    title="Website"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                )}
                {nameCard.socialLinks.github && (
                  <a
                    href={nameCard.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-800 dark:bg-slate-600 text-white rounded-lg hover:bg-slate-900 dark:hover:bg-slate-700 transition-colors"
                    title="GitHub"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

