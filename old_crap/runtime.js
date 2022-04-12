(function () {
  "use strict";

  const context = [];

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

  function value(value) {
    const subscriptions = new Set();

    const read = () => {
      const running = context[context.length - 1];
      if (running) subscribe(running, subscriptions);
      return value;
    };

    const write = nextValue => {
      value = nextValue;

      for (const sub of [...subscriptions]) {
        sub.execute();
      }
    };

    return [read, write];
  }

  function reaction(fn) {
    const execute = () => {
      cleanup(running);
      context.push(running);
      let val;

      try {
        val = fn();
      } finally {
        context.pop();
      }

      return val;
    };

    const running = {
      execute,
      dependencies: new Set(),
    };
    return execute();
  }

  function element(tag, props = null, ...children) {
    const element = document.createElement(tag);

    if (props) {
      Object.keys(props).map(name => prop(element, name, props[name]));
    }

    children
      .map(child => {
        if (typeof child === "function") {
          const text = document.createTextNode(child());
          reaction(() => (text.nodeValue = child()));
          return text;
        } else {
          const text = document.createTextNode(child);
          text.nodeValue = child;
          return text;
        }
      })
      .forEach(child => element.append(child));
    return element;
  }

  function prop(element, name, value) {
    if (isEventHandler(name) && isEventListener(value)) {
      element.addEventListener(getEventName(name), value);
    } else if (isFunction(value)) {
      reaction(() => element.setAttribute(name, value()));
    } else {
      element.setAttribute(name, String(value));
    }
  }

  const isFunction = value => typeof value === "function";

  const isEventListener = value => typeof value === "function";

  const isEventHandler = name => /^on/.test(name);

  const getEventName = name => name.substring(2).toLowerCase();

  var index = {
    value,
    reaction,
    element,
  };

  debugger;
  const [count, setCount] = index.value(0);

  function handleClick() {
    debugger;
    setCount(count() + 1);
  }

  const el = index.element(
    "button",
    {
      onClick: handleClick,
    },
    "Clicked ",
    count,
    " ",
    () => (count() === 1 ? "time" : "times")
  );
  document.body.append(el);
})();
