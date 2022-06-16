const authMiddleware = require("../middleware/auth");
const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

describe("Auth middleware", () => {
  it("show throw an error if no authorization header is present", () => {
    const req = {
      get: () => {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated."
    );
  });

  it("should throw an error if the authorization header is only one string", () => {
    const req = {
      get: (headerName) => {
        return "xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
  it("should yield a userId after decoding the token", () => {
    const req = {
      get: (headerName) => {
        return "Bearer adsadsadsadsadsadsa";
      },
    };
    sinon.stub(jwt, "verify");
    jwt.verify.returns({userId: 'abc'});
    // jwt.verify = () => {
    //   return {
    //     userId: "abc",
    //   };
    // };
    authMiddleware(req, {}, () => {});
    expect(req).to.property("userId");
    expect(req).to.property("userId", 'abc');
    jwt.verify.restore();
  });

  it("should throw an error if the authorization header is only one string", () => {
    const req = {
      get: (headerName) => {
        return "Bearer xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
