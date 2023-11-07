import SubscriptionLogic from '../../../src/business-logic/subscription';
import { returnErrorResponse } from '../../../src/errors/error-response';
import { addValidation } from '../../../src/validations/subscription.validations';
import addSubscription from '../../../src/controllers/club/add-subscription.controller';

jest.mock('../../../src/business-logic/subscription', () => ({
  create: jest.fn(),
}));

jest.mock('../../../src/validations/subscription.validations', () => ({
  addValidation: {
    validateAsync: jest.fn(),
  },
}));

jest.mock('../../../src/errors/error-response', () => ({
  returnErrorResponse: jest.fn(),
}));

describe('addSubscription', () => {
  it('should add a subscription and return 201 if validation passes', async () => {
    const req = {
      body: { },
      params: { clubId: 'clubId' },
      userId: 'userId',
    };

    addValidation.validateAsync.mockResolvedValueOnce();

    const createdSubscription = { };
    SubscriptionLogic.create.mockResolvedValueOnce(createdSubscription);

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await addSubscription(req, res);

    expect(addValidation.validateAsync).toHaveBeenCalledWith(req.body);
    expect(SubscriptionLogic.create).toHaveBeenCalledWith({ ...req.body, clubId: req.params.clubId, userId: req.userId });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ subscription: createdSubscription });
    expect(returnErrorResponse.returnErrorResponse).not.toHaveBeenCalled();
  });

  it('should return an error response if validation fails', async () => {
    const req = {
      body: { },
      params: { clubId: 'clubId' },
      userId: 'userId',
    };

    const validationError = new Error('Validation failed');
    addValidation.validateAsync.mockRejectedValueOnce(validationError);

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await addSubscription(req, res);

    expect(addValidation.validateAsync).toHaveBeenCalledWith(req.body);
    expect(SubscriptionLogic.create).not.toHaveBeenCalled();
    expect(returnErrorResponse.returnErrorResponse).toHaveBeenCalledWith({ error: validationError, res });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it('should return an error response if SubscriptionLogic.create fails', async () => {
    const req = {
      body: { },
      params: { clubId: 'clubId' },
      userId: 'userId',
    };

    addValidation.validateAsync.mockResolvedValueOnce();

    const creationError = new Error('Subscription creation failed');
    SubscriptionLogic.create.mockRejectedValueOnce(creationError);

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await addSubscription(req, res);

    expect(addValidation.validateAsync).toHaveBeenCalledWith(req.body);
    expect(SubscriptionLogic.create).toHaveBeenCalledWith({ ...req.body, clubId: req.params.clubId, userId: req.userId });
    expect(returnErrorResponse.returnErrorResponse).toHaveBeenCalledWith({ error: creationError, res });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});
