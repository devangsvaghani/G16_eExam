import sinon from 'sinon';
import assert from 'assert';
import { get_upcoming_exams_5_student } from '../../backend/controller/past_upcoming_exams.js'; // Adjust the path as needed
import Student from '../../backend/models/student.js';
import Exam from '../../backend/models/exam.js';

describe('get_upcoming_exams_5_student API Function', () => {
    let req, res;

    beforeEach(() => {
        // Mock the response object
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        };

        // Mock the request object with a default username
        req = {
            user: {
                username: 'testStudent',
            },
        };
    });

    afterEach(() => {
        sinon.restore(); // Restore stubs to their original state after each test
    });

    it('should return 404 if no username is found', async () => {
        req.user.username = undefined; // Simulate missing username

        await get_upcoming_exams_5_student(req, res);

        // Assertions
        assert(res.status.calledOnceWith(404));
        assert(res.json.calledOnceWith({ message: "No Username Found" }));
    });

    it('should return 404 if no student is found for the given username', async () => {
        sinon.stub(Student, 'findOne').resolves(null); // Simulate no student found

        await get_upcoming_exams_5_student(req, res);

        // Assertions
        assert(res.status.calledOnceWith(404));
        assert(res.json.calledOnceWith({ message: "No Student Found" }));
    });

    it('should return 500 if there is a server error', async () => {
        sinon.stub(Student, 'findOne').throws(new Error('Database error')); // Simulate a database error

        await get_upcoming_exams_5_student(req, res);

        // Assertions
        assert(res.status.calledOnceWith(500));
        assert(res.json.calledOnceWithMatch({ message: 'Database error' }));
    });
});
