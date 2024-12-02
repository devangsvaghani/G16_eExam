import sinon from "sinon";
import assert from "assert";
import { get_past_exams } from "../../backend/controller/past_upcoming_exams.js"; // Adjust the path as needed
import Exam from "../../backend/models/exam.js";

describe("get_past_exams API Function", function () {
    let req, res;

    // Set up request and response objects before each test
    beforeEach(() => {
        req = {}; // No params needed for this API call
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
    });

    // Restore all sinon stubs after each test
    afterEach(() => {
        sinon.restore();
    });

    it("should retrieve past exams successfully", async () => {
        const currentTime = new Date();

        // Simulated past exams data
        const mockPastExams = [
            {
                _id: "1",
                title: "Past Exam 1",
                startTime: new Date(currentTime.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
                duration: 60, // 1 hour
                status: "Published",
            },
            {
                _id: "2",
                title: "Past Exam 2",
                startTime: new Date(currentTime.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
                duration: 120, // 2 hours
                status: "Published",
            },
        ];

        // Stub Exam.find to return mock past exams
        sinon.stub(Exam, "find").resolves(mockPastExams);

        await get_past_exams(req, res);

        // Assertions to verify the response
        assert(res.status.calledOnceWith(200)); // Check for status code 200
        assert(
            res.json.calledOnceWithMatch({
                message: "Past exams retrieved successfully.",
                pastExams: mockPastExams,
            })
        );
    });

    it("should return 500 if there is a server error", async () => {
        // Simulate an error in Exam.find
        sinon.stub(Exam, "find").throws(new Error("Database error"));

        await get_past_exams(req, res);

        // Assertions to verify error handling
        assert(res.status.calledOnceWith(500)); // Check for status code 500
        assert(
            res.json.calledOnceWithMatch({
                message: "Database error",
            })
        );
    });

    it("should return an empty list if no past exams are found", async () => {
        // Stub Exam.find to return an empty array
        sinon.stub(Exam, "find").resolves([]);

        await get_past_exams(req, res);

        // Assertions to verify response for no exams found
        assert(res.status.calledOnceWith(200)); // Check for status code 200
        assert(
            res.json.calledOnceWithMatch({
                message: "Past exams retrieved successfully.",
                pastExams: [],
            })
        );
    });

    it("should handle invalid date formats gracefully", async () => {
        // Stub Exam.find to throw an error due to invalid date format
        sinon.stub(Exam, "find").throws(new Error("Invalid date format"));

        await get_past_exams(req, res);

        // Assertions to verify error handling
        assert(res.status.calledOnceWith(500)); // Check for status code 500
        assert(
            res.json.calledOnceWithMatch({
                message: "Invalid date format",
            })
        );
    });

    it("should handle missing status field gracefully", async () => {
        const currentTime = new Date();

        // Simulated past exams data without status field
        const mockPastExams = [
            {
                _id: "1",
                title: "Past Exam 1",
                startTime: new Date(currentTime.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
                duration: 60, // 1 hour
            },
            {
                _id: "2",
                title: "Past Exam 2",
                startTime: new Date(currentTime.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
                duration: 120, // 2 hours
            },
        ];

        // Stub Exam.find to return mock past exams without status field
        sinon.stub(Exam, "find").resolves(mockPastExams);

        await get_past_exams(req, res);

        // Assertions to verify the response
        assert(res.status.calledOnceWith(200)); // Check for status code 200
        assert(
            res.json.calledOnceWithMatch({
                message: "Past exams retrieved successfully.",
                pastExams: mockPastExams,
            })
        );
    });

    it("should handle exams with future dates", async () => {
        const currentTime = new Date();

        // Simulated future exams data
        const mockFutureExams = [
            {
            _id: "1",
            title: "Future Exam 1",
            startTime: new Date(currentTime.getTime() + 3 * 60 * 60 * 1000), 
            duration: 60,
            status: "Published",
            },
            {
            _id: "2",
            title: "Future Exam 2",
            startTime: new Date(currentTime.getTime() + 5 * 60 * 60 * 1000), 
            duration: 120, 
            status: "Published",
            },
        ];

        // Simulate the query to filter out future exams
        sinon.stub(Exam, "find").resolves(
            mockFutureExams.filter((exam) => {
                const endTime = new Date(
                    exam.startTime.getTime() + exam.duration * 60000
                );
                return endTime < currentTime && exam.status === "Published";
            })
        );

        await get_past_exams(req, res);

        // Assertions to verify the response
        assert(res.status.calledOnceWith(200)); // Check for status code 200
        assert(
            res.json.calledOnceWithMatch({
                message: "Past exams retrieved successfully.",
                pastExams: [],
            })
        );
    });

    

    it("should handle missing status field gracefully", async () => {
        const currentTime = new Date();

        const mockPastExams = [
            {
                _id: "1",
                title: "Past Exam 1",
                startTime: new Date(currentTime.getTime() - 3 * 60 * 60 * 1000),
                duration: 60,
            },
            {
                _id: "2",
                title: "Past Exam 2",
                startTime: new Date(currentTime.getTime() - 5 * 60 * 60 * 1000),
                duration: 120,
            },
        ];

        sinon.stub(Exam, "find").resolves(mockPastExams);

        await get_past_exams(req, res);

        assert(res.status.calledOnceWith(200));
        assert(
            res.json.calledOnceWithMatch({
                message: "Past exams retrieved successfully.",
                pastExams: mockPastExams,
            })
        );
    });
});
