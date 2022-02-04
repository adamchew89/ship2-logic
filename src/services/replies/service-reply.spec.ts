import { ModelReply } from "z@DBs/schemas/replies/schema-reply";
import ErrorBase, { HTTPStatusCodes } from "z@Errors/error-base";
import * as FixtureReplies from "z@Fixtures/replies/fixture-reply";
import ServiceReply from "./service-reply";

jest.mock("z@DBs/schemas/replies/schema-reply");

describe("[ServiceReply]", () => {
  let replyService: ServiceReply;

  beforeEach(() => {
    replyService = new ServiceReply();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should create an instance of ServiceReply", () => {
    expect(replyService).toBeDefined();
    expect(replyService).toBeInstanceOf(ServiceReply);
  });

  describe("[findReplies]", () => {
    it("(Happy Path) should return Reply[] when called", async () => {
      const mockPopulate = jest.fn();
      jest
        .spyOn(ModelReply, "find")
        // @ts-ignore
        .mockImplementationOnce(
          jest.fn().mockImplementationOnce(() => ({
            populate: mockPopulate.mockImplementationOnce(
              jest.fn().mockResolvedValueOnce(FixtureReplies.replies)
            ),
          }))
        );
      const response = await replyService.findReplies();
      expect(response).toMatchObject(FixtureReplies.replies);
    });
  });

  describe("[findReplyById]", () => {
    it("(Happy Path) should return Reply when called", async () => {
      const mockPopulate = jest.fn();
      jest
        .spyOn(ModelReply, "findById")
        // @ts-ignore
        .mockImplementationOnce(
          jest.fn().mockImplementationOnce(() => ({
            populate: mockPopulate.mockImplementationOnce(
              jest.fn().mockResolvedValueOnce(FixtureReplies.replies[0])
            ),
          }))
        );
      const response = await replyService.findReplyById(
        FixtureReplies.replies[0]._id
      );
      expect(response).toMatchObject(FixtureReplies.replies[0]);
    });

    it("(Failure Path) should return NOT_FOUND when called", async () => {
      expect.assertions(1);
      const mockPopulate = jest.fn();
      jest
        .spyOn(ModelReply, "findById")
        // @ts-ignore
        .mockImplementationOnce(
          jest.fn().mockImplementationOnce(() => ({
            populate: mockPopulate.mockImplementationOnce(
              jest.fn().mockResolvedValueOnce(undefined)
            ),
          }))
        );
      try {
        await replyService.findReplyById(FixtureReplies.replies[0]._id);
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorBase);
      }
    });
  });

  describe("[createReply]", () => {
    it("(Happy Path) should return Reply when called", async () => {
      jest
        .spyOn(ModelReply.prototype, "save")
        // @ts-ignore
        .mockImplementationOnce((criteria: any) =>
          Promise.resolve(FixtureReplies.replies[0])
        );
      const response = await replyService.createReply(
        FixtureReplies.replies[0]
      );
      expect(response).toMatchObject(FixtureReplies.replies[0]);
    });
  });

  describe("[updateReply]", () => {
    it("(Happy Path) should return Reply when called", async () => {
      jest
        .spyOn(ModelReply, "findById")
        // @ts-ignore
        .mockImplementationOnce((id: string) =>
          Promise.resolve({ ...FixtureReplies.replies[0], save: jest.fn() })
        );
      const response = await replyService.updateReply(
        FixtureReplies.replies[0]
      );
      expect(response).toMatchObject(FixtureReplies.replies[0]);
    });

    it("(Happy Path) should return Failure INTERNAL_SERVER_ERROR when called", async () => {
      expect.assertions(1);
      jest
        .spyOn(ModelReply, "findById")
        // @ts-ignore
        .mockImplementationOnce((id: string) => Promise.resolve());
      try {
        await replyService.updateReply(FixtureReplies.replies[0]);
      } catch (error) {
        expect((error as ErrorBase).statusCode).toBe(
          HTTPStatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    });
  });

  describe("[deleteReply]", () => {
    it("(Happy Path) should return Reply when called", async () => {
      jest
        .spyOn(ModelReply, "findById")
        // @ts-ignore
        .mockImplementationOnce((id: string) =>
          Promise.resolve({ ...FixtureReplies.replies[0], remove: jest.fn() })
        );
      expect(
        await replyService.deleteReply(FixtureReplies.replies[0]._id)
      ).toMatchObject(FixtureReplies.replies[0]);
    });

    it("(Failure Path) should return NOT_FOUND when called", async () => {
      expect.assertions(1);
      jest
        .spyOn(ModelReply, "findById")
        // @ts-ignore
        .mockImplementationOnce((id: string) => Promise.resolve());
      try {
        await replyService.deleteReply(FixtureReplies.replies[0]._id);
      } catch (error) {
        expect(error).toBeInstanceOf(ErrorBase);
      }
    });
  });
});
