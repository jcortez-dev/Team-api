import MemberLogic from '../../../src/business-logic/member';
import { returnErrorResponse } from '../../../src/errors/error-response';
import { addValidation } from '../../../src/validations/member.validations';
import addMember from '../../../src/controllers/club/add-member.controller'; 

jest.mock('../../../src/business-logic/member', () => ({
  create: jest.fn(),
}));

jest.mock('../../../src/validations/member.validations', () => ({
  addValidation: {
    validateAsync: jest.fn(),
  },
}));

jest.mock('../../../src/errors/error-response', () => ({
  returnErrorResponse: jest.fn(),
}));

describe('addMember', () => {
  it('should add a member and return 201 if validation passes', async () => {
    const req = {
      body: { },
      params: { clubId: 'tuIdDeClub' },
      userId: 'tuUserId',
    };

    addValidation.validateAsync.mockResolvedValueOnce();

    const createdMember = { };
    MemberLogic.create.mockResolvedValueOnce(createdMember);

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await addMember(req, res);

    expect(addValidation.validateAsync).toHaveBeenCalledWith(req.body);
    expect(MemberLogic.create).toHaveBeenCalledWith({ ...req.body, clubId: req.params.clubId, userId: req.userId });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ member: createdMember });
    expect(returnErrorResponse.returnErrorResponse).not.toHaveBeenCalled();
  });

  it('should return an error response if validation fails', async () => {
    const req = {
      body: { },
      params: { clubId: 'tuIdDeClub' },
      userId: 'tuUserId',
    };

    const validationError = new Error('Validation failed');
    addValidation.validateAsync.mockRejectedValueOnce(validationError);

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await addMember(req, res);

    expect(addValidation.validateAsync).toHaveBeenCalledWith(req.body);
    expect(MemberLogic.create).not.toHaveBeenCalled();
    expect(returnErrorResponse.returnErrorResponse).toHaveBeenCalledWith({ error: validationError, res });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should return an error response if MemberLogic.create fails', async () => {
    const req = {
      body: { },
      params: { clubId: 'tuIdDeClub' },
      userId: 'tuUserId',
    };

    addValidation.validateAsync.mockResolvedValueOnce();

    const creationError = new Error('Member creation failed');
    MemberLogic.create.mockRejectedValueOnce(creationError);

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await addMember(req, res);

    expect(addValidation.validateAsync).toHaveBeenCalledWith(req.body);
    expect(MemberLogic.create).toHaveBeenCalledWith({ ...req.body, clubId: req.params.clubId, userId: req.userId });
    expect(returnErrorResponse.returnErrorResponse).toHaveBeenCalledWith({ error: creationError, res });
    expect(res.status).not.toHaveBeenCalled(); 
    expect(res.send).not.toHaveBeenCalled();
  });
});
