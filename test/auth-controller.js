const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth controller", () => {
  before((done) => {
    mongoose
      .connect(
        "mongodb+srv://ozzy:Samedociel1@cluster0.jbtdl.mongodb.net/test-message",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then(() => {
        const user = new User({
          email: "tester1@testers.com",
          password: "12345",
          name: "Tester #1",
          posts: [],
          _id: "629beee2330a7788e5b4728d",
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });
  it("Should throw an error if accessing the database fails", (done) => {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "foo@bar.com",
        password: "password",
      },
    };

    AuthController.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });

    User.findOne.restore();
  });
  it("Should send a response with a valid user status for an existing user", (done) => {
    const req = {
      userId: "629beee2330a7788e5b4728d",
    };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: (code) => {
        this.statusCode = code;
        return this;
      },
      json: (data) => {
        this.userStatus = data.status;
      },
    };
    AuthController.login(req, res, () => {}).then((result) => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("I am new!");
      done();
    });
  });

  after((done) => {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
