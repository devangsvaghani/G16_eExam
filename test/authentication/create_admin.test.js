import sinon from 'sinon';
import assert from 'assert';
import bcrypt from 'bcrypt';
import { create_admin } from '../../backend/controller/authentication.js';
import User from '../../backend/models/user.js';

describe('create_admin API Function', function () {
  this.timeout(10000);

  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: 'admin123',
        firstname: 'Admin',
        mobileno: '1234567890',
        email: 'admin@example.com',
        password: 'adminPassword123',
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

  it('should return a 200 response with a success message for valid inputs', async () => {
    const saveUserStub = sinon.stub(User.prototype, 'save').resolves();
    const bcryptHashStub = sinon.stub(bcrypt, 'hash').resolves('hashedAdminPassword123');

    await create_admin(req, res);

    assert(res.status.calledWith(200));
    assert(res.json.calledWithMatch({ message: 'Admin created successfully' }));

    saveUserStub.restore();
    bcryptHashStub.restore();
  });

  it('should return a 400 error if required fields are missing', async () => {
    req.body = {};

    await create_admin(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWithMatch({ message: 'All fields are required!' }));
  });

  it('should return a 400 error for invalid email format', async () => {
    req.body.email = 'invalidemail';

    await create_admin(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWithMatch({ message: 'Invalid email format.' }));
  });

  it('should return a 400 error for invalid mobile number format', async () => {
    req.body.mobileno = '12345';

    await create_admin(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWithMatch({ message: 'Mobile number must be exactly 10 digits.' }));
  });

  it('should return a 500 error if there is a server error', async () => {
    const errorMessage = 'Database Error';

    sinon.stub(User.prototype, 'save').rejects(new Error(errorMessage));

    await create_admin(req, res);

    assert(res.status.calledWith(500));
    assert(res.json.calledWithMatch({ message: errorMessage }));

    User.prototype.save.restore();
  });
});
