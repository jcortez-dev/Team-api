import { expect, jest } from '@jest/globals';
import ClubModel from '../../../src/models/club/club.model';
import list from '../../../src/business-logic/club/list';

jest.mock('../../../src/models/club/club.model');

describe('Business logic: List club', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('Should return a empty list', async () => {
        ClubModel.find.mockReturnValue([]);
    
        const result = await list();
    
        expect(ClubModel.find).toHaveBeenCalled();
        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
      });
});




