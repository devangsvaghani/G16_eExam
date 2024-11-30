import sinon from 'sinon';
import assert from 'assert';
import { create_exam } from '../../backend/controller/exam.js';
import User from '../../backend/models/user.js';
import Exam from '../../backend/models/exam.js';
import Question from '../../backend/models/question.js';

describe('create_exam API Function', function () {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                questions: [
                    {
                        desc: "What is the capital of France?",
                        options: ["Paris", "London", "Berlin", "Madrid"],
                        points: 5,
                        difficulty: "Easy",
                        answer: "Paris",
                    },
                ],
                startTime: new Date(Date.now() + 3600000).toISOString(),
                duration: 60,
                title: "Geography Quiz",
                semester: "Fall 2024",
                examType: "Midterm",
                batch: "Batch A",
                branch: "Geography",
                total_points: 100,
                status: "Pending",
                instructions: "Answer all questions.",
                subject: "Geography",
            },
            user: { username: "examiner1" },
        };

        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return a 404 if the examiner is not found', async () => {
        sinon.stub(User, 'findOne').resolves(null);

        await create_exam(req, res);

        assert(res.status.calledWith(404));
        assert(res.json.calledWith({ message: "No Examiner Found" }));
    });

    it('should return a 400 error if a question is missing required fields', async () => {
        req.body.questions = [
            {
                desc: "What is the capital of France?",
                options: ["Paris", "London", "Berlin", "Madrid"],
                points: null,
                difficulty: "Easy",
                answer: "Paris",
            },
        ];

        sinon.stub(User, 'findOne').resolves({
            username: "examiner1",
            firstname: "John",
            lastname: "Doe",
        });

        await create_exam(req, res);

        assert(res.status.calledWith(400));
        assert(res.json.calledWith({
            message: "Missing required fields for creating a question",
        }));
    });

    it('should create and save a new exam successfully', async () => {
        const mockUser = {
            username: "examiner1",
            firstname: "John",
            lastname: "Doe",
        };

        sinon.stub(User, 'findOne').resolves(mockUser);
        sinon.stub(Question.prototype, 'save').resolves({ questionId: 1 });
        sinon.stub(Exam.prototype, 'save').resolves();

        await create_exam(req, res);

        assert(res.status.calledWith(200));
        assert(res.json.calledWithMatch({
            message: "Exam created successfully.",
        }));
    });

    it('should return a 500 error if there is a server issue', async () => {
        sinon.stub(User, 'findOne').throws(new Error('Database error'));

        await create_exam(req, res);

        assert(res.status.calledWith(500));
        assert(res.json.calledWith({ message: 'Database error' }));
    });
});
