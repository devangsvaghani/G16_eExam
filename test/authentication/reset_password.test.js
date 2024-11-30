import sinon from "sinon";
import assert from "assert";
import bcrypt from 'bcrypt';
import { reset_password } from "../../backend/controller/authentication.js";
import User from "../../backend/models/user.js";

describe("reset_password API Function", function () {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        old_password: "oldPassword123",
        new_password: "newPassword456",
      },
      user: {
        username: "testuser",
      },
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return a 400 error if old or new password is missing", async () => {
    req.body = { old_password: "oldPassword123" };

    await reset_password(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWithMatch({ message: "All fields are required" }));
  });

  it("should return a 409 error if the user does not exist", async () => {
    sinon.stub(User, "findOne").resolves(null);

    await reset_password(req, res);

    assert(res.status.calledWith(409));
    assert(res.json.calledWithMatch({ message: "User does not exists!" }));
  });

  it("should return a 400 error if the new password is less than 8 characters", async () => {
    req.body.new_password = "short";

    sinon.stub(User, "findOne").resolves({ username: "testuser", password: "hashedPassword" });

    await reset_password(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWithMatch({ message: "Password must be at least 8 characters long." }));
  });

  it("should return a 400 error if the old password is incorrect", async () => {
    sinon.stub(User, "findOne").resolves({
      username: "testuser",
      password: "hashedPassword123",
    });

    sinon.stub(bcrypt, "compare").resolves(false);

    await reset_password(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWithMatch({ message: "Incorrect Password" }));
  });

  it("should return a 500 error if there is a server error", async () => {
    const errorMessage = "Database Error";

    sinon.stub(User, "findOne").rejects(new Error(errorMessage));

    await reset_password(req, res);

    assert(res.status.calledWith(500));
    assert(res.json.calledWithMatch({ message: errorMessage }));
  });
});
