import { Account, ModelAccount } from "z@DBs/schemas/accounts/schema-account";
import ErrorBase, { HTTPStatusCodes } from "z@Errors/error-base";
import Logger from "z@Utils/loggers/utils-logger";

class ServiceAccount {
  private className = "ServiceAccount";

  async findAccounts(
    criteria?: any,
    showSensitive: boolean = false
  ): Promise<Account[]> {
    if (showSensitive) {
      return await ModelAccount.find(criteria)
        .select("+access")
        .select("+hash")
        .exec();
    }
    return await ModelAccount.find(criteria);
  }

  async findAccountById(
    id: string,
    showSensitive: boolean = false
  ): Promise<Account> {
    let account: Account;
    if (showSensitive) {
      account = await ModelAccount.findById(id)
        .select("+access")
        .select("+hash")
        .exec();
    } else {
      account = await ModelAccount.findById(id);
    }
    if (account) {
      return account;
    }
    Logger.debug(`[${this.className} - findAccountById]: Non-existing account`);
    throw new ErrorBase(
      "Account retrieval unsuccessful",
      HTTPStatusCodes.NOT_FOUND,
      true
    );
  }

  async createAccount(newAccount: Account): Promise<Account> {
    let account = new ModelAccount(newAccount);
    account = await account.save();
    return account;
  }

  async updateAccount(updatedAccount: Account): Promise<Account> {
    const account = await ModelAccount.findById(updatedAccount._id);
    if (account) {
      (Object.keys(updatedAccount) as (keyof Account)[]).forEach((key) => {
        if (key === "_id") return;
        account[key] = updatedAccount[key];
      });
      await account.save();
      return account;
    }
    Logger.debug(
      `[${this.className} - updateAccount]: Failed to update account`
    );
    throw new ErrorBase(
      "Account update unsuccessful",
      HTTPStatusCodes.INTERNAL_SERVER_ERROR,
      true
    );
  }

  async deleteAccount(id: string): Promise<Account> {
    const account = await ModelAccount.findById(id);
    if (account) {
      await account.remove();
      return account;
    }
    Logger.debug(
      `[${this.className} - deleteAccount]: Failed to delete account`
    );
    throw new ErrorBase(
      "Account deletion unsuccessful",
      HTTPStatusCodes.NOT_FOUND,
      true
    );
  }
}

export default ServiceAccount;
