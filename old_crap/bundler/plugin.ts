import { transpile } from "@reactive-jsx/transpiler";

import type { Plugin } from "rollup";

export const pluginBundle = (source: string, runtime: string): Plugin => ({
  name: "reactive-jsx-repl",
  resolveId(id) {
    if (id === "playground") {
      return id;
    }
    if (id === "@reactive-jsx/runtime") {
      return id;
    }
    return null;
  },
  load(id) {
    if (id === "playground") {
      return source;
    }
    if (id === "@reactive-jsx/runtime") {
      return runtime;
    }
    return null;
  },
  transform(source, id) {
    const injectRuntime = id !== "@reactive-jsx/runtime";

    const env = {
      modules: false,
      targets: {
        firefox: "97",
      },
    };

    const react = {
      pragma: "ReactiveJsx.element",
      pragmaFrag: "ReactiveJsx.fragment",
    };

    const code = transpile(source, { injectRuntime, env, react }) || "";

    return code;
  },
});

/* export const pluginShowCode: (source: string) => Plugin = source => ({
  name: "reactive-jsx-repl",
  resolveId(id) {
    if (id === "playground") {
      return id;
    }
    if (id === "@reactive-jsx/runtime") {
      return { id, external: true };
    }
    return null;
  },
  load(id) {
    if (id === "playground") {
      return source;
    }
    return null;
  },
  transform(source) {
    const env = {
      modules: false,
      targets: {
        firefox: "97",
      },
    };

    const react = {
      pragma: "ReactiveJsx.element",
      pragmaFrag: "ReactiveJsx.fragment",
      useBuiltIns: true,
    };

    return transpile(source, { injectRuntime: true, env, react }) || "";
  },
}); */