import sinon from 'sinon';
import assert from 'assert';
import { delete_question } from "../../backend/controller/questions.js";
import User from "../../backend/models/user.js";
import Question from "../../backend/models/question.js";

describe('delete_question API Function', () => {
    let res;
    let req;
    let findUserStub;
    let findQuestionStub;
    let deleteQuestionStub;

    beforeEach(() => {
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        };

        req = {
            user: {
                username: 'testExaminer',
            },
            params: {
                id: '12345',
            }
        };

        findUserStub = sinon.stub(User, 'findOne');
        findQuestionStub = sinon.stub(Question, 'findOne');
        deleteQuestionStub = sinon.stub(Question.prototype, 'deleteOne');
    });

    afterEach(() => {
        if (findUserStub.restore) findUserStub.restore();
        if (findQuestionStub.restore) findQuestionStub.restore();
        if (deleteQuestionStub.restore) deleteQuestionStub.restore();
    });

    it('should return 404 if no username found in request', async () => {
        req.user.username = undefined;

        await delete_question(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Examiner Found" }));
    });

    it('should return 404 if examiner is not found in the database', async () => {
        findUserStub.resolves(null);

        await delete_question(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Student Found" }));
    });

    it('should return 404 if the question is not found or the examiner is not the creator', async () => {
        const examinerMock = { username: 'testExaminer' };
        findUserStub.resolves(examinerMock);
        findQuestionStub.resolves(null);

        await delete_question(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "Question not found." }));
    });

    it('should return 404 if the question creator is not the same as the user requesting deletion', async () => {
        const examinerMock = { username: 'testExaminer' };
        const questionMock = { creatorUsername: 'otherExaminer' };
        findUserStub.resolves(examinerMock);
        findQuestionStub.resolves(questionMock);

        await delete_question(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "Question not found." }));
    });

    it('should return 500 if there is an error during the process', async () => {
        const examinerMock = { username: 'testExaminer' };
        findUserStub.resolves(examinerMock);
        findQuestionStub.throws(new Error('Database error'));

        await delete_question(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWithMatch({ message: 'Database error' }));
    });
});
