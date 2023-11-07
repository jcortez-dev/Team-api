import { expect, jest } from '@jest/globals';
import ClubModel from "../../../src/models/club/club.model";
import get from "../../../src/business-logic/club/get";

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
        const foundClub = null;
		ClubModel.exec.mockResolvedValue(foundClub);

		try {
			await get("1");
			fail("Expected HTTPError to be thrown");
		} catch (error) {
			expect(error instanceof HTTPError).toBe(true);
			expect(error.name).toBe("get_me_user_not_found_error");
			expect(error.msg).toBe("user not found");
			expect(error.statusCode).toBe(404);
			expect(ClubModel.get).toHaveBeenCalledWith("123");
		}
    });
  });

