import sinon from 'sinon';
import assert from 'assert';
import { student_submit_answer } from '../../backend/controller/student.js';
import Student from '../../backend/models/student.js';
import Question from '../../backend/models/question.js';
import Exam from '../../backend/models/exam.js';

describe('student_submit_answer API Function', () => {
    let res;
    let req;
    let findStudentStub;
    let findQuestionStub;
    let findExamStub;
    let studentMock;
    let questionMock;
    let examMock;

    beforeEach(() => {
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        };

        req = {
            user: { username: 'testStudent' },
            body: {
                examId: 'examId123',
                questionId: 'questionId123',
                answer: 'Some answer',
            },
        };

        studentMock = {
            username: 'testStudent',
            batch: 'A1',
            branch: 'CS',
            givenExams: [],
            save: sinon.stub().resolves(),
        };

        questionMock = {
            _id: 'questionId123',
            answer: 'Some answer',
            points: 10,
        };

        examMock = {
            _id: 'examId123',
            startTime: new Date(),
            duration: 60,
            batch: 'A1',
            branch: 'CS',
            questions: [],
            submitted: false,
            save: sinon.stub().resolves(),
        };

        findStudentStub = sinon.stub(Student, 'findOne');
        findQuestionStub = sinon.stub(Question, 'findOne');
        findExamStub = sinon.stub(Exam, 'findOne');
    });

    afterEach(() => {
        if (findStudentStub.restore) findStudentStub.restore();
        if (findQuestionStub.restore) findQuestionStub.restore();
        if (findExamStub.restore) findExamStub.restore();
    });

    it('should return 404 if no username found in request', async () => {
        req.user.username = undefined;

        await student_submit_answer(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: 'No Username Found' }));
    });

    it('should return 404 if student is not found in the database', async () => {
        findStudentStub.resolves(null);

        await student_submit_answer(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: 'Student not found' }));
    });

    it('should return 404 if question is not found in the database', async () => {
        findStudentStub.resolves(studentMock);
        findQuestionStub.resolves(null);

        await student_submit_answer(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: 'Question not found' }));
    });

    it('should return 404 if exam is not found in the database', async () => {
        findStudentStub.resolves(studentMock);
        findQuestionStub.resolves(questionMock);
        findExamStub.resolves(null);

        await student_submit_answer(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: 'Exam not found' }));
    });

    it('should return 404 if exam is not for the correct batch/branch', async () => {
        examMock.batch = 'B2';

        findStudentStub.resolves(studentMock);
        findQuestionStub.resolves(questionMock);
        findExamStub.resolves(examMock);

        await student_submit_answer(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: 'Exam is not for your batch/branch' }));
    });

    it('should return 401 if exam is not started or already ended', async () => {
        const futureExam = { ...examMock, startTime: new Date(Date.now() + 10000), duration: 30 };
        findStudentStub.resolves(studentMock);
        findQuestionStub.resolves(questionMock);
        findExamStub.resolves(futureExam);

        await student_submit_answer(req, res);

        assert(res.status.calledOnceWith(401));
        assert(res.json.calledWith({ message: 'Exam is either ended or not started yet' }));
    });

    it('should return 401 if exam is already submitted', async () => {
        studentMock.givenExams = [{
            exam: examMock._id,
            questions: [],
            obtained_score: 0,
            submitted: true,
        }];

        findStudentStub.resolves(studentMock);
        findQuestionStub.resolves(questionMock);
        findExamStub.resolves(examMock);

        await student_submit_answer(req, res);

        assert(res.status.calledOnceWith(401));
        assert(res.json.calledWith({ message: 'Exam was already submitted' }));
    });

    it('should return 500 if there is an error during the process', async () => {
        const error = new Error('Database error');
        findStudentStub.throws(error);

        await student_submit_answer(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWith({ message: 'Database error' }));
    });
});
