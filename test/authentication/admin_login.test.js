import sinon from "sinon";
import assert from "assert";
import bcrypt from "bcrypt";
import { admin_login } from "../../backend/controller/authentication.js";
import User from "../../backend/models/user.js";
import * as jwtUtils from "../../backend/config/jwtUtils.js"; // Import the entire module

describe("admin_login API Function", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: "admin",
        password: "password123",
      },
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore(); // Restore all stubs after each test
  });

  it("should return a 401 error if admin is not found", async () => {
    sinon.stub(User, "findOne").resolves(null); // Simulate no admin found

    await admin_login(req, res);

    assert(res.status.calledOnceWithExactly(401));
  });

  it("should return a 401 error if the password does not match", async () => {
    const mockAdmin = { username: "admin", password: "hashedpassword", role: "admin" };
    sinon.stub(User, "findOne").resolves(mockAdmin);
    sinon.stub(bcrypt, "compare").resolves(false);

    await admin_login(req, res);

    assert(res.status.calledOnceWithExactly(401));
    assert(res.json.calledWithMatch({ message: "Invalid Email/Username or Password!" }));
  });

  it("should return a 500 error if an exception occurs", async () => {
    sinon.stub(User, "findOne").throws(new Error("Database Error"));  // Simulate a database error

    await admin_login(req, res);

    assert(res.status.calledOnceWithExactly(500));
    assert(res.json.calledWithMatch({ message: "Database Error" }));
  });
});
