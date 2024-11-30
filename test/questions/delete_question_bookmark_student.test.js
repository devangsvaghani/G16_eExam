import sinon from 'sinon';
import assert from 'assert';
import { delete_question_bookmark_student } from "../../backend/controller/questions.js";
import Student from "../../backend/models/student.js";

describe('delete_question_bookmark_student API Function', () => {
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
            body: {
                questionId: '12345',
            },
        };
    });

    it('should return 404 if no questionId is provided', async () => {
        req.body.questionId = undefined;

        await delete_question_bookmark_student(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Question Found" }));
    });

    it('should return 404 if no username is found in the request', async () => {
        req.user.username = undefined;

        await delete_question_bookmark_student(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Username Found" }));
    });

    it('should return 404 if student is not found in the database', async () => {
        const findStudentStub = sinon.stub(Student, 'findOne').resolves(null);

        await delete_question_bookmark_student(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Student Found" }));

        findStudentStub.restore();
    });

    it('should return 404 if the question is not found or already removed', async () => {
        const studentMock = { 
            username: 'testStudent', 
            bookmarkedQuestions: ['12345'],
            save: sinon.stub().resolves()
        };

        const findStudentStub = sinon.stub(Student, 'findOne').resolves(studentMock);
        const updateOneStub = sinon.stub(Student, 'updateOne').resolves({ modifiedCount: 0 });

        await delete_question_bookmark_student(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "Question not found or already removed." }));

        findStudentStub.restore();
        updateOneStub.restore();
    });

    it('should return 200 and successfully unbookmark the question', async () => {
        const studentMock = { 
            username: 'testStudent', 
            bookmarkedQuestions: ['12345'],
            save: sinon.stub().resolves()
        };

        const findStudentStub = sinon.stub(Student, 'findOne').resolves(studentMock);
        const updateOneStub = sinon.stub(Student, 'updateOne').resolves({ modifiedCount: 1 });

        await delete_question_bookmark_student(req, res);

        assert(res.status.calledOnceWith(200));
        assert(res.json.calledWith({ message: "Question unbookmarked successfully." }));

        findStudentStub.restore();
        updateOneStub.restore();
    });

    it('should return 500 if there is an error during the process', async () => {
        const findStudentStub = sinon.stub(Student, 'findOne').throws(new Error('Database error'));

        await delete_question_bookmark_student(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWithMatch({ message: 'Database error' }));

        findStudentStub.restore();
    });
});
