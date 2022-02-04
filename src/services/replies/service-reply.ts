import { ModelReply, Reply } from "z@DBs/schemas/replies/schema-reply";
import ErrorBase, { HTTPStatusCodes } from "z@Errors/error-base";
import Logger from "z@Utils/loggers/utils-logger";

class ServiceReply {
  private className = "ServiceReply";

  async findReplies(criteria?: any): Promise<Reply[]> {
    return await ModelReply.find(criteria).populate("account");
  }

  async findReplyById(id: string): Promise<Reply> {
    const reply = await ModelReply.findById(id).populate("account");
    if (reply) {
      return reply;
    }
    Logger.debug(`[${this.className} - findReplyById]: Non-existing Reply`);
    throw new ErrorBase(
      "Reply retrieval unsuccessful",
      HTTPStatusCodes.NOT_FOUND,
      true
    );
  }

  async createReply(newReply: Reply): Promise<Reply> {
    let reply = new ModelReply(newReply);
    reply = await reply.save();
    return reply;
  }

  async deleteReply(id: string): Promise<Reply> {
    const reply = await ModelReply.findById(id);
    if (reply) {
      await reply.remove();
      return reply;
    }
    Logger.debug(`[${this.className} - deleteReply]: Failed to delete reply`);
    throw new ErrorBase(
      "Reply deletion unsuccessful",
      HTTPStatusCodes.NOT_FOUND,
      true
    );
  }

  async updateReply(updatedReply: Reply): Promise<Reply> {
    const reply = await ModelReply.findById(updatedReply._id);
    if (reply) {
      (Object.keys(updatedReply) as (keyof Reply)[]).forEach((key) => {
        if (key === "_id") return;
        reply[key] = updatedReply[key];
      });
      await reply.save();
      return reply;
    }
    Logger.debug(`[${this.className} - updateReply]: Failed to update reply`);
    throw new ErrorBase(
      "Reply update unsuccessful",
      HTTPStatusCodes.INTERNAL_SERVER_ERROR,
      true
    );
  }
}

export default ServiceReply;
