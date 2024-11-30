import sinon from 'sinon';
import assert from 'assert';
import { delete_student } from '../../backend/controller/student.js';
import Student from '../../backend/models/student.js';
import User from '../../backend/models/user.js';

describe('delete_student API Function', () => {
    let res;
    let req;
    let studentDeleteStub;
    let userDeleteStub;

    beforeEach(() => {
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        };

        req = {
            params: { username: 'student123' },
        };

        studentDeleteStub = sinon.stub(Student, 'deleteOne');
        userDeleteStub = sinon.stub(User, 'deleteOne');
    });

    afterEach(() => {
        if (studentDeleteStub.restore) studentDeleteStub.restore();
        if (userDeleteStub.restore) userDeleteStub.restore();
    });

    it('should return 200 and success message when student and user are deleted successfully', async () => {
        studentDeleteStub.resolves({ deletedCount: 1 });
        userDeleteStub.resolves({ deletedCount: 1 });

        await delete_student(req, res);

        assert(res.status.calledOnceWith(200));
        assert(res.json.calledWith({ message: 'Student and associated User deleted successfully.' }));
    });

    it('should return 404 if username is not found in the request parameters', async () => {
        req.params.username = null;

        await delete_student(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: 'Username not found' }));
    });

    it('should return 500 if there is an error during the deletion process', async () => {
        const error = new Error('Database error');
        studentDeleteStub.throws(error);

        await delete_student(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWith({ message: 'Database error' }));
    });
});
