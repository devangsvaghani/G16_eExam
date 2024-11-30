import sinon from 'sinon';
import assert from 'assert';
import { update_exam } from '../../backend/controller/exam.js';
import User from '../../backend/models/user.js';
import Exam from '../../backend/models/exam.js';
import Question from '../../backend/models/question.js';

describe('update_exam API Function', function () {
    let req, res;

    beforeEach(() => {
        req = {
            user: { username: 'examiner1' },
            params: { examId: 101 },
            body: {
                questions: [
                    {
                        questionId: 1,
                        desc: 'Updated question description',
                        options: ['Option1', 'Option2', 'Option3', 'Option4'],
                        points: 5,
                        difficulty: 'Medium',
                        answer: 'Option1',
                    },
                ],
                startTime: new Date(Date.now() + 3600000).toISOString(),
                duration: 60,
                title: 'Updated Exam Title',
                semester: 'Fall 2024',
                examType: 'Midterm',
                batch: 'Batch A',
                branch: 'Computer Science',
                total_points: 100,
                status: 'Pending',
                instructions: 'Follow the updated instructions.',
                subject: 'Math',
            },
        };

        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return 404 if the examiner is not found', async () => {
        sinon.stub(User, 'findOne').resolves(null);

        await update_exam(req, res);

        assert(res.status.calledWith(404));
        assert(res.json.calledWith({ message: 'No Student Found' }));
    });

    it('should return 404 if the exam is not found', async () => {
        sinon.stub(User, 'findOne').resolves({
            username: 'examiner1',
            firstname: 'John',
            lastname: 'Doe',
        });
        sinon.stub(Exam, 'findOne').resolves(null);

        await update_exam(req, res);

        assert(res.status.calledWith(404));
        assert(res.json.calledWith({ message: 'Exam not found.' }));
    });

    it('should return 400 if required fields are missing', async () => {
        req.body = {};

        await update_exam(req, res);

        assert(res.status.calledWith(400));
        assert(res.json.calledWithMatch({
            message: 'Missing required fields for creating an exam',
        }));
    });

    it('should return 400 if questions array is empty', async () => {
        req.body.questions = [];

        await update_exam(req, res);

        assert(res.status.calledWith(400));
        assert(res.json.calledWith({ message: 'Questions are required' }));
    });

    it('should return 400 if startTime is in the past', async () => {
        req.body.startTime = new Date(Date.now() - 3600000).toISOString();

        await update_exam(req, res);

        assert(res.status.calledWith(400));
        assert(res.json.calledWith({
            message: 'Start time must be greater than the current time',
        }));
    });

    it('should update an exam successfully', async () => {
        const mockUser = {
            username: 'examiner1',
            firstname: 'John',
            lastname: 'Doe',
        };

        const mockExam = {
            examId: 101,
            save: sinon.stub().resolves(),
        };

        sinon.stub(User, 'findOne').resolves(mockUser);
        sinon.stub(Exam, 'findOne').resolves(mockExam);
        sinon.stub(Exam, 'findOneAndUpdate').resolves(mockExam);
        sinon.stub(Question, 'findOneAndUpdate').resolves({
            questionId: 1,
            subject: 'Math',
        });

        await update_exam(req, res);

        assert(res.status.calledWith(200));
        assert(res.json.calledWithMatch({
            message: 'Exam updated successfully.',
        }));
    });

    it('should return 500 if there is a server error', async () => {
        sinon.stub(User, 'findOne').throws(new Error('Database error'));

        await update_exam(req, res);

        assert(res.status.calledWith(500));
        assert(res.json.calledWith({ message: 'Database error' }));
    });
});
