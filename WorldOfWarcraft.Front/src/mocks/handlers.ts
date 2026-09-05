import { createGatewayListHandler } from "@bari77/gc-msw";
import { environment } from "../environments/environment";
import { mockClasses } from "./data/classes";

export const handlers = [
  createGatewayListHandler({
    apiUrl: environment.apiUrl,
    microservice: "worldofwarcraft",
    resource: "Classes",
    data: mockClasses,
  }),
];
