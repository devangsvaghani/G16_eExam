import sinon from "sinon";
import assert from "assert";
import { delete_question_from_exam } from "../../backend/controller/exam.js";
import Exam from "../../backend/models/exam.js";
import Question from "../../backend/models/question.js";

describe("delete_question_from_exam API Function", function () {
    let req, res;

    beforeEach(() => {
        req = {
            params: { examId: 1, questionId: 101 },
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

    it("should return a 404 if no examiner is found", async () => {
        req.user = null;

        await delete_question_from_exam(req, res);

        assert(res.status.calledWith(404));
        assert(res.json.calledWith({ message: "No Examiner Found" }));
    });

    it("should return a 404 if the exam is not found", async () => {
        sinon.stub(Exam, "findOne").resolves(null);

        await delete_question_from_exam(req, res);

        assert(res.status.calledWith(404));
        assert(res.json.calledWith({ message: "Exam not found" }));
    });

    it("should return a 401 if the user does not own the exam", async () => {
        sinon.stub(Exam, "findOne").resolves({
            creatorUsername: "otherExaminer",
            questions: [101],
            save: sinon.stub(),
        });

        await delete_question_from_exam(req, res);

        assert(res.status.calledWith(401));
        assert(res.json.calledWith({
            message: "Can't delete question to someone else's exam",
        }));
    });

    it("should return a 404 if the question is not found", async () => {
        sinon.stub(Exam, "findOne").resolves({
            creatorUsername: "examiner1",
            questions: [101],
            save: sinon.stub(),
        });
        sinon.stub(Question, "findOne").resolves(null);

        await delete_question_from_exam(req, res);

        assert(res.status.calledWith(404));
        assert(res.json.calledWith({ message: "Question not found" }));
    });

    it("should remove the question from the exam successfully", async () => {
        const mockExam = {
            creatorUsername: "examiner1",
            questions: [101],
            total_points: 10,
            save: sinon.stub().resolves(),
        };

        const mockQuestion = {
            questionId: 101,
            points: 10,
        };

        sinon.stub(Exam, "findOne").resolves(mockExam);
        sinon.stub(Question, "findOne").resolves(mockQuestion);

        await delete_question_from_exam(req, res);

        assert(mockExam.save.calledOnce);
        assert.strictEqual(mockExam.questions.length, 0);
        assert.strictEqual(mockExam.total_points, 0);
        assert(res.status.calledWith(200));
        assert(res.json.calledWithMatch({
            message: "Question removed from exam successfully",
            exam: mockExam,
        }));
    });

    it("should not modify the exam if the question is not in the questions array", async () => {
        const mockExam = {
            creatorUsername: "examiner1",
            questions: [102],
            total_points: 10,
            save: sinon.stub().resolves(),
        };

        const mockQuestion = {
            questionId: 101,
            points: 5,
        };

        sinon.stub(Exam, "findOne").resolves(mockExam);
        sinon.stub(Question, "findOne").resolves(mockQuestion);

        await delete_question_from_exam(req, res);

        assert(mockExam.save.notCalled);
        assert.strictEqual(mockExam.questions.length, 1);
        assert.strictEqual(mockExam.total_points, 10);
        assert(res.status.calledWith(200));
        assert(res.json.calledWithMatch({
            message: "Question removed from exam successfully",
            exam: mockExam,
        }));
    });

    it("should return a 500 error if there is a server issue", async () => {
        sinon.stub(Exam, "findOne").throws(new Error("Database error"));

        await delete_question_from_exam(req, res);

        assert(res.status.calledWith(500));
        assert(res.json.calledWith({ message: "Database error" }));
    });
});
