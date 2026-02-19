'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { EventTag } from '@/lib/eventTags';

interface EventTagManagementProps {
  calendarId: string;
}

export function EventTagManagement({ calendarId }: EventTagManagementProps) {
  const [tags, setTags] = useState<EventTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTag, setEditingTag] = useState<EventTag | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#ef4444');
  const [submitting, setSubmitting] = useState(false);

  const colors = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Lime', value: '#84cc16' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Sky', value: '#0ea5e9' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Fuchsia', value: '#d946ef' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Rose', value: '#f43f5e' },
  ];

  useEffect(() => {
    fetchTags();
  }, [calendarId]);

  const fetchTags = async () => {
    try {
      const response = await fetch(`/api/calendars/${calendarId}/tags`);
      const data = await response.json();
      if (data.success) {
        setTags(data.data.tags || []);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      alert('Please enter a tag name');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/calendars/${calendarId}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName.trim(), color: newTagColor }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchTags();
        setShowCreateModal(false);
        setNewTagName('');
        setNewTagColor('#ef4444');
      } else {
        alert(data.message || 'Failed to create tag');
      }
    } catch (error) {
      console.error('Failed to create tag:', error);
      alert('Failed to create tag');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTag = async (tagId: string) => {
    if (!newTagName.trim()) {
      alert('Please enter a tag name');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/calendars/${calendarId}/tags/${tagId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName.trim(), color: newTagColor }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchTags();
        setEditingTag(null);
        setNewTagName('');
        setNewTagColor('#ef4444');
      } else {
        alert(data.message || 'Failed to update tag');
      }
    } catch (error) {
      console.error('Failed to update tag:', error);
      alert('Failed to update tag');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag? This will remove it from all events.')) {
      return;
    }

    try {
      const response = await fetch(`/api/calendars/${calendarId}/tags/${tagId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        await fetchTags();
      } else {
        alert(data.message || 'Failed to delete tag');
      }
    } catch (error) {
      console.error('Failed to delete tag:', error);
      alert('Failed to delete tag');
    }
  };

  const handleEditClick = (tag: EventTag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
    setShowCreateModal(true);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
            Event Tags
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Allow visitors to filter events by categories on the calendar page.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingTag(null);
            setNewTagName('');
            setNewTagColor('#ef4444');
            setShowCreateModal(true);
          }}
          className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Tag
        </Button>
      </div>

      {/* Tags List */}
      {tags.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 sm:p-16">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No Tags
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 text-center max-w-md">
              Create tags to help visitors filter events by categories.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between hover:border-teal-500 dark:hover:border-teal-500 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: tag.color }}
                ></div>
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                    {tag.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {tag.eventCount} {tag.eventCount === 1 ? 'Event' : 'Events'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditClick(tag)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2"
                  title="Edit tag"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-2"
                  title="Delete tag"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Tag Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {editingTag ? 'Edit Tag' : 'Create Tag'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingTag(null);
                  setNewTagName('');
                  setNewTagColor('#ef4444');
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="e.g., fitness, startup, networking"
                  className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewTagColor(color.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newTagColor === color.value
                          ? 'border-slate-900 dark:border-white scale-110'
                          : 'border-slate-300 dark:border-slate-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="mt-2 w-full h-10 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingTag(null);
                    setNewTagName('');
                    setNewTagColor('#ef4444');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={editingTag ? () => handleUpdateTag(editingTag.id) : handleCreateTag}
                  disabled={submitting || !newTagName.trim()}
                  className="flex-1"
                >
                  {submitting ? 'Saving...' : editingTag ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

