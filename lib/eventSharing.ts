// Event sharing utilities

/**
 * Share event to social media or copy link
 */
export function shareEvent(eventId: string, title: string, description: string): void {
  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/events/${eventId}`
    : '';

  const shareData = {
    title: title,
    text: description,
    url: url,
  };

  // Use Web Share API if available (mobile)
  if (typeof window !== 'undefined' && navigator.share) {
    navigator.share(shareData).catch(err => {
      console.error('Error sharing:', err);
      fallbackShare(url, title);
    });
  } else {
    fallbackShare(url, title);
  }
}

/**
 * Fallback sharing method (copy to clipboard)
 */
function fallbackShare(url: string, title: string): void {
  if (typeof window !== 'undefined') {
    navigator.clipboard.writeText(`${title}\n${url}`).then(() => {
      // You could show a toast notification here
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
      // Fallback: show the URL
      prompt('Copy this link:', url);
    });
  }
}

/**
 * Share to Twitter
 */
export function shareToTwitter(eventId: string, title: string): void {
  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/events/${eventId}`
    : '';
  const text = encodeURIComponent(`Check out this event: ${title}`);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
}

/**
 * Share to Facebook
 */
export function shareToFacebook(eventId: string): void {
  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/events/${eventId}`
    : '';
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

/**
 * Share to LinkedIn
 */
export function shareToLinkedIn(eventId: string, title: string, description: string): void {
  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/events/${eventId}`
    : '';
  const params = new URLSearchParams({
    url: url,
    title: title,
    summary: description,
  });
  window.open(`https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`, '_blank');
}

/**
 * Copy event link to clipboard
 */
export function copyEventLink(eventId: string): Promise<void> {
  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/events/${eventId}`
    : '';
  return navigator.clipboard.writeText(url);
}

