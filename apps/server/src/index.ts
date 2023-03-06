import ApiServer from "@stasiunfile/api";

import { authenticationApiService } from "./services/authentication";

export * from "./services/authentication";

export const apiServer = new ApiServer([authenticationApiService], [], 2000);
apiServer.run();
