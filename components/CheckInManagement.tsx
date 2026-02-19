'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface CheckInManagementProps {
  eventId: string;
  eventTitle: string;
}

interface AttendanceEntry {
  attendeeId: string;
  attendeeName: string;
  attendeeEmail?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
}

export function CheckInManagement({ eventId, eventTitle }: CheckInManagementProps) {
  const [attendance, setAttendance] = useState<{
    checkedIn: AttendanceEntry[];
    checkedOut: AttendanceEntry[];
    totalCheckedIn: number;
    totalCheckedOut: number;
  }>({
    checkedIn: [],
    checkedOut: [],
    totalCheckedIn: 0,
    totalCheckedOut: 0,
  });
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'scan' | 'manual'>('manual');
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [checkInResult, setCheckInResult] = useState<{ success: boolean; message: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/checkin`);
      const data = await response.json();
      if (data.success) {
        setAttendance(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    // Refresh every 5 seconds
    const interval = setInterval(fetchAttendance, 5000);
    return () => {
      clearInterval(interval);
      stopScanning();
    };
  }, [eventId]);

  // Start camera for QR scanning
  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCheckInResult({
        success: false,
        message: 'Unable to access camera. Please check permissions or use manual entry.'
      });
      setTimeout(() => setCheckInResult(null), 5000);
    }
  };

  // Stop camera
  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Handle QR code scan (simulated - in production use a QR scanner library like html5-qrcode)
  const handleQRScan = (code: string) => {
    setManualCode(code);
    stopScanning();
    // Automatically process the check-in
    setTimeout(() => {
      handleManualCheckIn();
    }, 100);
  };

  const handleManualCheckIn = async () => {
    if (!manualCode.trim()) {
      setCheckInResult({ success: false, message: 'Please enter a QR code or email' });
      return;
    }

    try {
      // Parse QR code format
      const parts = manualCode.trim().split(':');
      let attendeeName = 'Unknown';
      let email = '';
      let registrationId = '';

      // Handle event registration QR code: event:eventId:registrationId:attendeeName:email
      if (parts.length >= 4 && parts[0] === 'event') {
        const [, qrEventId, qrRegistrationId, qrName, qrEmail] = parts;
        
        // Verify this QR code is for the current event
        if (qrEventId !== eventId) {
          setCheckInResult({ 
            success: false, 
            message: `This QR code is for a different event. Expected event ID: ${eventId}` 
          });
          setTimeout(() => setCheckInResult(null), 3000);
          return;
        }
        
        registrationId = qrRegistrationId;
        attendeeName = qrName;
        email = qrEmail || '';
      }
      // Handle user profile QR code: user:username:name
      else if (parts.length === 3 && parts[0] === 'user') {
        attendeeName = parts[2];
        email = `${parts[1]}@example.com`;
      }
      // Assume it's an email
      else {
        email = manualCode.trim();
        attendeeName = email.split('@')[0];
      }

      const response = await fetch(`/api/events/${eventId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCode: manualCode.trim(),
          registrationId: registrationId || undefined,
          email: email || undefined,
          attendeeName: attendeeName,
          action: 'checkin',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCheckInResult({ success: true, message: `Successfully checked in: ${attendeeName}` });
        setManualCode('');
        fetchAttendance();
        setTimeout(() => setCheckInResult(null), 3000);
      } else {
        setCheckInResult({ success: false, message: data.message || 'Check-in failed' });
        setTimeout(() => setCheckInResult(null), 3000);
      }
    } catch (error) {
      setCheckInResult({ success: false, message: 'Error processing check-in' });
      setTimeout(() => setCheckInResult(null), 3000);
    }
  };

  const handleCheckOut = async (attendeeId: string, attendeeName: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: attendeeId,
          action: 'checkout',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCheckInResult({ success: true, message: `Successfully checked out: ${attendeeName}` });
        fetchAttendance();
        setTimeout(() => setCheckInResult(null), 3000);
      } else {
        setCheckInResult({ success: false, message: data.message || 'Check-out failed' });
        setTimeout(() => setCheckInResult(null), 3000);
      }
    } catch (error) {
      setCheckInResult({ success: false, message: 'Error processing check-out' });
      setTimeout(() => setCheckInResult(null), 3000);
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Check-in Result Message */}
      {checkInResult && (
        <div
          className={`p-4 rounded-xl ${
            checkInResult.success
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}
        >
          <p
            className={`text-sm font-medium ${
              checkInResult.success
                ? 'text-green-800 dark:text-green-300'
                : 'text-red-800 dark:text-red-300'
            }`}
          >
            {checkInResult.message}
          </p>
        </div>
      )}

      {/* Check-in Section */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Check-in Attendees</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setMode('scan');
                stopScanning();
                setCheckInResult(null);
              }}
              className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                mode === 'scan'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Scan QR Code
            </button>
            <button
              onClick={() => {
                setMode('manual');
                stopScanning();
                setCheckInResult(null);
              }}
              className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                mode === 'manual'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Manual Entry
            </button>
          </div>

          {/* Scan Mode */}
          {mode === 'scan' && (
            <div className="space-y-4">
              {!isScanning ? (
                <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Ready to Scan
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Click the button below to start scanning QR codes
                  </p>
                  <Button
                    variant="primary"
                    onClick={startScanning}
                    className="btn-elegant"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    Start Scanning
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-square max-w-md mx-auto bg-black rounded-xl overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-4 border-teal-500 rounded-xl pointer-events-none">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-teal-500"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-teal-500"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-teal-500"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-teal-500"></div>
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <Button
                      variant="outline"
                      onClick={stopScanning}
                      className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Stop Scanning
                    </Button>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Position the QR code within the frame
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      <strong>Note:</strong> For production, integrate a QR scanner library (e.g., html5-qrcode) to automatically detect QR codes
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manual Entry Mode */}
          {mode === 'manual' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualCheckIn()}
                  placeholder="Enter QR code or email"
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Button onClick={handleManualCheckIn} variant="primary" className="sm:w-auto">
                  Check In
                </Button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter a QR code in format: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">event:eventId:registrationId:name:email</code> or an email address
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-xl shadow-sm">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Checked In</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {attendance.totalCheckedIn}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Checked Out</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {attendance.totalCheckedOut}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="pt-6">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Currently Present</div>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
              {attendance.totalCheckedIn - attendance.totalCheckedOut}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checked In List */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Checked In Attendees ({attendance.checkedIn.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {attendance.checkedIn.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400 text-center py-8">
              No attendees checked in yet
            </p>
          ) : (
            <div className="space-y-3">
              {attendance.checkedIn.map((entry) => (
                <div
                  key={entry.attendeeId}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {entry.attendeeName}
                    </p>
                    {entry.attendeeEmail && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {entry.attendeeEmail}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      Checked in at {formatTime(entry.checkedInAt)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCheckOut(entry.attendeeId, entry.attendeeName)}
                    className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Check Out
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Checked Out List */}
      {attendance.checkedOut.length > 0 && (
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Checked Out Attendees ({attendance.checkedOut.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendance.checkedOut.map((entry) => (
                <div
                  key={entry.attendeeId}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 opacity-75"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {entry.attendeeName}
                    </p>
                    {entry.attendeeEmail && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {entry.attendeeEmail}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      Checked in: {formatTime(entry.checkedInAt)} • Checked out: {formatTime(entry.checkedOutAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

