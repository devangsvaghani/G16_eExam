import sinon from 'sinon';
import assert from 'assert';
import { all_students } from '../../backend/controller/student.js';
import User from '../../backend/models/user.js';

describe('all_students API Function', () => {
    let res;
    let req;
    let findStub;
    let userMock;

    beforeEach(() => {
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        };

        req = {};

        userMock = [
            { username: 'student1', role: 'Student' },
            { username: 'student2', role: 'Student' },
        ];

        findStub = sinon.stub(User, 'find');
    });

    afterEach(() => {
        if (findStub.restore) findStub.restore();
    });

    it('should return 500 if there is an error during the database query', async () => {
        const error = new Error('Database error');
        findStub.throws(error);

        await all_students(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWith({ message: 'Database error' }));
    });

});
