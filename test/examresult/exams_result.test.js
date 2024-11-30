import sinon from "sinon";
import assert from "assert";
import { exams_result } from "../../backend/controller/exams_result.js";
import Student from "../../backend/models/student.js";

describe("exams_result API Function", function () {
    let req, res;

    beforeEach(() => {
        req = {
            user: { username: "testuser" },
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
        req.user = null;

        await exams_result(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "No username found" }));
    });

    it("should handle server errors gracefully", async () => {
        sinon.stub(Student, "findOne").throws(new Error("Database error"));

        await exams_result(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWith({ message: "Database error" }));
    });
});
