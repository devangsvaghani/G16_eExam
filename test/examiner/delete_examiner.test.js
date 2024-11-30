import sinon from 'sinon';
import assert from 'assert';
import { delete_examiner } from '../../backend/controller/examiner.js';
import User from '../../backend/models/user.js';
import Examiner from '../../backend/models/examiner.js';

describe("delete_examiner API Function", function () {
    let req, res;

    beforeEach(() => {
        req = {
            params: { username: "testuser" },
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should delete an examiner and associated user successfully", async () => {
        const mockUser = { username: "testuser" };
        const mockExaminer = { _id: "examinerid", username: "testuser" };

        const findUserStub = sinon.stub(User, "findOne").resolves(mockUser);
        const findExaminerStub = sinon.stub(Examiner, "findOne").resolves(mockExaminer);
        
        const deleteExaminerStub = sinon.stub(Examiner, "deleteOne").resolves();
        const deleteUserStub = sinon.stub(User, "deleteOne").resolves();

        await delete_examiner(req, res);

        assert(res.status.calledOnceWith(200));
        assert(res.json.calledWith({ message: "Examiner and associated User deleted successfully." }));
        assert(deleteExaminerStub.calledOnceWith({ _id: mockExaminer._id }));
        assert(deleteUserStub.calledOnceWith({ username: "testuser" }));
    });

    it("should handle user not found", async () => {
        sinon.stub(User, "findOne").resolves(null);

        await delete_examiner(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "User not found." }));
    });

    it("should handle examiner not found", async () => {
        const mockUser = { username: "testuser" };
        sinon.stub(User, "findOne").resolves(mockUser);
        sinon.stub(Examiner, "findOne").resolves(null);

        await delete_examiner(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "Examiner not found." }));
    });

    it("should handle server errors gracefully", async () => {
        sinon.stub(User, "findOne").throws(new Error("Database error"));

        await delete_examiner(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWith({ message: "Database error" }));
    });
});
