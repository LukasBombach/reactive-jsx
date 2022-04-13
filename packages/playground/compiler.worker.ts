import { compile } from "./compiler";

export interface Message {
  id: string;
  source: string;
}

onmessage = function ({ data }) {
  assertMessage(data);

  compile(data.source, async () => null)
    .then(src => postMessage(src))
    .catch(error => console.warn(error));
};

function assertMessage(data: any): asserts data is Message {
  if (typeof data !== "object" || data === null) {
    throw new Error("expected message to be an object");
  }

  if (!Object.hasOwn(data, "id") || typeof data.id !== "string") {
    throw new Error("expected message to have an id of type string");
  }

  if (!Object.hasOwn(data, "source") || typeof data.source !== "string") {
    throw new Error("expected message to have an source of type string");
  }
}
