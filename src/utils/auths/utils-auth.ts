import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import _ from "lodash";
import ErrorBase, { HTTPStatusCodes } from "z@Errors/error-base";
import ENV from "z@Utils/env/utils-env";
import Logger from "z@Utils/loggers/utils-logger";

const className = "UtilsAuth";

export const validateAuthorizationToken = (token: string): void => {
  try {
    /**
     * If authorization token is decoded,
     * the authorization is valid
     */
    verify(token);
  } catch (error) {
    Logger.debug(
      `[${className} - validateAuthorizationToken]: Invalid/Expired authorization token`
    );
    throw new ErrorBase(
      "Authorization token not valid",
      HTTPStatusCodes.NOT_ACCEPTABLE,
      true
    );
  }
};

export const validateAuthorizationScheme = (authorization: string): string => {
  if (_.isEmpty(authorization)) {
    Logger.debug(
      `[${className} - validateAuthorizationScheme]: Missing authorization`
    );
    throw new ErrorBase(
      "Missing authorization",
      HTTPStatusCodes.FORBIDDEN,
      true
    );
  }
  const authorizationParts = authorization.split(" ");
  /**
   * If authorization does not contain 'Bearer' and 'Token',
   * the authorization scheme is not recognized
   */
  if (authorizationParts.length !== 2) {
    Logger.debug(
      `[${className} - validateAuthorizationScheme]: Invalid authorization length`
    );
    throw new ErrorBase(
      "Authorization scheme not recognized",
      HTTPStatusCodes.BAD_REQUEST,
      true
    );
  }
  /**
   * If authorization scheme is not 'Bearer',
   * the authorization scheme is forbidden
   */
  if (!/^Bearer$/i.test(authorizationParts[0])) {
    Logger.debug(
      `[${className} - validateAuthorizationScheme]: Invalid authorization scheme`
    );
    throw new ErrorBase(
      "Authorization scheme not valid",
      HTTPStatusCodes.FORBIDDEN,
      true
    );
  }
  return authorizationParts[1];
};

export const encrypt = async (target: string): Promise<string> =>
  await bcrypt.hash(target, ENV.BCRYPT_SALT_ROUNDS);

export const compare = async (pin: string, hash: string): Promise<boolean> =>
  await bcrypt.compare(pin, hash);

export const verify = (token: string): string | jwt.JwtPayload =>
  jwt.verify(token, ENV.JWT_SECRET);
