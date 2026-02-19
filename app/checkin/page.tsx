'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HorizontalNav } from '@/components/layout/HorizontalNav';
import { Button } from '@/components/ui/Button';
import { ChatButton } from '@/components/ChatButton';
import { QRCode } from '@/components/QRCode';

interface CheckInResult {
  success: boolean;
  message: string;
  attendeeName?: string;
  eventName?: string;
  checkInTime?: string;
}

export default function CheckInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [scannedCode, setScannedCode] = useState<string>('');
  const [manualCode, setManualCode] = useState('');
  const [checkInResult, setCheckInResult] = useState<CheckInResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
      alert('Unable to access camera. Please check permissions.');
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

  // Handle QR code scan (simulated - in production use a QR scanner library)
  const handleQRScan = (code: string) => {
    setScannedCode(code);
    stopScanning();
    processCheckIn(code);
  };

  // Process check-in
  const processCheckIn = async (code: string) => {
    try {
      const parts = code.split(':');
      
      // Handle event registration QR code: event:eventId:registrationId:attendeeName:email
      if (parts.length >= 4 && parts[0] === 'event') {
        const [, eventId, registrationId, attendeeName, email] = parts;
        
        // Call check-in API
        const response = await fetch(`/api/events/${eventId}/checkin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            qrCode: code,
            registrationId: registrationId,
            email: email || undefined,
            attendeeName: attendeeName,
            action: 'checkin',
          }),
        });

        const data = await response.json();
        
        if (data.success) {
          setCheckInResult({
            success: true,
            message: 'Check-in successful!',
            attendeeName: attendeeName,
            eventName: 'Event',
            checkInTime: new Date().toLocaleString()
          });
        } else {
          setCheckInResult({
            success: false,
            message: data.message || 'Check-in failed'
          });
        }
      }
      // Handle user profile QR code: user:username:name
      else if (parts.length === 3 && parts[0] === 'user') {
        const [, username, name] = parts;

        // For user QR codes, we need to know which event to check into
        // This would typically be selected by the host
        setCheckInResult({
          success: false,
          message: 'Please use event registration QR code, or select an event first'
        });
      } else {
        setCheckInResult({
          success: false,
          message: 'Invalid QR code format. Please scan a valid event registration QR code.'
        });
        return;
      }

      // Reset after 3 seconds
      setTimeout(() => {
        setCheckInResult(null);
        setScannedCode('');
        setManualCode('');
      }, 3000);
    } catch (error) {
      setCheckInResult({
        success: false,
        message: 'Error processing check-in. Please try again.'
      });
    }
  };

  // Handle manual check-in
  const handleManualCheckIn = () => {
    if (!manualCode.trim()) {
      alert('Please enter a QR code');
      return;
    }
    processCheckIn(manualCode.trim());
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <HorizontalNav />
      
      <main className="flex-1">
        <div className="container-elegant py-8 sm:py-10 lg:py-12">
          {/* Header */}
          <div className="mb-8 sm:mb-10 lg:mb-12 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight">
              Check-in System
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Scan QR codes or manually enter codes to check in attendees
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 sm:mb-8 max-w-md mx-auto sm:mx-0">
            <button
              onClick={() => {
                setMode('scan');
                stopScanning();
                setCheckInResult(null);
              }}
              className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
                mode === 'scan'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Scan QR Code
            </button>
            <button
              onClick={() => {
                setMode('manual');
                stopScanning();
                setCheckInResult(null);
              }}
              className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all ${
                mode === 'manual'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Manual Entry
            </button>
          </div>

          {/* Scan Mode */}
          {mode === 'scan' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
                {!isScanning ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                      <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      Ready to Scan
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Click the button below to start scanning QR codes
                    </p>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={startScanning}
                      className="btn-elegant"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={stopScanning}
                        className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Stop Scanning
                      </Button>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Position the QR code within the frame
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Demo: Manual QR Code Input for Testing */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <strong>Demo:</strong> For testing, you can manually trigger a check-in:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    placeholder="event:eventId:registrationId:name:email"
                    className="flex-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => scannedCode && handleQRScan(scannedCode)}
                  >
                    Test Check-in
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Manual Entry Mode */}
          {mode === 'manual' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm max-w-2xl mx-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Enter QR Code
                  </label>
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="event:eventId:registrationId:name:email"
                    className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleManualCheckIn}
                  className="w-full btn-elegant"
                >
                  Check In
                </Button>
              </div>
            </div>
          )}

          {/* Check-in Result */}
          {checkInResult && (
            <div className={`mt-6 p-6 rounded-xl border-2 ${
              checkInResult.success
                ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                : 'bg-red-50 dark:bg-red-900/20 border-red-500'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  checkInResult.success ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {checkInResult.success ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-1 ${
                    checkInResult.success ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
                  }`}>
                    {checkInResult.message}
                  </h3>
                  {checkInResult.success && (
                    <div className="space-y-1 text-sm text-green-800 dark:text-green-200">
                      {checkInResult.attendeeName && (
                        <p><strong>Attendee:</strong> {checkInResult.attendeeName}</p>
                      )}
                      {checkInResult.eventName && (
                        <p><strong>Event:</strong> {checkInResult.eventName}</p>
                      )}
                      {checkInResult.checkInTime && (
                        <p><strong>Time:</strong> {checkInResult.checkInTime}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 sm:mt-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              How to Use
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span><strong>Scan Mode:</strong> Use your device camera to scan QR codes from attendee profiles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span><strong>Manual Mode:</strong> Enter QR code data manually if scanning is unavailable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span><strong>Event QR Codes:</strong> Generated by GrowthLab platform when you register for an event (format: event:eventId:registrationId:name:email)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-1">•</span>
                <span><strong>User QR Codes:</strong> Available in your profile settings for general check-in</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      
      {/* Chat Button */}
      <ChatButton />
    </div>
  );
}

