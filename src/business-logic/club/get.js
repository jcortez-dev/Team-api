import ClubModel from '../../models/club/club.model';
import HTTPError from '../../errors/http.error';

/**
 * Get Club
 * @param {string} clubId - Club id to find
 * @throws {HTTPError} 404 error if the club doesnt exists
 */
export default async function get(clubId) {
  const club = await ClubModel.findById(clubId);
  if (!club) {
    const error = new HTTPError({
      name: 'club_not_found_error',
      message: 'Club not found',
      statusCode: 404,
    });
    throw error;
  }
  return club;
}
