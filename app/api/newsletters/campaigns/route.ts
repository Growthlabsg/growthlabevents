import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import { getNewsletterCampaigns, getCampaignAnalytics } from '@/lib/newsletters';

// GET /api/newsletters/campaigns - Get campaigns
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const newsletterId = searchParams.get('newsletterId');
    const campaignId = searchParams.get('campaignId');

    if (campaignId) {
      const campaign = getCampaignAnalytics(campaignId);
      if (!campaign) {
        return jsonResponse(
          { success: false, message: 'Campaign not found' },
          404
        );
      }
      return jsonResponse({ success: true, data: campaign });
    }

    if (newsletterId) {
      const campaigns = getNewsletterCampaigns(newsletterId);
      return jsonResponse({ success: true, data: campaigns });
    }

    return jsonResponse(
      {
        success: false,
        message: 'Missing newsletterId or campaignId parameter',
      },
      400
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get campaigns',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
