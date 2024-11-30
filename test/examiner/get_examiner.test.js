import sinon from 'sinon';
import assert from 'assert';
import { get_examiner } from '../../backend/controller/examiner.js';
import User from '../../backend/models/user.js';

describe("get_examiner API Function", function () {
    let req, res;

    beforeEach(() => {
        req = {
            params: { username: "testuser" },
            user: { role: "Admin", username: "testuser" },
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should handle unauthorized access for non-admin users", async () => {
        req.user.role = "Student";

        await get_examiner(req, res);

        assert(res.status.calledOnceWith(400));
        assert(res.json.calledWith({ message: "Unathorized Access" }));
    });

    it("should handle server errors gracefully", async () => {
        sinon.stub(User, "findOne").throws(new Error("Database error"));

        await get_examiner(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWith({ message: "Database error" }));
    });
});
