import sinon from 'sinon';
import assert from 'assert';
import { get_upcoming_exams } from '../../backend/controller/past_upcoming_exams.js'; // Adjust path if needed
import Exam from '../../backend/models/exam.js';

describe("get_upcoming_exams API Function", function () {
    let req, res;

    // Setup request and response objects before each test
    beforeEach(() => {
        req = {};  // No params needed for this API call
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
    });

    // Restore stubs after each test
    afterEach(() => {
        sinon.restore();
    });

    it("should return 500 if there is a server error", async () => {
        // Simulate an error in Exam.find
        sinon.stub(Exam, "find").throws(new Error("Database error"));

        await get_upcoming_exams(req, res);

        // Assertions to verify error handling
        assert(res.status.calledOnceWith(500));  // Check for status code 500
        assert(res.json.calledOnceWithMatch({
            message: "Database error",
        }));
    });

    it("should return 200 and an empty array if no upcoming exams are found", async () => {
        // Simulate no upcoming exams found
        const findStub = sinon.stub(Exam, "find").returns({ select: sinon.stub().resolves([]) });

        await get_upcoming_exams(req, res);

        // Assertions to verify response
        assert(res.status.calledOnceWith(200));  // Check for status code 200
        assert(res.json.calledOnceWithMatch({
            message: "Upcoming exams retrieved successfully.",
            upcomingExams: [],
        }));
    });

    it("should return 200 and a list of upcoming exams if exams are found", async () => {
        // Simulate upcoming exams found
        const mockExams = [
            { _id: "1", name: "Exam 1", startTime: new Date(), duration: 60, status: "Published" },
            { _id: "2", name: "Exam 2", startTime: new Date(), duration: 90, status: "Published" },
        ];
        sinon.stub(Exam, "find").returns({ select: sinon.stub().resolves(mockExams) });

        await get_upcoming_exams(req, res);

        // Assertions to verify response
        assert(res.status.calledOnceWith(200));  // Check for status code 200
        assert(res.json.calledOnceWithMatch({
            message: "Upcoming exams retrieved successfully.",
            upcomingExams: mockExams,
        }));
    });

    it("should handle invalid date format gracefully", async () => {
        sinon.stub(Exam, "find").throws(new Error("Invalid date format"));

        await get_upcoming_exams(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledOnceWithMatch({ message: "Invalid date format" }));
    });
});
