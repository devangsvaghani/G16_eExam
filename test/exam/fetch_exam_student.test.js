import sinon from "sinon";
import assert from "assert";
import { fetch_exam_student } from "../../backend/controller/exam.js";
import Exam from "../../backend/models/exam.js";
import Question from "../../backend/models/question.js";

describe("fetch_exam_student API Function", function () {
    let req, res;

    beforeEach(() => {
        req = { params: { examId: 1 } };  // Ensure examId is set
        res = {
            status: sinon.stub().returnsThis(),  // Mock and track status call
            json: sinon.stub().returnsThis(),    // Mock and track json call
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should return a 500 error if there is a server issue while fetching the exam", async () => {
        sinon.stub(Exam, "findOne").throws(new Error("Database error"));

        await fetch_exam_student(req, res);

        assert(res.status.calledWith(500));
        assert(res.json.calledWith({ message: "Database error" }));
    });

});
