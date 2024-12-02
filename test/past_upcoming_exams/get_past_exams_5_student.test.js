import sinon from 'sinon';
import assert from 'assert';
import { get_past_exams_5_student } from '../../backend/controller/past_upcoming_exams.js'; // Adjust the path based on your folder structure
import Student from '../../backend/models/student.js';
import Exam from '../../backend/models/exam.js';

describe('get_past_exams_5_student API Function', () => {
    let req, res;

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

    afterEach(() => {
        sinon.restore();
    });

    it('should return 404 if no username is found', async () => {
        req.user.username = undefined;

        await get_past_exams_5_student(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledOnceWith({message: "No Username Found"}));
    });

    it('should return 404 if no student found for the username', async () => {
        sinon.stub(Student, 'findOne').resolves(null);

        await get_past_exams_5_student(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledOnceWith({message: "No Student Found"}));
    });

    it('should return 500 if there is a server error', async () => {
        sinon.stub(Student, 'findOne').throws(new Error('Database error'));

        await get_past_exams_5_student(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledOnceWithMatch({ message: 'Database error' }));
    });

    it('should return 200 and past exams if successful', async () => {
        const student = { username: 'testStudent', batch: '2021', branch: 'CSE' };
        const pastExams = [
            { _id: 'exam1', startTime: new Date(), duration: 60, status: 'Published' },
            { _id: 'exam2', startTime: new Date(), duration: 60, status: 'Published' },
        ];

        sinon.stub(Student, 'findOne').resolves(student);
        sinon.stub(Exam, 'find').returns({
            sort: () => ({
                limit: sinon.stub().resolves(pastExams)
            })
        });

        await get_past_exams_5_student(req, res);

        assert(res.status.calledOnceWith(200));
        assert(res.json.calledOnceWith({
            message: "Past exams retrieved successfully.",
            pastExams,
        }));
    });
});
