import { RequestHandler } from "express";
import { Account } from "z@DBs/schemas/accounts/schema-account";
import { Upload } from "z@DBs/schemas/uploads/schema-upload";
import ErrorBase, { HTTPStatusCodes } from "z@Errors/error-base";
import {
  downloadFile,
  removeFile,
  uploadFile,
} from "z@Helpers/aws/helper-aws-s3";
import ServiceUpload from "z@Services/uploads/service-upload";
import * as UtilsFile from "z@Utils/files/utils-file";
import Logger from "z@Utils/loggers/utils-logger";

export interface Credential {
  name: string;
  email: string;
  mobile: string;
  pin: string;
}

type RequestParams = {
  id: string;
  uploadid: string;
  key: string;
};

type RequestBody = {
  user: Account;
};

class ControllerUpload {
  private className = "ControllerUpload";
  private uploadService = new ServiceUpload();

  getUploadedFile: RequestHandler = async (req, res, next) => {
    const params = req.params as RequestParams;
    try {
      const upload = (
        await this.uploadService.findUploads({ key: params.key })
      )[0];
      if (upload) {
        const readStream = await downloadFile(params.key);
        res.status(HTTPStatusCodes.OK);
        readStream.pipe(res);
      } else {
        Logger.debug(
          `[${this.className} - getUploadedFile]: Non-existing Upload`
        );
        throw new ErrorBase(
          "Upload retrieval unsuccessful",
          HTTPStatusCodes.NOT_FOUND,
          true
        );
      }
    } catch (error) {
      next(error);
    }
  };

  getAllExistingPublicUploads: RequestHandler = async (req, res, next) => {
    try {
      const query = {
        isPublic: true,
      };
      const existingPublicUploads: Upload[] =
        await this.uploadService.findUploads(query);
      res
        .status(HTTPStatusCodes.OK)
        .json({ message: "Success", data: existingPublicUploads });
    } catch (error) {
      next(error);
    }
  };

  getAllExistingUploads: RequestHandler = async (req, res, next) => {
    const body = req.body as RequestBody;
    const params = req.params as RequestParams;
    try {
      const query = {
        account: params.id || body.user._id,
      };
      const existingUploads: Upload[] = await this.uploadService.findUploads(
        query
      );
      res
        .status(HTTPStatusCodes.OK)
        .json({ message: "Success", data: existingUploads });
    } catch (error) {
      next(error);
    }
  };

  getExistingUpload: RequestHandler = async (req, res, next) => {
    const params = req.params as RequestParams;
    try {
      const id = params.uploadid ? params.uploadid : params.id;
      const existingUpload = await this.uploadService.findUploadById(id);
      return res.status(HTTPStatusCodes.OK).json({
        message: "Success",
        data: existingUpload,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadNewMedia: RequestHandler = async (req, res, next) => {
    const body = req.body as RequestBody;
    const file = req.file as unknown as Upload;
    try {
      const uploadResult = await uploadFile(file);
      file.account = body.user._id;
      file.key = uploadResult.Key;
      file.bucket = uploadResult.Bucket;
      file.uri = uploadResult.Location;
      await UtilsFile.unlinkFile(file.path);
      const newUpload = await this.uploadService.createSingleUpload(file);
      return res.status(HTTPStatusCodes.CREATED).json({
        message: "Success",
        data: newUpload,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadMultipleNewMedia: RequestHandler = async (req, res, next) => {
    const body = req.body as RequestBody;
    const files = req.files as unknown as Upload[];
    const tempFiles = [...files];
    try {
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
      const { uploads: newUploads, bulkWriteResults } =
        await this.uploadService.createMultipleUpload(tempFiles);
      return res.status(HTTPStatusCodes.CREATED).json({
        message: "Success",
        data: newUploads,
        meta: bulkWriteResults,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteExistingUpload: RequestHandler = async (req, res, next) => {
    const params = req.params as RequestParams;
    try {
      const upload = await this.uploadService.findUploadById(
        params.uploadid ? params.uploadid : params.id
      );
      await removeFile(upload.key);
      const deletedUpload = await this.uploadService.deleteUpload(upload._id);
      res
        .status(HTTPStatusCodes.OK)
        .json({ message: "Upload deleted.", data: deletedUpload });
    } catch (error) {
      next(error);
    }
  };
}

export default ControllerUpload;
