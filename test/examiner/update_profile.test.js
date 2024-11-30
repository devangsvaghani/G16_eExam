import sinon from 'sinon';
import assert from 'assert';
import { update_profile } from '../../backend/controller/examiner.js';
import User from '../../backend/models/user.js';

describe("update_profile API Function", function () {
    let req, res;

    beforeEach(() => {
        req = {
            params: { username: "testuser" },
            body: {
                firstname: "John",
                lastname: "Doe",
                middlename: "A",
                dob: "1990-01-01",
                mobileno: "1234567890",
                gender: "Male",
                email: "johndoe@example.com",
            }
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should update the user profile successfully", async () => {
        const mockUser = {
            username: "testuser",
            firstname: "John",
            lastname: "Doe",
            middlename: "A",
            dob: new Date("1990-01-01"),
            mobileno: "1234567890",
            gender: "Male",
            email: "johndoe@example.com",
            save: sinon.stub().resolves(),
        };

        const findUserStub = sinon.stub(User, "findOne").resolves(mockUser);

        await update_profile(req, res);

        assert(res.status.calledOnceWith(200));
    });

    it("should return 400 if required fields are missing", async () => {
        req.body.firstname = "";

        await update_profile(req, res);

        assert(res.status.calledOnceWith(400));
        assert(res.json.calledWith({ message: "All fields are required!" }));
    });

    it("should return 400 if mobile number is invalid", async () => {
        req.body.mobileno = "12345";

        await update_profile(req, res);

        assert(res.status.calledOnceWith(400));
        assert(res.json.calledWith({ message: "Mobile number must be exactly 10 digits." }));
    });

    it("should return 400 if date of birth format is invalid", async () => {
        req.body.dob = "1990-13-01";

        await update_profile(req, res);

        assert(res.status.calledOnceWith(400));
        assert(res.json.calledWith({ message: "Invalid date of birth values." }));
    });

    it("should return 400 if email format is invalid", async () => {
        req.body.email = "invalidemail";

        await update_profile(req, res);

        assert(res.status.calledOnceWith(400));
        assert(res.json.calledWith({ message: "Invalid email format." }));
    });

    it("should return 404 if user not found", async () => {
        sinon.stub(User, "findOne").resolves(null);

        await update_profile(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: "User not found." }));
    });

    it("should handle server errors gracefully", async () => {
        sinon.stub(User, "findOne").throws(new Error("Database error"));

        await update_profile(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWith({ message: "Database error" }));
    });
});
