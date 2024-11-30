import sinon from 'sinon';
import assert from 'assert';
import { all_examiners } from '../../backend/controller/examiner.js';
import User from '../../backend/models/user.js';

describe("all_examiners API Function", function () {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should handle server errors gracefully", async () => {
        sinon.stub(User, "find").throws(new Error("Database error"));

        await all_examiners(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWith({ message: "Database error" }));
    });
});
