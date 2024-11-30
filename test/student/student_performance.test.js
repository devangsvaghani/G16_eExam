import sinon from 'sinon';
import assert from 'assert';
import { student_performance } from '../../backend/controller/student.js';
import Student from '../../backend/models/student.js';

describe('student_performance API Function', () => {
    let res;
    let req;
    let findStudentStub;

    beforeEach(() => {
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        };

        req = {
            user: {
                username: 'testStudent',
            },
        };

        findStudentStub = sinon.stub(Student, 'findOne');
    });

    afterEach(() => {
        if (findStudentStub.restore) {
            findStudentStub.restore();
        }
    });

    it('should return 404 if no username found in request', async () => {
        req.user.username = undefined;

        await student_performance(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Username Found" }));
    });

    it('should return 500 if there is an error during the process', async () => {
        findStudentStub.throws(new Error('Database error'));

        await student_performance(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWithMatch({ message: 'Database error' }));
    });
});
