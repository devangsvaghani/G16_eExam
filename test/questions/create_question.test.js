import sinon from 'sinon';
import assert from 'assert';
import { create_question } from "../../backend/controller/questions.js";
import User from "../../backend/models/user.js";
import Question from "../../backend/models/question.js";

describe('create_question API Function', () => {
    let res;
    let req;
    let findUserStub;
    let saveQuestionStub;

    beforeEach(() => {
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        };

        req = {
            user: {
                username: 'testExaminer',
            },
            body: {
                desc: 'Sample question description',
                options: ['Option 1', 'Option 2'],
                points: 10,
                difficulty: 'Medium',
                answer: 'Option 1',
                subject: 'Math',
            }
        };

        findUserStub = sinon.stub(User, 'findOne');
        saveQuestionStub = sinon.stub(Question.prototype, 'save');
    });

    afterEach(() => {
        if (findUserStub.restore) findUserStub.restore();
        if (saveQuestionStub.restore) saveQuestionStub.restore();
    });

    it('should return 404 if no username found in request', async () => {
        req.user.username = undefined;

        await create_question(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Examiner Found" }));
    });

    it('should return 400 if options are not provided or have less than 2', async () => {
        req.body.options = ['Option 1'];

        await create_question(req, res);

        assert(res.status.calledOnceWith(400));
        assert(res.json.calledWith({ message: "At least two options are required." }));
    });

    it('should return 404 if examiner is not found in the database', async () => {
        findUserStub.resolves(null);

        await create_question(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Student Found" }));
    });

    it('should return 200 and the created question if everything is valid', async () => {
        const examinerMock = { firstname: 'John', lastname: 'Doe' };
        const questionMock = {
            desc: 'Sample question description',
            options: ['Option 1', 'Option 2'],
            points: 10,
            difficulty: 'Medium',
            answer: 'Option 1',
            subject: 'Math',
            creatorUsername: 'testExaminer',
            creator: 'John Doe'
        };

        findUserStub.resolves(examinerMock);
        saveQuestionStub.resolves(questionMock);

        await create_question(req, res);

        assert(res.status.calledOnceWith(200));
    });

    it('should return 500 if there is an error during the process', async () => {
        findUserStub.throws(new Error('Database error'));

        await create_question(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWithMatch({ message: 'Database error' }));
    });
});
