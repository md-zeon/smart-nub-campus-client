"use server";

import { accountService } from "@/services/account.service";
import type { CreateAccountResponse } from "@/types";

export async function createAccount(
  password: string,
): Promise<CreateAccountResponse> {
  const response = await accountService.createAccount(password);
  return response;
}
