import sinon from 'sinon';
import assert from 'assert';
import { get_past_exams_5_student } from '../../backend/controller/past_upcoming_exams.js'; // Adjust the path based on your folder structure
import Student from '../../backend/models/student.js';
import Exam from '../../backend/models/exam.js';

describe('get_past_exams_5_student API Function', () => {
    let req, res;

    beforeEach(() => {
        // Mock the response object
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        };

        // Mock the request object
        req = {
            user: {
                username: 'testStudent', // Set a default username for the tests
            },
        };
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs after each test
    });

    it('should return 404 if no username found', async () => {
        req.user.username = undefined; // Simulate missing username

        await get_past_exams_5_student(req, res);

        // Assertions
        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Username Found" }));
    });

    it('should return 404 if no student found for the username', async () => {
        sinon.stub(Student, 'findOne').resolves(null); // Simulate no student found

        await get_past_exams_5_student(req, res);

        // Assertions
        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Student Found" }));
    });

    it('should return 500 if there is a server error', async () => {
        sinon.stub(Student, 'findOne').throws(new Error('Database error')); // Simulate a database error

        await get_past_exams_5_student(req, res);

        // Assertions
        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWithMatch({ message: 'Database error' }));
    });
});
