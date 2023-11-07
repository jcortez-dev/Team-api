import MemberLogic from '../../../src/business-logic/member';
import { returnErrorResponse } from '../../../src/errors/error-response';
import listMembers from '../../../src/controllers/club/list-members.controller';

jest.mock('../../../src/business-logic/member', () => ({
  listByClub: jest.fn(),
}));

jest.mock('../../../src/errors/error-response', () => ({
  returnErrorResponse: jest.fn(),
}));

describe('listMembers', () => {
  it('should return a list of members if MemberLogic.listByClub is successful', async () => {
    const req = {
      userId: 'userId',
      params: { clubId: 'clubId' },
    };

    const membersList = [{ }, { }];
    MemberLogic.listByClub.mockResolvedValueOnce(membersList);

    const res = {
      send: jest.fn(),
    };

    await listMembers(req, res);

    expect(MemberLogic.listByClub).toHaveBeenCalledWith({ clubId: req.params.clubId, userId: req.userId });
    expect(res.send).toHaveBeenCalledWith({ members: membersList });
    expect(returnErrorResponse.returnErrorResponse).not.toHaveBeenCalled();
  });

  it('should return an error response if MemberLogic.listByClub fails', async () => {
    const req = {
      userId: 'userId',
      params: { clubId: 'clubId' },
    };

    const error = new Error('Error retrieving members');
    MemberLogic.listByClub.mockRejectedValueOnce(error);

    const res = {
      send: jest.fn(),
    };

    await listMembers(req, res);

    expect(MemberLogic.listByClub).toHaveBeenCalledWith({ clubId: req.params.clubId, userId: req.userId });
    expect(returnErrorResponse.returnErrorResponse).toHaveBeenCalledWith({ error, res });
    expect(res.send).not.toHaveBeenCalled();
  });
});
