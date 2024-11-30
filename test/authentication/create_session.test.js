import sinon from "sinon";
import assert from "assert";
import bcrypt from "bcrypt";
import { create_session } from "../../backend/controller/authentication.js";
import User from "../../backend/models/user.js";
import * as jwtUtils from "../../backend/config/jwtUtils.js";

describe("create_session API Function", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        emailUsername: "testuser",
        password: "password123",
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

  it("should return a 401 error if user is not found", async () => {
    const findOneStub = sinon.stub(User, "findOne").resolves(null);

    await create_session(req, res);

    assert(res.status.calledWith(401));
    assert(res.json.calledWithMatch({ message: "Invalid Email/Username or Password!" }));
  });

  it("should return a 401 error if password does not match", async () => {
    const findOneStub = sinon.stub(User, "findOne").resolves({ username: "testuser", password: "hashedpassword" });
    const bcryptStub = sinon.stub(bcrypt, "compare").resolves(false);

    await create_session(req, res);

    assert(res.status.calledWith(401));
    assert(res.json.calledWithMatch({ message: "Invalid Email/Username or Password!" }));
  });

  it("should return a 500 error if an exception occurs", async () => {
    const findOneStub = sinon.stub(User, "findOne").throws(new Error("Database Error"));

    await create_session(req, res);

    assert(res.status.calledWith(500));
    assert(res.json.calledWithMatch({ message: "Database Error" }));
  });
});
