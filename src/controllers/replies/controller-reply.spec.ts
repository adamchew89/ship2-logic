import { getMockReq, getMockRes } from "@jest-mock/express";
import { NextFunction, Request, Response } from "express";
import { Reply } from "z@DBs/schemas/replies/schema-reply";
import { HTTPStatusCodes } from "z@Errors/error-base";
import * as FixtureAccounts from "z@Fixtures/accounts/fixture-account";
import * as FixtureReplies from "z@Fixtures/replies/fixture-reply";
import ServiceReply from "z@Services/replies/service-reply";
import ControllerReply from "./controller-reply";

jest.mock("z@Services/replies/service-reply");

describe("[ControllerReply]", () => {
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;
  let replyController: ControllerReply;

  beforeEach(() => {
    mockReq = getMockReq();
    const { res } = getMockRes();
    mockRes = res;
    mockNext = jest.fn();
    replyController = new ControllerReply();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of ControllerReply", () => {
    expect(replyController).toBeDefined();
    expect(replyController).toBeInstanceOf(ControllerReply);
  });

  describe("[getAllExistingReplies]", () => {
    beforeEach(() => {
      jest
        .spyOn(ServiceReply.prototype, "findReplies")
        .mockImplementation((criteria) =>
          Promise.resolve(FixtureReplies.replies)
        );

      mockReq = getMockReq({
        body: { user: FixtureAccounts.accounts[0] },
        params: {},
      });
    });

    it("(Happy Path) should return Success OK", async () => {
      await replyController.getAllExistingReplies(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) should return Failure when replies retrieval fails", async () => {
      jest
        .spyOn(ServiceReply.prototype, "findReplies")
        .mockImplementationOnce((criteria) => Promise.reject(new Error()));
      await replyController.getAllExistingReplies(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("[getExistingReply]", () => {
    beforeEach(() => {
      jest
        .spyOn(ServiceReply.prototype, "findReplyById")
        .mockImplementation((criteria) =>
          Promise.resolve(FixtureReplies.replies[0])
        );

      mockReq = getMockReq({
        params: { id: "id" },
      });
    });

    it("(Happy Path) should return Success OK", async () => {
      await replyController.getExistingReply(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) should return Failure when reply retrieval fails", async () => {
      jest
        .spyOn(ServiceReply.prototype, "findReplyById")
        .mockImplementationOnce((criteria) => Promise.reject(new Error()));
      await replyController.getExistingReply(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("[updateExistingReply]", () => {
    beforeEach(() => {
      mockReq = getMockReq({
        body: FixtureReplies.replies[0],
        params: { id: FixtureReplies.replies[0]._id },
      });
      jest
        .spyOn(ServiceReply.prototype, "findReplyById")
        .mockImplementation((id: string) =>
          Promise.resolve(FixtureReplies.replies[0])
        );
    });

    it("(Happy Path) should return Success OK", async () => {
      await replyController.updateExistingReply(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) show return Failure if reply was not retrieved successfully", async () => {
      jest
        .spyOn(ServiceReply.prototype, "findReplyById")
        .mockImplementationOnce((id: string) => Promise.reject(new Error()));
      await replyController.updateExistingReply(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("(Failure Path) show return Failure if reply could not update successfully", async () => {
      jest
        .spyOn(ServiceReply.prototype, "updateReply")
        .mockImplementationOnce((reply: Reply) => Promise.reject(new Error()));
      await replyController.updateExistingReply(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("[getExistingReplyByAccountId]", () => {
    beforeEach(() => {
      mockReq = getMockReq({
        params: { id: FixtureReplies.replies[0]._id },
      });
      jest
        .spyOn(ServiceReply.prototype, "findReplies")
        .mockImplementation((query: any) =>
          Promise.resolve(FixtureReplies.replies)
        );
    });

    it("(Happy Path) should return Success OK", async () => {
      await replyController.getExistingReplyByAccountId(
        mockReq,
        mockRes,
        mockNext
      );
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Happy Path) should return Success OK where params is empty", async () => {
      mockReq = getMockReq({
        body: {
          user: FixtureAccounts.accounts[0],
        },
      });
      await replyController.getExistingReplyByAccountId(
        mockReq,
        mockRes,
        mockNext
      );
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Happy Path) should create Reply if not found", async () => {
      jest
        .spyOn(ServiceReply.prototype, "findReplies")
        .mockImplementationOnce((query: any) => Promise.resolve([]));
      const mockCreateReply = jest.spyOn(ServiceReply.prototype, "createReply");
      expect(mockCreateReply).toHaveBeenCalledTimes(0);
      await replyController.getExistingReplyByAccountId(
        mockReq,
        mockRes,
        mockNext
      );
      expect(mockCreateReply).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) show return Failure if reply was not retrieved successfully", async () => {
      jest
        .spyOn(ServiceReply.prototype, "findReplies")
        .mockImplementationOnce((query: any) => Promise.reject(new Error()));
      await replyController.getExistingReplyByAccountId(
        mockReq,
        mockRes,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("[updateExistingReplyByAccountId]", () => {
    beforeEach(() => {
      mockReq = getMockReq({
        body: {
          ...FixtureReplies.replies[0],
          user: FixtureAccounts.accounts[0],
        },
        params: { id: FixtureReplies.replies[0]._id },
      });
      jest
        .spyOn(ServiceReply.prototype, "findReplies")
        .mockImplementation((query: any) =>
          Promise.resolve(FixtureReplies.replies)
        );
    });

    it("(Happy Path) should return Success OK", async () => {
      await replyController.updateExistingReplyByAccountId(
        mockReq,
        mockRes,
        mockNext
      );
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Happy Path) should return Success OK where params is empty", async () => {
      mockReq = getMockReq({
        body: {
          ...FixtureReplies.replies[0],
          user: FixtureAccounts.accounts[0],
        },
      });
      await replyController.updateExistingReplyByAccountId(
        mockReq,
        mockRes,
        mockNext
      );
      expect(mockRes.status).toHaveBeenCalledWith(HTTPStatusCodes.OK);
    });

    it("(Failure Path) show return Failure if reply was not retrieved successfully", async () => {
      jest
        .spyOn(ServiceReply.prototype, "findReplies")
        .mockImplementationOnce((query: any) => Promise.reject(new Error()));
      await replyController.updateExistingReplyByAccountId(
        mockReq,
        mockRes,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it("(Failure Path) show return Failure if reply could not update successfully", async () => {
      jest
        .spyOn(ServiceReply.prototype, "updateReply")
        .mockImplementationOnce((reply: Reply) => Promise.reject(new Error()));
      await replyController.updateExistingReplyByAccountId(
        mockReq,
        mockRes,
        mockNext
      );
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
