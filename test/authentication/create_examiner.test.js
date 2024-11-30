import sinon from 'sinon';
import assert from 'assert';
import bcrypt from 'bcrypt';
import { create_examiner } from '../../backend/controller/authentication.js';
import User from '../../backend/models/user.js';
import Examiner from '../../backend/models/examiner.js';

describe('create_examiner API Function', function () {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: 'E123456',
        firstname: 'John',
        lastname: 'Doe',
        middlename: 'M',
        dob: '1980-01-01',
        mobileno: '1234567890',
        email: 'johndoe@example.com',
        gender: 'Male',
      },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore(); // Restore all mocks/stubs after each test
  });

  it('should return a 200 response with the examiner information for valid inputs', async () => {
    const saveUserStub = sinon.stub(User.prototype, 'save').resolves({
      username: 'E123456',
      firstname: 'John',
      lastname: 'Doe',
      email: 'johndoe@example.com',
    });
    const saveExaminerStub = sinon.stub(Examiner.prototype, 'save').resolves();
    const bcryptHashStub = sinon.stub(bcrypt, 'hash').resolves('hashedPassword123');
    const countDocumentsStub = sinon.stub(Examiner, 'countDocuments').resolves(10); // Mock countDocuments if needed
    
    // Call create_examiner
    await create_examiner(req, res);
  
    // Assert the expected response
    assert(res.status.calledWith(200));
    assert(res.json.calledWithMatch({
      message: 'Examiner created successfully',
      user: {
        username: 'E123456',
        firstname: 'John',
        lastname: 'Doe',
        email: 'johndoe@example.com',
      },
    }));

    // Restore stubs
    saveUserStub.restore();
    saveExaminerStub.restore();
    bcryptHashStub.restore();
    countDocumentsStub.restore();
  });

  
  it('should return a 400 error if required fields are missing', async () => {
    req.body = {}; // Empty body to trigger validation error

    await create_examiner(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWithMatch({ message: 'All fields are required!' }));
  });

  it('should return a 400 error for invalid email format', async () => {
    req.body.email = 'invalidemail';

    await create_examiner(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWithMatch({ message: 'Invalid email format.' }));
  });

  it('should return a 400 error for invalid mobile number format', async () => {
    req.body.mobileno = '12345'; // Invalid mobile number

    await create_examiner(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWithMatch({ message: 'Mobile number must be exactly 10 digits.' }));
  });

  it('should return a 400 error for invalid date of birth format', async () => {
    req.body.dob = '01-01-1980'; // Invalid date format

    await create_examiner(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWithMatch({ message: 'Invalid date of birth format. Use YYYY-MM-DD.' }));
  });

  it('should return a 400 error for invalid date of birth values', async () => {
    req.body.dob = '1980-02-30'; // Invalid date value (Feb 30th doesn't exist)

    await create_examiner(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWithMatch({ message: 'Invalid date of birth values.' }));
  });

  it('should return a 500 error if there is a server error', async () => {
    const errorMessage = 'Database Error';

    sinon.stub(User.prototype, 'save').rejects(new Error(errorMessage)); // Mocking a database error

    await create_examiner(req, res);

    assert(res.status.calledWith(500));
    assert(res.json.calledWithMatch({ message: errorMessage }));

    User.prototype.save.restore();
  });
});
