import { RequestHandler } from "express";
import { Account } from "z@DBs/schemas/accounts/schema-account";
import { DietTypes, Reply } from "z@DBs/schemas/replies/schema-reply";
import { HTTPStatusCodes } from "z@Errors/error-base";
import ServiceReply from "z@Services/replies/service-reply";

type RequestParams = {
  id: string;
};

type RequestBody = {
  user: Account;
  isAttending: boolean;
  diet: DietTypes;
  remarks: string;
};

class ControllerReply {
  // private className = "ControllerReply";
  private replyService = new ServiceReply();

  getExistingReply: RequestHandler = async (req, res, next) => {
    const params = req.params as RequestParams;
    try {
      const existingReply = await this.replyService.findReplyById(params.id);
      return res.status(HTTPStatusCodes.OK).json({
        message: "Success",
        data: existingReply,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllExistingReplies: RequestHandler = async (req, res, next) => {
    try {
      const existingReplies: Reply[] = await this.replyService.findReplies();
      res
        .status(HTTPStatusCodes.OK)
        .json({ message: "Success", data: existingReplies });
    } catch (error) {
      next(error);
    }
  };

  updateExistingReply: RequestHandler = async (req, res, next) => {
    const params = req.params as RequestParams;
    const body = req.body as RequestBody;
    try {
      const existingReply = await this.replyService.findReplyById(params.id);
      const data: Reply = {
        ...existingReply,
        isAttending: body.isAttending,
        diet: body.diet,
        remarks: body.remarks,
      } as Reply;
      const updatedReply = await this.replyService.updateReply(data);
      return res.status(HTTPStatusCodes.OK).json({
        message: "Success",
        data: updatedReply,
      });
    } catch (error) {
      next(error);
    }
  };

  getExistingReplyByAccountId: RequestHandler = async (req, res, next) => {
    const params = req.params as RequestParams;
    const body = req.body as RequestBody;
    try {
      const query = {
        account: params.id || body.user._id,
      };
      let existingReplies: Reply[] = await this.replyService.findReplies(query);
      /**
       * Create a "Reply" for new Account if:
       * - Account does not have any existing Reply tagged to it.
       */
      if (!existingReplies[0]) {
        const replyData: Reply = {
          account: query.account,
          isAttending: false,
        } as Reply;
        existingReplies = [await this.replyService.createReply(replyData)];
      }
      res
        .status(HTTPStatusCodes.OK)
        .json({ message: "Success", data: existingReplies[0] });
    } catch (error) {
      next(error);
    }
  };

  updateExistingReplyByAccountId: RequestHandler = async (req, res, next) => {
    const params = req.params as RequestParams;
    const body = req.body as RequestBody;
    try {
      const query = {
        account: params.id || body.user._id,
      };
      const existingReplies = await this.replyService.findReplies(query);
      existingReplies[0].isAttending = body.isAttending;
      existingReplies[0].diet = body.diet;
      existingReplies[0].remarks = body.remarks;
      const updatedReply = await this.replyService.updateReply(
        existingReplies[0]
      );
      return res.status(HTTPStatusCodes.OK).json({
        message: "Success",
        data: updatedReply,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ControllerReply;
