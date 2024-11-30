import sinon from "sinon";
import assert from "assert";
import { delete_exam } from "../../backend/controller/exam.js";
import Exam from "../../backend/models/exam.js";

describe("delete_exam API Function", function () {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                examId: 1,
            },
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

        await delete_exam(req, res);

        assert(res.status.calledWith(404));
        assert(res.json.calledWith({ message: "No Examiner Found" }));
    });

    it("should return a 404 if the exam is not found", async () => {
        sinon.stub(Exam, "findOne").resolves(null);

        await delete_exam(req, res);

        assert(res.status.calledWith(404));
    });

    it("should return a 401 if the user does not have access to delete the exam", async () => {
        sinon.stub(Exam, "findOne").resolves({
            creatorUsername: "otherExaminer",
            startTime: new Date(Date.now() + 3600 * 1000),
        });

        await delete_exam(req, res);

        assert(res.status.calledWith(401));
        assert(res.json.calledWith({ message: "You have no access to delete this exam" }));
    });

    it("should return a 401 if the exam start time has passed", async () => {
        sinon.stub(Exam, "findOne").resolves({
            creatorUsername: "examiner1",
            startTime: new Date(Date.now() - 3600 * 1000),
        });

        await delete_exam(req, res);

        assert(res.status.calledWith(401));
        assert(res.json.calledWith({
            message: "Exam Can not be deleted because it is already taken",
        }));
    });

    it("should delete the exam successfully", async () => {
        const mockExam = {
            creatorUsername: "examiner1",
            startTime: new Date(Date.now() + 3600 * 1000),
            deleteOne: sinon.stub().resolves(),
        };

        sinon.stub(Exam, "findOne").resolves(mockExam);

        await delete_exam(req, res);

        assert(mockExam.deleteOne.calledOnce);
        assert(res.status.calledWith(200));
        assert(res.json.calledWith({ message: "Exam deleted successfully." }));
    });

    it("should return a 500 error if there is a server issue", async () => {
        sinon.stub(Exam, "findOne").throws(new Error("Database error"));

        await delete_exam(req, res);

        assert(res.status.calledWith(500));
        assert(res.json.calledWith({ message: "Database error" }));
    });
});
