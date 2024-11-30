import sinon from 'sinon';
import assert from 'assert';
import { update_student } from '../../backend/controller/student.js';
import User from '../../backend/models/user.js';
import Student from '../../backend/models/student.js';

describe('update_student API Function', () => {
    let res;
    let req;
    let userFindOneAndUpdateStub;
    let studentFindOneAndUpdateStub;
    let studentSaveStub;

    beforeEach(() => {
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        };

        req = {
            params: { username: 'student123' },
            body: {
                firstname: 'John',
                lastname: 'Doe',
                middlename: 'A',
                dob: '1995-01-01',
                mobileno: '1234567890',
                email: 'john.doe@example.com',
                gender: 'Male',
                batch: '2024',
                branch: 'Computer Science',
                graduation: '2024',
            },
            user: { username: 'student123', role: 'Student' },
        };

        userFindOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate');
        studentFindOneAndUpdateStub = sinon.stub(Student, 'findOneAndUpdate');
        studentSaveStub = sinon.stub().resolves();
    });

    afterEach(() => {
        if (userFindOneAndUpdateStub.restore) userFindOneAndUpdateStub.restore();
        if (studentFindOneAndUpdateStub.restore) studentFindOneAndUpdateStub.restore();
    });

    it('should return 200 and updated student data on successful update', async () => {
        userFindOneAndUpdateStub.resolves({
            firstname: 'John',
            lastname: 'Doe',
            middlename: 'A',
            dob: new Date('1995-01-01'),
            mobileno: '1234567890',
            email: 'john.doe@example.com',
            gender: 'Male',
        });
        studentFindOneAndUpdateStub.resolves({
            batch: '2024',
            branch: 'Computer Science',
            graduation: '2024',
            save: studentSaveStub,
        });

        await update_student(req, res);

        assert(res.status.calledOnceWith(200));
    });

    it('should return 400 if required fields are missing', async () => {
        req.body.firstname = undefined;

        await update_student(req, res);

        assert(res.status.calledOnceWith(400));
        assert(res.json.calledWith({ message: 'All fields are required!' }));
    });

    it('should return 400 if the email format is invalid', async () => {
        req.body.email = 'invalid-email';

        await update_student(req, res);

        assert(res.status.calledOnceWith(400));
        assert(res.json.calledWith({ message: 'Invalid email format.' }));
    });

    it('should return 400 if the mobile number format is invalid', async () => {
        req.body.mobileno = '12345';

        await update_student(req, res);

        assert(res.status.calledOnceWith(400));
        assert(res.json.calledWith({ message: 'Mobile number must be exactly 10 digits.' }));
    });

    it('should return 400 if the date of birth format is invalid', async () => {
        req.body.dob = '01-01-1995';

        await update_student(req, res);

        assert(res.status.calledOnceWith(400));
        assert(res.json.calledWith({ message: 'Invalid date of birth format. Use YYYY-MM-DD.' }));
    });

    it('should return 400 if the user is unauthorized (not Admin or incorrect username)', async () => {
        req.user.role = 'Student';
        req.user.username = 'student123';
        req.params.username = 'differentUsername';

        await update_student(req, res);

        assert(res.status.calledOnceWith(400));
        assert(res.json.calledWith({ message: 'Unathorized Access' }));
    });

    it('should return 500 if there is an error in updating the student data', async () => {
        const error = new Error('Database error');
        userFindOneAndUpdateStub.throws(error);

        await update_student(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWith({ message: 'Database error' }));
    });
});
