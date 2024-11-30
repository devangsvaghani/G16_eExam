import sinon from 'sinon';
import assert from 'assert';
import { all_questions_examiner } from "../../backend/controller/questions.js";
import User from "../../backend/models/user.js";
import Question from "../../backend/models/question.js";

describe('all_questions_examiner API Function', () => {
    let res;
    let req;
    let findUserStub;
    let findQuestionsStub;

    beforeEach(() => {
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        };

        req = {
            user: {
                username: 'testExaminer',
            },
        };

        findUserStub = sinon.stub(User, 'findOne');
        findQuestionsStub = sinon.stub(Question, 'find');
    });

    afterEach(() => {
        if (findUserStub.restore) {
            findUserStub.restore();
        }
        if (findQuestionsStub.restore) {
            findQuestionsStub.restore();
        }
    });

    it('should return 404 if no username is provided in the request', async () => {
        req.user.username = undefined;

        await all_questions_examiner(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Examiner Found" }));
    });

    it('should return 404 if examiner is not found in the database', async () => {
        findUserStub.resolves(null);

        await all_questions_examiner(req, res);

        assert(res.status.calledOnceWith(404));
    });

    it('should return 500 if there is an error during the process', async () => {
        findUserStub.throws(new Error('Database error'));

        await all_questions_examiner(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWithMatch({ message: 'Database error' }));
    });
});
