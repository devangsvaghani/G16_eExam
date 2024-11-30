import sinon from 'sinon';
import assert from 'assert';
import { update_question } from "../../backend/controller/questions.js";
import User from "../../backend/models/user.js";
import Question from "../../backend/models/question.js";

describe('update_question API Function', () => {
    let res;
    let req;

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
                id: '123',
            },
            body: {
                desc: 'Updated question description',
                options: ['Updated Option 1', 'Updated Option 2'],
                points: 20,
                difficulty: 'Hard',
                answer: 'Updated Option 1',
                subject: 'Science',
            }
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return 404 if no username found in request', async () => {
        req.user.username = undefined;

        await update_question(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Examiner Found" }));
    });

    it('should return 404 if no examiner found in the database', async () => {
        const findUserStub = sinon.stub(User, 'findOne').resolves(null);

        await update_question(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Student Found" }));
    });

    it('should return 400 if options are not provided or have less than 2', async () => {
        req.body.options = ['Option 1'];

        await update_question(req, res);

        assert(res.status.calledOnceWith(400));
        assert(res.json.calledWith({ message: "At least two options are required." }));
    });

    it('should return 404 if the question is not found or does not belong to the examiner', async () => {
        const findUserStub = sinon.stub(User, 'findOne').resolves({ username: 'testExaminer' });

        const findQuestionStub = sinon.stub(Question, 'findOne').resolves(null);

        await update_question(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "Question not found." }));
    });

    it('should return 200 and the updated question if everything is valid', async () => {
        const examinerMock = { username: 'testExaminer' };
        const questionMock = {
            questionId: '123',
            creatorUsername: 'testExaminer',
            desc: 'Original question description',
            options: ['Option 1', 'Option 2'],
            points: 10,
            difficulty: 'Medium',
            answer: 'Option 1',
            subject: 'Math',
            save: sinon.stub().resolves(this),
        };

        const updatedQuestionMock = {
            ...questionMock,
            desc: req.body.desc,
            options: req.body.options,
            points: req.body.points,
            difficulty: req.body.difficulty,
            answer: req.body.answer,
            subject: req.body.subject,
        };

        const findUserStub = sinon.stub(User, 'findOne').resolves(examinerMock);
        const findQuestionStub = sinon.stub(Question, 'findOne').resolves(questionMock);

        await update_question(req, res);

        assert(res.status.calledOnceWith(200));
        assert(res.json.calledWithMatch({
            message: "Question updated successfully.",
            question: updatedQuestionMock,
        }));
    });

    it('should return 500 if there is an error during the process', async () => {
        const findUserStub = sinon.stub(User, 'findOne').throws(new Error('Database error'));

        await update_question(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWithMatch({ message: 'Database error' }));
    });
});
