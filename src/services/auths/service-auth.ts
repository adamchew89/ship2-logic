import jwt, { JwtPayload } from "jsonwebtoken";
import { Account } from "z@DBs/schemas/accounts/schema-account";
import ErrorUnauthorized from "z@Errors/error-unauthorized";
import ServiceAccount from "z@Services/accounts/service-account";
import { compare, encrypt } from "z@Utils/auths/utils-auth";
import ENV from "z@Utils/env/utils-env";
import Logger from "z@Utils/loggers/utils-logger";

class ServiceAuth {
  private className = "ServiceAuth";
  private accountService = new ServiceAccount();

  async verifyCredentials(credentials: Account, pin: string): Promise<Account> {
    const account = (
      await this.accountService.findAccounts(credentials, true)
    )[0];
    if (!account) {
      Logger.debug(
        `[${this.className} - verifyCredentials]: Non-existing account`
      );
      throw new ErrorUnauthorized();
    }
    if (await compare(pin, account.hash!)) {
      const { _id } = account;
      const token = await encrypt(
        JSON.stringify(_id) + new Date().toISOString()
      );
      account.token = token;
      await this.accountService.updateAccount(account);
      const { mobile, name } = account;
      const payload: Account = {
        _id,
        mobile,
        name,
        token: jwt.sign(
          {
            token,
          },
          ENV.JWT_SECRET,
          {
            algorithm: "HS256",
            expiresIn: "1h",
          }
        ),
      } as Account;
      return payload;
    }
    Logger.debug(
      `[${this.className} - verifyCredentials]: Invalid credentials provided`
    );
    throw new ErrorUnauthorized();
  }

  async verifyAuthorization(authorization: string): Promise<Account> {
    const decoded: JwtPayload = jwt.verify(
      authorization,
      ENV.JWT_SECRET
    ) as JwtPayload;
    const account = (
      await this.accountService.findAccounts({ token: decoded.token }, true)
    )[0];
    if (!account) {
      Logger.debug(
        `[${this.className} - verifyAuthorization]: Invalid token provided`
      );
      throw new ErrorUnauthorized();
    }
    return account;
  }

  async changeCredentials(
    id: number,
    currentPin: string,
    newPin: string
  ): Promise<void> {
    const account = await this.accountService.findAccountById(+id, true);
    if (await compare(currentPin, account.hash!)) {
      account.hash = await encrypt(newPin);
      await this.accountService.updateAccount(account);
      return;
    }
    Logger.debug(
      `[${this.className} - verifyAuthorization]: Invalid credentials provided`
    );
    throw new ErrorUnauthorized();
  }

  async resetCredentials(id: number, newPin: string): Promise<void> {
    const account = await this.accountService.findAccountById(+id, true);
    account.hash = await encrypt(newPin);
    await this.accountService.updateAccount(account);
    return;
  }
}

export default ServiceAuth;
