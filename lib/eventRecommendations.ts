// Event recommendations system

import { Event } from '@/types/event';
import { getFavoriteCategories } from '@/lib/favoriteCategories';

/**
 * Get recommended events based on user's interests
 */
export function getRecommendedEvents(
  allEvents: Event[],
  userInterestedEvents: string[] = [],
  excludeEventId?: string,
  userId: string = 'current-user'
): Event[] {
  // Filter out the current event if provided
  let recommendations = allEvents.filter(
    event => event.id !== excludeEventId && event.status === 'upcoming'
  );

  // Get user's favorite categories
  const favoriteCategories = getFavoriteCategories(userId);

  // If user has interested events, prioritize similar categories
  if (userInterestedEvents.length > 0) {
    const interestedEvents = allEvents.filter(e => userInterestedEvents.includes(e.id));
    const categories = new Set<string>();
    
    interestedEvents.forEach(event => {
      // Extract category from title/description
      const title = event.title.toLowerCase();
      const desc = event.description.toLowerCase();
      if (title.includes('ai') || desc.includes('ai')) categories.add('ai');
      if (title.includes('hackathon') || desc.includes('hackathon')) categories.add('hackathon');
      if (title.includes('networking') || desc.includes('networking')) categories.add('networking');
      if (title.includes('workshop') || desc.includes('workshop')) categories.add('workshop');
      
      // Also check event tags
      if (event.tags && event.tags.length > 0) {
        event.tags.forEach(tag => categories.add(tag.toLowerCase()));
      }
    });

    // Add favorite categories to the set
    favoriteCategories.forEach(cat => categories.add(cat.toLowerCase()));

    // Sort by relevance
    recommendations.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const aDesc = a.description.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const bDesc = b.description.toLowerCase();

      let aScore = 0;
      let bScore = 0;

      categories.forEach(cat => {
        if (aTitle.includes(cat) || aDesc.includes(cat)) aScore++;
        if (bTitle.includes(cat) || bDesc.includes(cat)) bScore++;
        
        // Check tags
        if (a.tags && a.tags.some(tag => tag.toLowerCase() === cat)) aScore += 2;
        if (b.tags && b.tags.some(tag => tag.toLowerCase() === cat)) bScore += 2;
      });

      // Also consider popularity
      aScore += a.registeredCount / 100;
      bScore += b.registeredCount / 100;

      return bScore - aScore;
    });
  } else if (favoriteCategories.length > 0) {
    // If user has favorite categories but no interested events, prioritize those
    recommendations.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const aDesc = a.description.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const bDesc = b.description.toLowerCase();

      let aScore = 0;
      let bScore = 0;

      favoriteCategories.forEach(cat => {
        const catLower = cat.toLowerCase();
        if (aTitle.includes(catLower) || aDesc.includes(catLower)) aScore++;
        if (bTitle.includes(catLower) || bDesc.includes(catLower)) bScore++;
        
        // Check tags
        if (a.tags && a.tags.some(tag => tag.toLowerCase() === catLower)) aScore += 2;
        if (b.tags && b.tags.some(tag => tag.toLowerCase() === catLower)) bScore += 2;
      });

      // Also consider popularity
      aScore += a.registeredCount / 100;
      bScore += b.registeredCount / 100;

      return bScore - aScore;
    });
  } else {
    // If no user preferences, show most popular upcoming events
    recommendations.sort((a, b) => b.registeredCount - a.registeredCount);
  }

  return recommendations.slice(0, 6); // Return top 6 recommendations
}

/**
 * Get events similar to a given event
 */
export function getSimilarEvents(event: Event, allEvents: Event[]): Event[] {
  const eventTitle = event.title.toLowerCase();
  const eventDesc = event.description.toLowerCase();
  
  // Extract keywords
  const keywords: string[] = [];
  if (eventTitle.includes('ai') || eventDesc.includes('ai')) keywords.push('ai');
  if (eventTitle.includes('hackathon') || eventDesc.includes('hackathon')) keywords.push('hackathon');
  if (eventTitle.includes('networking') || eventDesc.includes('networking')) keywords.push('networking');
  if (eventTitle.includes('workshop') || eventDesc.includes('workshop')) keywords.push('workshop');

  const similar = allEvents
    .filter(e => e.id !== event.id && e.status === 'upcoming')
    .map(e => {
      const title = e.title.toLowerCase();
      const desc = e.description.toLowerCase();
      let score = 0;
      
      keywords.forEach(keyword => {
        if (title.includes(keyword) || desc.includes(keyword)) score++;
      });

      // Same location adds to score
      if (e.location === event.location) score += 0.5;

      return { event: e, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => item.event);

  return similar;
}

