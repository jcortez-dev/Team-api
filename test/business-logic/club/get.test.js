import { expect, jest } from '@jest/globals';
import ClubModel from "../../../src/models/club/club.model";
import get from "../../../src/business-logic/club/get";
import HTTPError from '../../../src/errors/http.error';

jest.mock("../../../src/models/club/club.model");

describe('getClub', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Should return a club when it exists', async () => {
      ClubModel.findById.mockResolvedValue({ _id: 'validClubId', name: 'Club Name' });

      const clubId = 'validClubId';
      const club = await get(clubId);
      expect(ClubModel.findById).toHaveBeenCalledWith(clubId);

      expect(club).toEqual({ _id: 'validClubId', name: 'Club Name' });
    });

    it('Should throw a 404 error when the club does not exist', async () => {
        jest.spyOn(ClubModel, 'findById').mockResolvedValue(null);

		try {
			await get("123");
			fail("Expected HTTPError to be thrown");
		} catch (error) {
			expect(error instanceof HTTPError).toBe(true);
			expect(error.name).toBe("club_not_found_error");
			expect(error.message).toBe("Club not found");
			expect(error.statusCode).toBe(404);
			expect(ClubModel.get).toHaveBeenCalledWith("123");
		}
    });
  });