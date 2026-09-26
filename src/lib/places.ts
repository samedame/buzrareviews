// Wrapper around the Google Places API (New).
//
// KNOWN LIMITATION: Place Details only returns up to 5 reviews, and Google
// does not guarantee they're the 5 most recent (it's closer to "most
// relevant"). This is a real gap in the v1 new-review-detection loop — a
// business that gets several reviews between checks could have one fall
// outside the top 5 and never get picked up. The proper fix is the Google
// Business Profile API (already applied for, gated, v1.5), which supports
// full paginated review listing. Until that clears, this polling approach
// is the documented workaround, not a permanent solution.

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!PLACES_API_KEY) throw new Error('Missing GOOGLE_PLACES_API_KEY env var');

export interface PlaceSearchResult {
  id: string;
  displayName: string;
  formattedAddress: string;
}

export async function searchBusiness(query: string): Promise<PlaceSearchResult[]> {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': PLACES_API_KEY as string,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
    },
    body: JSON.stringify({ textQuery: query }),
  });
  if (!res.ok) {
    throw new Error(`Places search failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return (data.places ?? []).map((p: any) => ({
    id: p.id,
    displayName: p.displayName?.text ?? '',
    formattedAddress: p.formattedAddress ?? '',
  }));
}

export interface PlaceReview {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  publishTime: string;
}

export async function getPlaceReviews(placeId: string): Promise<PlaceReview[]> {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': PLACES_API_KEY as string,
      'X-Goog-FieldMask': 'reviews',
    },
  });
  if (!res.ok) {
    throw new Error(`Place details failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return (data.reviews ?? []).map((r: any) => ({
    id: r.name,
    authorName: r.authorAttribution?.displayName ?? 'Anonymous',
    rating: r.rating,
    text: r.text?.text ?? '',
    publishTime: r.publishTime,
  }));
}

// The Places API doesn't return a direct "write a review" deep link field;
// this constructs the standard one from the place ID, which works reliably.
export function reviewLinkFor(placeId: string): string {
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
}
