import sinon from 'sinon';
import assert from 'assert';
import { resend_otp } from '../../backend/controller/authentication.js';
import User from '../../backend/models/user.js';
import Otp from '../../backend/models/otp.js';
import * as authUtils from '../../backend/utils/authentication.js'; // Import the entire module
import * as globalFunctions from '../../backend/utils/authentication.js'; // Assuming generate_otp is here

describe('resend_otp API Function', function () {
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

  it('should return a 400 error if email is missing', async () => {
    req.body = {};

    await resend_otp(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWith({ message: 'An email is required.' }));
  });

  it('should return a 400 error if email format is invalid', async () => {
    req.body.email = 'invalidemail';

    await resend_otp(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWith({ message: 'Invalid email format.' }));
  });

  it('should return a 401 error if no account is found with the provided email', async () => {
    sinon.stub(User, 'findOne').resolves(null);

    await resend_otp(req, res);

    assert(res.status.calledWith(401));
    assert(res.json.calledWith({ message: 'No account found with the provided email.' }));
  });

  it('should return a 500 error if there is a server issue', async () => {
    sinon.stub(User, 'findOne').throws(new Error('Database error'));

    await resend_otp(req, res);

    assert(res.status.calledWith(500));
    assert(res.json.calledWith({ message: 'Database error' }));
  });
});
