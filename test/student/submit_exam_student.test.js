import sinon from 'sinon';
import assert from 'assert';
import { submit_exam_student } from '../../backend/controller/student.js';
import Student from '../../backend/models/student.js';
import Exam from '../../backend/models/exam.js';

describe('submit_exam_student API Function', () => {
    let res;
    let req;
    let studentFindOneStub;
    let examFindOneStub;
    let studentSaveStub;

    beforeEach(() => {
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        };

        req = {
            user: { username: 'student123' },
            body: { examId: 'exam123' },
        };

        studentFindOneStub = sinon.stub(Student, 'findOne');
        examFindOneStub = sinon.stub(Exam, 'findOne');
        studentSaveStub = sinon.stub().resolves();
    });

    afterEach(() => {
        if (studentFindOneStub.restore) studentFindOneStub.restore();
        if (examFindOneStub.restore) examFindOneStub.restore();
    });

    it('should return 404 if username is not found', async () => {
        req.user.username = null;

        await submit_exam_student(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: 'No Username Found' }));
    });

    it('should return 404 if student is not found', async () => {
        studentFindOneStub.resolves(null);

        await submit_exam_student(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: 'Student not found' }));
    });

    it('should return 404 if exam is not found', async () => {
        studentFindOneStub.resolves({ givenExams: [] });
        examFindOneStub.resolves(null);

        await submit_exam_student(req, res);

        assert(res.status.calledOnceWith(404));
        assert(res.json.calledWith({ message: 'Exam not found.' }));
    });

    it('should return 401 if the exam is not within the allowed time range', async () => {
        const mockExamData = {
            _id: 'exam123',
            startTime: new Date(Date.now() + 100000),
            duration: 30,
        };
    
        const studentData = {
            givenExams: [{
                exam: mockExamData._id,
                submitted: false,
                questions: [],
                obtained_score: 0,
            }],
        };
    
        const futureDate = new Date(mockExamData.startTime.getTime() + (mockExamData.duration + 1) * 60000);
        global.Date.now = () => futureDate.getTime();
    
        studentFindOneStub.resolves(studentData);
        examFindOneStub.resolves(mockExamData);
    
        await submit_exam_student(req, res);
    
        assert(res.status.calledOnceWith(401));
        assert(res.json.calledWith({ message: 'Exam is either ended or not started yet' }));
    });

    it('should return 401 if the exam is already submitted', async () => {
        const mockExamData = {
            _id: 'exam123',
            startTime: new Date(),
            duration: 30,
        };

        const studentData = {
            givenExams: [{
                exam: mockExamData._id,
                submitted: true,
            }],
        };

        studentFindOneStub.resolves(studentData);
        examFindOneStub.resolves(mockExamData);

        await submit_exam_student(req, res);

        assert(res.status.calledOnceWith(401));
        assert(res.json.calledWith({ message: 'Exam was already submitted' }));
    });

    it('should return 500 if there is an internal error in saving student data', async () => {
        const error = new Error('Database error');
        studentSaveStub.rejects(error);

        const mockExamData = {
            _id: 'exam123',
            startTime: new Date(),
            duration: 30,
        };

        const studentData = {
            givenExams: [{
                exam: mockExamData._id,
                submitted: false,
                questions: [],
                obtained_score: 0,
            }],
        };

        studentFindOneStub.resolves(studentData);
        examFindOneStub.resolves(mockExamData);

        await submit_exam_student(req, res);

        assert(res.status.calledOnceWith(500));
        assert(res.json.calledWith({ message: 'Failed to submit exam' }));
    });
});
