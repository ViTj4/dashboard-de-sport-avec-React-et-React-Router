import { env } from "../config/env.server.js";
import { createApiRepository } from "./repositories/apiRepository.server.js";
import { createMockRepository } from "../mocks/mockRepository.server.js";
import { createAuthService } from "./auth.server.js";
import { createUserService } from "./user.server.js";
import { createProfileService } from "./profile.server.js";

// Point de composition : les services et les vues gardent le même contrat quel que soit DATA_SOURCE.
const repository = env.dataSource === "mock"
  ? createMockRepository()
  : createApiRepository({ baseURL: env.apiBaseUrl });

export const authService = createAuthService(repository);
export const userService = createUserService(repository);
export const profileService = createProfileService(userService);
