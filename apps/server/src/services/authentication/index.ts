import { AppService } from "@stasiunfile/api";

import { Controller } from "./controller";
import { InternalService as AuthenticationService } from "./service";

export const authenticationApiService = new AppService(
  "authentication",
  1,
  new Controller(new AuthenticationService()),
);

// gunakan ini jika hanya menginginkan core logic
// export {AuthenticationService}

// gunakan jika microservice
// export const apiServer = new ApiServer([authenticationApiService], [], Authentication.config.PORT);
// apiServer.run();
