import sinon from 'sinon';
import assert from 'assert';
import { all_questions_subject_wise_student } from "../../backend/controller/questions.js";
import Student from "../../backend/models/student.js";
import Exam from "../../backend/models/exam.js";
import Question from "../../backend/models/question.js";

describe('all_questions_subject_wise_student API Function', () => {
    let res;
    let req;

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
    });

    it('should return 404 if no username found in request', async () => {
        req.user.username = undefined;

        await all_questions_subject_wise_student(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Username Found" }));
    });

    it('should return 404 if student is not found in the database', async () => {
        const findStudentStub = sinon.stub(Student, 'findOne').resolves(null);

        await all_questions_subject_wise_student(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Student Found" }));

        findStudentStub.restore();
    });

    it('should return 200 and the grouped questions if everything is valid', async () => {
        const studentMock = { username: 'testStudent', batch: 'batch1', branch: 'branch1' };

        const findStudentStub = sinon.stub(Student, 'findOne').resolves(studentMock);

        const pastExamsMock = [
            { questions: [1, 2, 3], batch: 'batch1', branch: 'branch1', status: 'Published', startTime: new Date(), duration: 60 },
        ];

        const findExamStub = sinon.stub(Exam, 'find').resolves(pastExamsMock);

        const groupedQuestionsMock = [
            { subject: 'Math', questions: [{ questionId: 1 }, { questionId: 2 }] },
            { subject: 'Science', questions: [{ questionId: 3 }] },
        ];

        const aggregateStub = sinon.stub(Question, 'aggregate').resolves(groupedQuestionsMock);

        await all_questions_subject_wise_student(req, res);

        assert(res.status.calledOnceWith(200));
        assert(res.json.calledWithMatch({
            message: "Questions retrieved successfully.",
            groupedQuestions: groupedQuestionsMock,
        }));

        findStudentStub.restore();
        findExamStub.restore();
        aggregateStub.restore();
    });

    it('should return 500 if there is an error during the process', async () => {
        const findStudentStub = sinon.stub(Student, 'findOne').throws(new Error('Database error'));

        await all_questions_subject_wise_student(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWithMatch({ message: 'Database error' }));

        findStudentStub.restore();
    });
});
