import { ModelUpload, Upload } from "z@DBs/schemas/uploads/schema-upload";
import ErrorBase, { HTTPStatusCodes } from "z@Errors/error-base";
import Logger from "z@Utils/loggers/utils-logger";

class ServiceUpload {
  private className = "ServiceUpload";

  async findUploads(criteria?: any): Promise<Upload[]> {
    return await ModelUpload.find(criteria).populate("account");
  }

  async findUploadById(id: string): Promise<Upload> {
    const upload = await ModelUpload.findById(id).populate("account");
    if (upload) {
      return upload;
    }
    Logger.debug(`[${this.className} - findUploadById]: Non-existing Upload`);
    throw new ErrorBase(
      "Upload retrieval unsuccessful",
      HTTPStatusCodes.NOT_FOUND,
      true
    );
  }

  async createSingleUpload(newUpload: Upload): Promise<Upload> {
    let upload = new ModelUpload(newUpload);
    upload = await upload.save();
    return upload;
  }

  async createMultipleUpload(
    newUploads: Upload[]
  ): Promise<{ uploads: Upload[]; bulkWriteResults: any }> {
    let uploads = newUploads.map(
      (newUpload: Upload) => new ModelUpload(newUpload)
    );
    const bulkWriteResults = await ModelUpload.bulkSave(uploads);
    return { uploads, bulkWriteResults };
  }

  async deleteUpload(id: string): Promise<Upload> {
    const upload = await ModelUpload.findById(id);
    if (upload) {
      await upload.remove();
      return upload;
    }
    Logger.debug(
      `[${this.className} - deleteUpload]: Failed to delete account`
    );
    throw new ErrorBase(
      "Upload deletion unsuccessful",
      HTTPStatusCodes.NOT_FOUND,
      true
    );
  }
}

export default ServiceUpload;
