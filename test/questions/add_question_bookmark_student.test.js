import sinon from 'sinon';
import assert from 'assert';
import { add_question_bookmark_student } from "../../backend/controller/questions.js";
import Student from "../../backend/models/student.js";

describe('add_question_bookmark_student API Function', () => {
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

        await add_question_bookmark_student(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Question Found" }));
    });

    it('should return 404 if no username is found in the request', async () => {
        req.user.username = undefined;

        await add_question_bookmark_student(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Username Found" }));
    });

    it('should return 404 if student is not found in the database', async () => {
        const findStudentStub = sinon.stub(Student, 'findOne').resolves(null);

        await add_question_bookmark_student(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Student Found" }));

        findStudentStub.restore();
    });

    it('should return 200 and successfully bookmark the question', async () => {
        const studentMock = { 
            username: 'testStudent', 
            bookmarkedQuestions: [], 
            save: sinon.stub().resolves() 
        };

        const findStudentStub = sinon.stub(Student, 'findOne').resolves(studentMock);

        await add_question_bookmark_student(req, res);

        assert(res.status.calledOnceWith(200));
        assert(res.json.calledWith({ message: "Question bookmarked successfully." }));

        findStudentStub.restore();
    });

    it('should return 500 if there is an error during the process', async () => {
        const findStudentStub = sinon.stub(Student, 'findOne').throws(new Error('Database error'));

        await add_question_bookmark_student(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWithMatch({ message: 'Database error' }));

        findStudentStub.restore();
    });
});
