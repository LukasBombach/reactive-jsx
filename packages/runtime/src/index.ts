import { signal, effect } from "./reactive";
import { element } from "./element";

export type { Read, Write } from "./reactive";
export type { Tag, Element, Component } from "./types";

export default { signal, effect, element };
