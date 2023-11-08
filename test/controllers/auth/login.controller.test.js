import AuthLogic from '../../../src/business-logic/auth';
import { returnErrorResponse } from '../../../src/business-logic/auth';
import { loginValidation } from '../../../src/validations/auth.validations';
import login from '../../../src/controllers/auth/login.controller';

jest.mock('../../../src/business-logic/auth', () => ({
  login: jest.fn(),
}));

jest.mock('../../../src/business-logic/auth', () => ({
  returnErrorResponse: jest.fn(),
}));

jest.mock('../../../src/validations/auth.validations', () => ({
  loginValidation: {
    validateAsync: jest.fn(),
  },
}));

describe('Controller: Auth: Login', () => {
  it('Should return an error when email is not defined', async () => {
    const req = {
      body: {},
    };

    const validationError = new Error('Validation failed');
    loginValidation.validateAsync.mockRejectedValueOnce(validationError);

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await login(req, res);

    expect(loginValidation.validateAsync).toHaveBeenCalledWith(req.body);
    expect(AuthLogic.login).not.toHaveBeenCalled();
    expect(returnErrorResponse.returnErrorResponse).toHaveBeenCalledWith({ error: validationError, res });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});