import { createConfigNode } from "../../rollup.config";
import { dependencies, name } from "./package.json";

export default createConfigNode(name, Object.keys(dependencies));
