const API_KEY = '51463831-466a64c9262f6e860993cdb47';
const BASE_URL = 'https://pixabay.com/api/';
export const PER_PAGE = 15;

export async function getImagesByQuery(query, page = 1) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${PER_PAGE}&page=${page}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }

  return await response.json();
}