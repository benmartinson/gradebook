import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { testBedrock } from "./bedrock";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/bedrock/test",
  method: "POST",
  handler: testBedrock,
});

http.route({
  path: "/bedrock/test",
  method: "OPTIONS",
  handler: testBedrock,
});

export default http;
