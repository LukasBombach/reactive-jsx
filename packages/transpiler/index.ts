import { transform, availablePresets } from "@babel/standalone";
import { insertImports, children } from "@reactive-jsx/babel-plugin";

interface Options {
  // todo this should be done automatically by detecting jsx in the plugin
  injectRuntime: boolean;
  env?: object;
  react?: object;
}

export function transpile(code: string, options: Options): string | null {
  const plugins = [children];

  // quick and dirty
  if (options.injectRuntime) {
    plugins.push(insertImports);
  }

  return (
    transform(code, {
      presets: [
        [availablePresets.env, options.env],
        [availablePresets.react, options.react],
      ],
      plugins,
    }).code || null
  );
}
