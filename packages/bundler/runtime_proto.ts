export const runtime = `const context = [];
function subscribe(running, subscriptions) {
    subscriptions.add(running);
    running.dependencies.add(subscriptions);
}
function cleanup(running) {
    for (const dep of running.dependencies) {
        dep.delete(running);
    }
    running.dependencies.clear();
}
export function signal(value) {
    const subscriptions = new Set();
    const read = () => {
        const running = context[context.length - 1];
        if (running)
            subscribe(running, subscriptions);
        return value;
    };
    const write = (nextValue) => {
        value = nextValue;
        for (const sub of [...subscriptions]) {
            sub.execute();
        }
    };
    return [read, write];
}
export function effect(fn) {
    const execute = () => {
        cleanup(running);
        context.push(running);
        try {
            fn();
        }
        finally {
            context.pop();
        }
    };
    const running = {
        execute,
        dependencies: new Set(),
    };
    execute();
}
export function element(tag, props = {}, children = () => []) {
    const element = document.createElement(tag);
    Object.keys(props).forEach(name => {
        if (/^on/.test(name)) {
            element.addEventListener(name.substring(2).toLowerCase(), props[name]);
        }
        else {
            effect(() => element.setAttribute(name, props[name]()));
        }
    });
    effect(() => element.replaceChildren(...children()));
    return element;
}
export function text(value) {
    const text = document.createTextNode(value());
    effect(() => (text.nodeValue = value()));
    return text;
}
export default {
    signal,
    effect,
    element,
    text
};`;
