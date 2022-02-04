import { ModelMoment, Moment } from "z@DBs/schemas/moments/schema-moment";
import ErrorBase, { HTTPStatusCodes } from "z@Errors/error-base";
import Logger from "z@Utils/loggers/utils-logger";

class ServiceMoment {
  private className = "ServiceMoment";

  async findMoments(criteria?: any): Promise<Moment[]> {
    return await ModelMoment.find(criteria)
      .populate("account")
      .populate("uploads");
  }

  async findMomentById(id: string): Promise<Moment> {
    const upload = await ModelMoment.findById(id)
      .populate("account")
      .populate("upload");
    if (upload) {
      return upload;
    }
    Logger.debug(`[${this.className} - findMomentById]: Non-existing Moment`);
    throw new ErrorBase(
      "Moment retrieval unsuccessful",
      HTTPStatusCodes.NOT_FOUND,
      true
    );
  }

  async createMoment(newMoment: Moment): Promise<Moment> {
    let moment = new ModelMoment(newMoment);
    moment = await moment.save();
    return moment;
  }

  async deleteMoment(id: string): Promise<Moment> {
    const moment = await ModelMoment.findById(id);
    if (moment) {
      await moment.remove();
      return moment;
    }
    Logger.debug(
      `[${this.className} - deleteMoment]: Failed to delete account`
    );
    throw new ErrorBase(
      "Moment deletion unsuccessful",
      HTTPStatusCodes.NOT_FOUND,
      true
    );
  }
}

export default ServiceMoment;
