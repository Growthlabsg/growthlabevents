'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface Collaboration {
  collaboratorId: string;
  collaboratorName: string;
  role: 'co-host' | 'partner' | 'sponsor';
  status: 'pending' | 'accepted' | 'rejected';
  requestedAt: string;
}

interface EventCollaborationProps {
  eventId: string;
  isOrganizer?: boolean;
}

export function EventCollaboration({ eventId, isOrganizer = false }: EventCollaborationProps) {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    collaboratorName: '',
    role: 'co-host' as 'co-host' | 'partner' | 'sponsor',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCollaborations();
  }, [eventId]);

  const fetchCollaborations = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/collaborate`);
      const data = await response.json();
      if (data.success) {
        setCollaborations(data.data.collaborations || []);
      }
    } catch (error) {
      console.error('Failed to fetch collaborations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCollaboration = async () => {
    if (!requestData.collaboratorName.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/events/${eventId}/collaborate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request',
          collaboratorId: `collab-${Date.now()}`,
          collaboratorName: requestData.collaboratorName,
          role: requestData.role,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowRequestForm(false);
        setRequestData({ collaboratorName: '', role: 'co-host' });
        fetchCollaborations();
      } else {
        alert(data.message || 'Failed to send collaboration request');
      }
    } catch (error) {
      console.error('Failed to request collaboration:', error);
      alert('Failed to send collaboration request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRespondToRequest = async (collaboratorId: string, action: 'accept' | 'reject') => {
    try {
      const response = await fetch(`/api/events/${eventId}/collaborate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          collaboratorId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchCollaborations();
      } else {
        alert(data.message || `Failed to ${action} collaboration request`);
      }
    } catch (error) {
      console.error(`Failed to ${action} collaboration:`, error);
      alert(`Failed to ${action} collaboration request`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const pendingRequests = collaborations.filter(c => c.status === 'pending');
  const acceptedCollaborations = collaborations.filter(c => c.status === 'accepted');

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Collaborations</CardTitle>
          {isOrganizer && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Request Collaboration
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Request Form */}
        {showRequestForm && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Request Collaboration</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Collaborator Name
                </label>
                <input
                  type="text"
                  value={requestData.collaboratorName}
                  onChange={(e) => setRequestData({ ...requestData, collaboratorName: e.target.value })}
                  placeholder="Enter company or organizer name"
                  className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Role
                </label>
                <select
                  value={requestData.role}
                  onChange={(e) => setRequestData({ ...requestData, role: e.target.value as any })}
                  className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="co-host">Co-Host</option>
                  <option value="partner">Partner</option>
                  <option value="sponsor">Sponsor</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRequestCollaboration}
                  disabled={!requestData.collaboratorName.trim() || submitting}
                  className="flex-1"
                >
                  {submitting ? 'Sending...' : 'Send Request'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowRequestForm(false);
                    setRequestData({ collaboratorName: '', role: 'co-host' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Requests (Organizer View) */}
        {isOrganizer && pendingRequests.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
              Pending Requests ({pendingRequests.length})
            </h4>
            <div className="space-y-2">
              {pendingRequests.map((collab) => (
                <div
                  key={collab.collaboratorId}
                  className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-white">
                        {collab.collaboratorName}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                        {collab.role} • Requested {new Date(collab.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRespondToRequest(collab.collaboratorId, 'accept')}
                        className="text-green-600 dark:text-green-400 border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRespondToRequest(collab.collaboratorId, 'reject')}
                        className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accepted Collaborations */}
        {acceptedCollaborations.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">
              Collaborators ({acceptedCollaborations.length})
            </h4>
            <div className="space-y-2">
              {acceptedCollaborations.map((collab) => (
                <div
                  key={collab.collaboratorId}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-white">
                        {collab.collaboratorName}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                        {collab.role}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {collaborations.length === 0 && !showRequestForm && (
          <div className="text-center py-6">
            <svg className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              No collaborations yet
            </p>
            {isOrganizer && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRequestForm(true)}
              >
                Request Collaboration
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

