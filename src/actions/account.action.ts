"use server";

import { accountService } from "@/services/account.service";
import { CreateAccountResponse } from "@/types";

export const accountAction = {
  createAccount: async (password: string): Promise<CreateAccountResponse> => {
    const response = await accountService.createAccount(password);
    return response;
  },
};
