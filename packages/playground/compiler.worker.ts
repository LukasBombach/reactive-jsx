import { compile } from "./compiler";

onmessage = function ({ data }) {
  if (typeof data !== "string") {
    throw new Error("expected to receive a string");
  }

  compile(data, async () => null)
    .then(src => postMessage(src))
    .catch(error => console.warn(error));
};
