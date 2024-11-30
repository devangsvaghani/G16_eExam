import sinon from "sinon";
import assert from "assert";
import { add_question_in_exam } from "../../backend/controller/exam.js";
import Exam from "../../backend/models/exam.js";
import Question from "../../backend/models/question.js";

describe("add_question_in_exam API Function", function () {
    let req, res;

    beforeEach(() => {
        req = {
            params: { examId: 1 },
            body: { questionId: 101 },
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

        await add_question_in_exam(req, res);

        assert(res.status.calledWith(404));
        assert(res.json.calledWith({ message: "No Examiner Found" }));
    });

    it("should return a 404 if the exam is not found", async () => {
        sinon.stub(Exam, "findOne").resolves(null);

        await add_question_in_exam(req, res);

        assert(res.status.calledWith(404));
        assert(res.json.calledWith({ message: "Exam not found" }));
    });

    it("should return a 401 if the user does not own the exam", async () => {
        sinon.stub(Exam, "findOne").resolves({
            creatorUsername: "otherExaminer",
            startTime: new Date(Date.now() + 3600 * 1000),
            questions: [],
            save: sinon.stub(),
        });

        await add_question_in_exam(req, res);

        assert(res.status.calledWith(401));
        assert(
            res.json.calledWith({
                message: "Can't add question to someone else's exam",
            })
        );
    });

    it("should return a 401 if the exam has already started or ended", async () => {
        sinon.stub(Exam, "findOne").resolves({
            creatorUsername: "examiner1",
            startTime: new Date(Date.now() - 3600 * 1000),
            questions: [],
            save: sinon.stub(),
        });

        await add_question_in_exam(req, res);

        assert(res.status.calledWith(401));
        assert(
            res.json.calledWith({
                message: "Exam Can not be edited because it is already started/ended.",
            })
        );
    });

    it("should return a 404 if the question is not found", async () => {
        sinon.stub(Exam, "findOne").resolves({
            creatorUsername: "examiner1",
            startTime: new Date(Date.now() + 3600 * 1000),
            questions: [],
            save: sinon.stub(),
        });
        sinon.stub(Question, "findOne").resolves(null);

        await add_question_in_exam(req, res);

        assert(res.status.calledWith(404));
        assert(res.json.calledWith({ message: "Question not found" }));
    });

    it("should add a question to the exam successfully", async () => {
        const mockExam = {
            creatorUsername: "examiner1",
            startTime: new Date(Date.now() + 3600 * 1000),
            questions: [],
            total_points: 0,
            save: sinon.stub().resolves(),
        };

        const mockQuestion = {
            questionId: 101,
            points: 5,
        };

        sinon.stub(Exam, "findOne").resolves(mockExam);
        sinon.stub(Question, "findOne").resolves(mockQuestion);

        await add_question_in_exam(req, res);

        assert(mockExam.save.calledOnce);
        assert(mockExam.questions.includes(101));
        assert.strictEqual(mockExam.total_points, 5);
        assert(res.status.calledWith(200));
        assert(
            res.json.calledWithMatch({
                message: "Question added to exam successfully",
                exam: mockExam,
            })
        );
    });

    it("should not add the same question if it already exists in the exam", async () => {
        const mockExam = {
            creatorUsername: "examiner1",
            startTime: new Date(Date.now() + 3600 * 1000),
            questions: [101],
            total_points: 5,
            save: sinon.stub().resolves(),
        };

        const mockQuestion = {
            questionId: 101,
            points: 5,
        };

        sinon.stub(Exam, "findOne").resolves(mockExam);
        sinon.stub(Question, "findOne").resolves(mockQuestion);

        await add_question_in_exam(req, res);

        assert(mockExam.save.notCalled);
        assert.strictEqual(mockExam.questions.length, 1);
        assert.strictEqual(mockExam.total_points, 5);
        assert(res.status.calledWith(200));
        assert(
            res.json.calledWithMatch({
                message: "Question added to exam successfully",
                exam: mockExam,
            })
        );
    });

    it("should return a 500 error if there is a server issue", async () => {
        sinon.stub(Exam, "findOne").throws(new Error("Database error"));

        await add_question_in_exam(req, res);

        assert(res.status.calledWith(500));
        assert(res.json.calledWith({ message: "Database error" }));
    });
});
