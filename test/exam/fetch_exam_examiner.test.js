import sinon from "sinon";
import assert from "assert";
import { fetch_exam_examiner } from "../../backend/controller/exam.js";
import Exam from "../../backend/models/exam.js";
import Question from "../../backend/models/question.js";

describe("fetch_exam_examiner API Function", function () {
    let req, res;

    beforeEach(() => {
        req = {
            params: { examId: 1 },
            user: { username: "examinerUsername" },
        };

        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should return a 404 if the exam is not found", async () => {
        sinon.stub(Exam, "findOne").resolves(null);

        await fetch_exam_examiner(req, res);

        assert(res.status.calledWith(404));
        assert(res.json.calledWith({ message: "Exam not found." }));
    });

    it("should return a 404 if the examiner is not the creator of the exam", async () => {
        const mockExam = {
            examId: 1,
            creatorUsername: "otherExaminer",
        };

        sinon.stub(Exam, "findOne").resolves(mockExam);

        await fetch_exam_examiner(req, res);

        assert(res.status.calledWith(404));
        assert(res.json.calledWith({ message: "Exam not found." }));
    });

    it("should return a 500 error if there is a server issue while fetching the exam", async () => {
        sinon.stub(Exam, "findOne").throws(new Error("Database error"));

        await fetch_exam_examiner(req, res);

        assert(res.status.calledWith(500));
        assert(res.json.calledWith({ message: "Database error" }));
    });

    it("should fetch the exam and its questions successfully", async () => {
        // Mock req with required fields
        req.user = { username: "examinerUsername" };  // Match stubbed exam's creatorUsername
        req.params = { examId: 1 };  // Match stubbed examId
    
        // Stub database calls
        sinon.stub(Exam, "findOne").resolves({
            examId: 1,
            creatorUsername: "examinerUsername",
            questions: [101, 102],
        });
    
        sinon.stub(Question, "find").resolves([
            { questionId: 101, desc: "What is the capital of France?" },
            { questionId: 102, desc: "What is 2 + 2?" },
        ]);
    
        // Call the function
        await fetch_exam_examiner(req, res);
    
        // Log to debug
        console.log("res.status calls:", res.status.getCalls());
    
        // Assertions
        assert(res.status.calledWith(200), "Expected status 200 but did not get it.");
        assert(res.json.calledWithMatch({
            message: "Exam Fetched Successfully",
            exam: {
                examId: 1,
                creatorUsername: "examinerUsername",
                questions: [
                    { questionId: 101, desc: "What is the capital of France?" },
                    { questionId: 102, desc: "What is 2 + 2?" },
                ],
            },
        }));
    });
    

    it("should return a 500 error if there is a server issue while fetching questions", async () => {
        const mockExam = {
            examId: 1,
            title: "Sample Exam",
            creatorUsername: "examinerUsername",
            questions: [101, 102],
            duration: 60,
            startTime: "2024-11-25T10:00:00Z",
        };

        sinon.stub(Exam, "findOne").resolves(mockExam);
        sinon.stub(Question, "find").throws(new Error("Database error"));

        await fetch_exam_examiner(req, res);

        assert(res.status.calledWith(500));
        assert(res.json.calledWith({ message: "Database error" }));
    });
});
