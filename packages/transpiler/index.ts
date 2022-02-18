import { transform, availablePresets } from "@babel/standalone";
import { insertImports, reactiveProps, reactiveChildren } from "@reactive-jsx/babel-plugin";

interface Options {
  // todo this should be done automatically by detecting jsx in the plugin
  injectRuntime: boolean;
}

export function transpile(code: string, options: Options): string | null {
  const plugins = [reactiveProps, reactiveChildren];

  // quick and dirty
  if (options.injectRuntime) {
    plugins.push(insertImports);
  }

  return (
    transform(code, {
      presets: [
        [
          availablePresets.env,
          {
            modules: false,
            targets: {
              firefox: "97",
            },
          },
        ],
        [
          availablePresets.react,
          {
            pragma: "ReactiveJsx.element",
            pragmaFrag: "ReactiveJsx.fragment",
            useBuiltIns: true,
          },
        ],
      ],
      plugins,
    }).code || null
  );
}
