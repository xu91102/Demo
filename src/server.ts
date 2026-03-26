import { createApp } from "./app";
import { env } from "./shared/config/env";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
  console.log(`Swagger docs are available at http://localhost:${env.PORT}/api-docs`);
});
