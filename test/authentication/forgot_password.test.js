import sinon from 'sinon';
import assert from 'assert';
import { forgot_password } from '../../backend/controller/authentication.js';
import User from '../../backend/models/user.js';
import Otp from '../../backend/models/otp.js';
import * as emailUtils from '../../backend/utils/authentication.js';

describe('forgot_password API Function', function () {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'testuser@example.com',
      },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return a 400 error if email is not provided', async () => {
    req.body = {};

    await forgot_password(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWith({ message: 'An email is required.' }));
  });

  it('should return a 400 error for invalid email format', async () => {
    req.body.email = 'invalidemail';

    await forgot_password(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWith({ message: 'Invalid email format.' }));
  });

  it('should return a 401 error if no user is found with the provided email', async () => {
    sinon.stub(User, 'findOne').resolves(null);

    await forgot_password(req, res);

    assert(res.status.calledWith(401));
    assert(res.json.calledWith({ message: 'No account found with the provided email.' }));
  });

  it('should return 200 if OTP is already sent', async () => {
    const mockOtp = { email: 'testuser@example.com' };

    sinon.stub(User, 'findOne').resolves({ email: 'testuser@example.com' });
    sinon.stub(Otp, 'findOne').resolves(mockOtp);

    await forgot_password(req, res);

    assert(res.status.calledWith(200));
    assert(res.json.calledWith({ message: 'Otp already sent' }));
  });

  it('should return 500 error for server issues', async () => {
    sinon.stub(User, 'findOne').throws(new Error('Database error'));

    await forgot_password(req, res);

    assert(res.status.calledWith(500));
    assert(res.json.calledWith({ message: 'Database error' }));
  });
});
