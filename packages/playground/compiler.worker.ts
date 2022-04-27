import { compile } from "./compiler";

export interface Message {
  source: string;
}

// todo race condidions
onmessage = function ({ data }) {
  assertMessage(data);

  compile(data.source, async () => null)
    .then(src => postMessage(src))
    .catch(error => console.warn(error));
};

function assertMessage(data: any): asserts data is Message {
  if (typeof data !== "object" || data === null) {
    throw new Error(`expected message to be an object, got ${JSON.stringify(data)}`);
  }

  if (!Object.hasOwn(data, "source") || typeof data.source !== "string") {
    throw new Error(`expected message to have an source of type string, got ${JSON.stringify(data.source)}`);
  }
}
