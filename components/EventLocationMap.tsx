'use client';

interface EventLocationMapProps {
  location: string;
  locationType?: 'physical' | 'online' | 'hybrid';
}

export function EventLocationMap({ location, locationType = 'physical' }: EventLocationMapProps) {
  if (locationType === 'online') {
    return (
      <div className="w-full h-64 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Online Event</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{location}</p>
        </div>
      </div>
    );
  }

  // Encode location for Google Maps
  const encodedLocation = encodeURIComponent(location);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6d-s6U4kR1F9J5E&q=${encodedLocation}`;

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
        title={location}
      />
      <div className="mt-2">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}

