import ModelAccount, { Account } from "z@DBs/schemas/accounts/schema-account";
import ErrorBase, { HTTPStatusCodes } from "z@Errors/error-base";
import Logger from "z@Utils/loggers/utils-logger";

class ServiceAccount {
  private className = "ServiceAccount";

  async findAccounts(
    criteria?: any,
    showSensitive: boolean = false
  ): Promise<Account[]> {
    if (showSensitive) {
      // return await ModelAccount.find(criteria)
      //   .select("+access")
      //   .select("+hash")
      //   .exec();
      return ModelAccount.find(criteria);
    }
    return ModelAccount.find(criteria);
  }

  async findAccountById(
    _id: number,
    showSensitive: boolean = false
  ): Promise<Account> {
    let account: Account;
    if (showSensitive) {
      // account = await ModelAccount.findById(id)
      //   .select("+access")
      //   .select("+hash")
      //   .exec();
      account = (await ModelAccount.findOne({ _id })) as Account;
    } else {
      account = (await ModelAccount.findOne({ _id })) as Account;
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
    const account = new ModelAccount();
    (Object.keys(newAccount) as (keyof Account)[]).forEach((key) => {
      if (key === "_id") return;
      account[key] = newAccount[key]! as any;
    });
    await account.save();
    return account;
  }

  async updateAccount(updatedAccount: Account): Promise<Account> {
    // const account = await ModelAccount.findById(updatedAccount._id);
    const account = (await ModelAccount.findOne({
      _id: updatedAccount._id,
    })) as ModelAccount;
    if (account) {
      (Object.keys(updatedAccount) as (keyof Account)[]).forEach((key) => {
        if (key === "_id") return;
        account[key] = updatedAccount[key]! as any;
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

  async deleteAccount(_id: number): Promise<Account> {
    const account = (await ModelAccount.findOne({
      _id,
    })) as ModelAccount;
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
