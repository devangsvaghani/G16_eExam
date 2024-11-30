import sinon from "sinon";
import assert from "assert";
import { show_exam } from "../../backend/controller/exams_result.js";
import Student from "../../backend/models/student.js";

describe("show_exam API Function", function () {
    let req, res;

    beforeEach(() => {
        req = {
            params: { examId: "1", username: "testuser" },
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should handle missing username in request", async () => {
        req.params.username = null;

        await show_exam(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No username found" }));
    });

    it("should handle missing examId in request", async () => {
        req.params.examId = null;

        await show_exam(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No Exam found" }));
    });

    it("should handle server errors gracefully", async () => {
        sinon.stub(Student, "findOne").throws(new Error("Database error"));

        await show_exam(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWith({ message: "Database error" }));
    });
});
