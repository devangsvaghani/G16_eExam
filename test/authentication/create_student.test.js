import sinon from "sinon";
import assert from "assert";
import bcrypt from "bcrypt";
import { create_student } from "../../backend/controller/authentication.js";
import User from "../../backend/models/user.js";
import Student from "../../backend/models/student.js";

const generate_password = sinon.stub().returns("mockPassword123");
const generate_student_id = sinon.stub().returns("S123456");

describe("create_student API Function", function () {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        firstname: "John",
        lastname: "Doe",
        middlename: "M",
        dob: "2000-01-01",
        mobileno: "1234567890",
        email: "johndoe@example.com",
        gender: "Male",
        batch: "2024",
        branch: "Computer Science",
        graduation: "2024"
      }
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return a 200 response with the student information for valid inputs", async () => {
    const saveUserStub = sinon.stub(User.prototype, "save").resolves({
      username: "S123456",
      firstname: "John",
      lastname: "Doe",
      email: "johndoe@example.com"
    });
    const saveStudentStub = sinon.stub(Student.prototype, "save").resolves();
    const bcryptHashStub = sinon.stub(bcrypt, "hash").resolves("hashedPassword123");
    const countDocumentsStub = sinon.stub(Student, "countDocuments").resolves(10);

    await create_student(req, res);

    assert(res.status.calledWith(200));
    assert(res.json.calledWithMatch({
      message: "Student created successfully",
      user: {
        username: "S123456",
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@example.com"
      }
    }));

    saveUserStub.restore();
    saveStudentStub.restore();
    bcryptHashStub.restore();
    countDocumentsStub.restore();
  });

  it("should return a 400 error if required fields are missing", async () => {
    req.body = {};

    await create_student(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWithMatch({ message: "All fields are required!" }));
  });

  it("should return a 400 error for invalid email format", async () => {
    req.body.email = "invalidemail";

    await create_student(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWithMatch({ message: "Invalid email format." }));
  });

  it("should return a 400 error for invalid mobile number format", async () => {
    req.body.mobileno = "12345";

    await create_student(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWithMatch({ message: "Mobile number must be exactly 10 digits." }));
  });

  it("should return a 400 error for invalid date of birth format", async () => {
    req.body.dob = "01-01-2000";

    await create_student(req, res);

    assert(res.status.calledWith(400));
    assert(res.json.calledWithMatch({ message: "Invalid date of birth format. Use YYYY-MM-DD." }));
  });

  it("should return a 500 error if there is a server error", async () => {
    const errorMessage = "Database Error";

    sinon.stub(User.prototype, "save").rejects(new Error(errorMessage));

    await create_student(req, res);

    assert(res.status.calledWith(500));
    assert(res.json.calledWithMatch({ message: errorMessage }));

    User.prototype.save.restore();
  });
});
