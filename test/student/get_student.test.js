import sinon from 'sinon';
import assert from 'assert';
import { get_student } from '../../backend/controller/student.js';
import User from '../../backend/models/user.js';
import Student from '../../backend/models/student.js';

describe('get_student API Function', () => {
    let res;
    let req;
    let userFindOneStub;
    let studentFindOneStub;

    beforeEach(() => {
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        };

        req = {
            params: { username: 'student123' },
            user: { username: 'student123', role: 'Student' },
        };

        userFindOneStub = sinon.stub(User, 'findOne');
        studentFindOneStub = sinon.stub(Student, 'findOne');
    });

    afterEach(() => {
        if (userFindOneStub.restore) userFindOneStub.restore();
        if (studentFindOneStub.restore) studentFindOneStub.restore();
    });

    it('should return 400 if the user is unauthorized (role is Examiner)', async () => {
        req.user.role = 'Examiner';

        await get_student(req, res);

        assert(res.status.calledOnceWith(400));
        assert(res.json.calledWith({ message: 'Unathorized Access' }));
    });

    it('should return 400 if the user is trying to access another user\'s profile', async () => {
        req.user.username = 'admin123';

        await get_student(req, res);

        assert(res.status.calledOnceWith(400));
        assert(res.json.calledWith({ message: 'Unathorized Access' }));
    });

    it('should return 500 if there is an error in fetching the student profile', async () => {
        const error = new Error('Database error');
        userFindOneStub.throws(error);

        await get_student(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWith({ message: 'Database error' }));
    });
});
