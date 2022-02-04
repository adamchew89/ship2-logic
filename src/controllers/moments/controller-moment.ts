import { RequestHandler } from "express";
import { Account } from "z@DBs/schemas/accounts/schema-account";
import { Moment } from "z@DBs/schemas/moments/schema-moment";
import { Upload } from "z@DBs/schemas/uploads/schema-upload";
import { HTTPStatusCodes } from "z@Errors/error-base";
import { removeFile, uploadFile } from "z@Helpers/aws/helper-aws-s3";
import ServiceMoment from "z@Services/moments/service-moment";
import ServiceUpload from "z@Services/uploads/service-upload";
import * as UtilsFile from "z@Utils/files/utils-file";

type RequestParams = {
  id: string;
};

type RequestBody = {
  user: Account;
  sentiment?: string;
};

class ControllerMoment {
  // private className = "ControllerMoment";
  private uploadService = new ServiceUpload();
  private momentService = new ServiceMoment();

  getExistingMoment: RequestHandler = async (req, res, next) => {
    const params = req.params as RequestParams;
    try {
      const existingMoment = await this.momentService.findMomentById(params.id);
      return res.status(HTTPStatusCodes.OK).json({
        message: "Success",
        data: existingMoment,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllExistingMoments: RequestHandler = async (req, res, next) => {
    const body = req.body as RequestBody;
    const params = req.params as RequestParams;
    try {
      const query = {
        account: params.id || body.user._id,
      };
      const newAccount: Moment[] = await this.momentService.findMoments(query);
      res
        .status(HTTPStatusCodes.OK)
        .json({ message: "Success", data: newAccount });
    } catch (error) {
      next(error);
    }
  };

  createNewMoment: RequestHandler = async (req, res, next) => {
    const body = req.body as RequestBody;
    const files = req.files as unknown as Upload[];
    if (files.length) {
      const tempFiles = [...files];
      try {
        // Attempt to upload file to remote storage
        await Promise.all(
          files.map(async (file, index) => {
            const uploadResult = await uploadFile(file);
            await UtilsFile.unlinkFile(file.path);
            tempFiles[index].account = body.user._id;
            tempFiles[index].key = uploadResult.Key;
            tempFiles[index].bucket = uploadResult.Bucket;
            tempFiles[index].uri = uploadResult.Location;
          })
        );
        // Insert upload records to DB
        const { uploads: newUploads, bulkWriteResults } =
          await this.uploadService.createMultipleUpload(tempFiles);
        // Create uploads linked moment in DB
        const data: Moment = {
          account: body.user._id,
          uploads: newUploads!.map((u) => u._id),
          sentiment: body.sentiment,
        } as Moment;
        const newMoment = await this.momentService.createMoment(data);
        return res.status(HTTPStatusCodes.CREATED).json({
          message: "Success",
          data: newMoment,
          meta: bulkWriteResults,
        });
      } catch (error) {
        next(error);
      }
    }
  };

  deleteExistingMoment: RequestHandler = async (req, res, next) => {
    const params = req.params as RequestParams;
    try {
      const moment = await this.momentService.findMomentById(params.id);
      const uploads: Upload[] = moment.uploads! as Upload[];
      const deletedMoment = await this.momentService.deleteMoment(moment._id);
      await Promise.all(
        uploads.map(async (upload) => await removeFile(upload.key))
      );
      res
        .status(HTTPStatusCodes.OK)
        .json({ message: "Moment deleted.", data: deletedMoment });
    } catch (error) {
      next(error);
    }
  };
}

export default ControllerMoment;
