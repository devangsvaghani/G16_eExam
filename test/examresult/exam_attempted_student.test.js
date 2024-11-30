import sinon from 'sinon';
import assert from 'assert';
import { exam_attempted_student } from '../../backend/controller/exams_result.js';
import Exam from '../../backend/models/exam.js';
import Student from '../../backend/models/student.js';
import User from '../../backend/models/user.js';

describe('exam_attempted_student API function', function () {
    let req, res;

    beforeEach(() => {
        req = {
            params: { examId: 'exam123' },
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return 400 if examId is not provided', async () => {
        req.params.examId = null;

        await exam_attempted_student(req, res);

        assert(res.status.calledOnceWith(400));
        assert(res.json.calledWith({ message: 'Exam ID is required' }));
    });

    it('should return 404 if exam not found', async () => {
        sinon.stub(Exam, 'findOne').resolves(null);

        await exam_attempted_student(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: 'Exam not found' }));
    });

    it('should handle server errors gracefully', async () => {
        sinon.stub(Exam, 'findOne').throws(new Error('Database error'));

        await exam_attempted_student(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWith({ message: 'Database error' }));
    });
});
