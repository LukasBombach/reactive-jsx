import type { Tag, Component, Element, Child, ChildValue } from "./createElement";

export const isTag = (value: Tag | Component): value is Tag => typeof value === "string";
export const isComponent = (value: Tag | Component): value is Component => typeof value === "function";
export const isElement = (value: Child): value is Element =>
  typeof value === "object" && value !== null && "type" in value && "props" in value && "type" in value;

export const isText = (value: unknown): value is string | number =>
  typeof value === "string" || typeof value === "number";

export const isReactiveChild = (value: Child): value is () => ChildValue => typeof value === "function";

export const isString = (value: unknown): value is string => typeof value === "string";
export const isNumber = (value: unknown): value is number => typeof value === "number";
export const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
export const isNull = (value: unknown): value is null => value === null;
export const isUndefined = (value: unknown): value is undefined => typeof value === "undefined";
export const isFunction = (value: unknown): value is Function => typeof value === "function";

export const isEventHandler = (value: string): value is `on${Capitalize<string>}` => /^on[A-Z]/.test(value);

export const isTextNode = (node: Node): node is Text => node.nodeType === 3;
export const isCommentNode = (node: Node): node is Comment => node.nodeType === 8;

export const isArray = Array.isArray;
