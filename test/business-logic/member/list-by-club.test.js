import MemberModel from '../../../src/models/member/member.model.js';
import ClubLogic from '../../../src/business-logic/club';
import listByClub from '../../../src/business-logic/member/list-by-club';

jest.mock('../../../src/models/member/member.model.js', () => ({
  find: jest.fn(),
}));

jest.mock('../../../src/business-logic/club', () => ({
  checkIfUserIsAdmin: jest.fn(),
}));

describe('listByClub', () => {
  it('should return a list of members when user is admin', async () => {
    ClubLogic.checkIfUserIsAdmin.mockResolvedValueOnce();

    const clubId = 'tuIdDeClub';
    const userId = 'tuUserId';
    const membersData = [{ name: 'Member1' }, { name: 'Member2' }];
    MemberModel.find.mockResolvedValueOnce(membersData);

    const result = await listByClub({ clubId, userId });

    expect(result).toEqual(membersData);
    expect(ClubLogic.checkIfUserIsAdmin).toHaveBeenCalledWith({ clubId, userId });
    expect(MemberModel.find).toHaveBeenCalledWith({ clubId });
  });
});