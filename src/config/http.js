import expressApp from "./express.js";
import { createServer } from "http";

const httpServer = createServer(expressApp);

export default httpServer