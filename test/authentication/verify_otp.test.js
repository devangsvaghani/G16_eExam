import sinon from 'sinon';
import assert from 'assert';
import bcrypt from 'bcrypt';
import { verify_otp } from '../../backend/controller/authentication.js';
import User from '../../backend/models/user.js';
import Otp from '../../backend/models/otp.js';

describe('verify_otp API Function', function () {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'testuser@example.com',
        otp: '123456',
        password: 'newPassword123',
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

  it('should return a 400 error if email, otp, or password is missing', async () => {
    req.body = {}; // Empty request body

    await verify_otp(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWith({ message: 'Email and OTP are required' }));
  });

  it('should return a 400 error if password is too short', async () => {
    req.body.password = 'short'; // Password less than 8 characters

    await verify_otp(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWith({ message: 'Password must be at least 8 characters long.' }));
  });

  it('should return a 400 error if OTP record does not exist for the provided email', async () => {
    sinon.stub(Otp, 'findOne').resolves(null); // Mock no OTP records for the user

    await verify_otp(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWith({ message: "Account record doesn't exist" }));
  });

  it('should return a 409 error if OTP has expired', async () => {
    const mockOtpRecord = {
      email: 'testuser@example.com',
      otp: '123456',
      expiresAt: Date.now() - 1000, // Expired OTP (time in the past)
    };

    sinon.stub(Otp, 'findOne').resolves(mockOtpRecord); // Mock expired OTP
    sinon.stub(Otp, 'deleteMany').resolves(); // Mock deletion of OTP records

    await verify_otp(req, res);

    assert(res.status.calledWith(409));
    assert(res.json.calledWith({ message: "Code has expired. Please request again" }));
  });

  it('should return a 401 error if OTP is incorrect', async () => {
    const mockOtpRecord = {
      email: 'testuser@example.com',
      otp: '654321', // Different OTP than provided
      expiresAt: Date.now() + 600000, // Valid OTP (expires in 10 minutes)
    };

    sinon.stub(Otp, 'findOne').resolves(mockOtpRecord); // Mock existing OTP
    sinon.stub(Otp, 'deleteMany').resolves(); // Mock deletion of OTP records

    await verify_otp(req, res);

    assert(res.status.calledWith(401));
    assert(res.json.calledWith({ message: "Invalid OTP. Please try again." }));
  });

  it('should successfully change the password if OTP is valid', async () => {
    const mockOtpRecord = {
      email: 'testuser@example.com',
      otp: '123456',
      expiresAt: Date.now() + 600000, // Valid OTP
    };

    sinon.stub(Otp, 'findOne').resolves(mockOtpRecord); // Mock existing valid OTP
    sinon.stub(Otp, 'deleteMany').resolves(); // Mock OTP deletion
    sinon.stub(User, 'findOneAndUpdate').resolves(); // Mock user update

    const bcryptHashStub = sinon.stub(bcrypt, 'hash').resolves('hashedPassword123'); // Mock password hashing

    await verify_otp(req, res);

    assert(res.status.calledWith(200));
    assert(res.json.calledWith({ message: 'Password changed successfully.' }));

    bcryptHashStub.restore();
  });

  it('should return 500 error for server issues', async () => {
    sinon.stub(Otp, 'findOne').throws(new Error('Database error')); // Simulate error in Otp.findOne

    await verify_otp(req, res);

    assert(res.status.calledWith(500));
    assert(res.json.calledWith({ message: 'Database error' }));
  });
});
