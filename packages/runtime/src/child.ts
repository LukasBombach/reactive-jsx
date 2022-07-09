import { render } from "./render";
import { react } from "./reaction";
import { isFunction, isString, isNumber, isBoolean, isArray } from "./typeGuards";
import { isTextChild, isVoidChild } from "./typeGuards";
import { isElement } from "./typeGuards";
import { isNull, isUndefined } from "./typeGuards";

import type { Child, R } from "./createElement";

interface Result {
  value: Child;
  ref: HTMLElement | Text | Comment;
}

/**
 *
 */
export function renderChild(child: R<Child>): Result {
  if (isFunction(child)) {
    return reconcile(child);
  } else {
    return { value: child, ref: renderElement(child) };
  }
}

/**
 * todo lots of perf and clean code improvements possible
 */
function reconcile(nextChild: () => Child): Result {
  return react(currentOrInitial => {
    const next = nextChild();

    console.log(currentOrInitial, { next });

    if (currentOrInitial === undefined) {
      console.log("returning", { value: next, ref: renderElement(next) });

      return { value: next, ref: renderElement(next) };
    }

    const { value: current, ref } = currentOrInitial;

    if (isTextChild(current) && isTextChild(next)) {
      if (current.toString() !== next.toString()) {
        ref.nodeValue = next.toString();
      }
      return { ref, value: next };
    }

    if (isVoidChild(current) && isVoidChild(next)) {
      if (current !== next) {
        ref.nodeValue = JSON.stringify(next);
      }
      return { ref, value: next };
    }

    if (isElement(current) && isElement(next)) {
      const nextRef = render(next);
      ref.replaceWith(nextRef);
      return { ref: nextRef, value: next };
    }

    if (isArray(current) && isArray(next)) {
      const nextRef = next.map(c => renderChild(c).ref);
      ref.slice(1).forEach(el => el.remove());
      ref[0].replaceWith(...nextRef);
      return { ref: nextRef, value: next };
    }

    throw new Error(`unknown child type ${typeof next} ${JSON.stringify(next)}`);
  });
}

/**
 *
 */
function renderElement(child: Child | Child[]): (HTMLElement | Text | Comment) | (HTMLElement | Text | Comment)[] {
  if (isString(child) || isNumber(child)) {
    return new Text(child.toString());
  }

  if (isArray(child)) {
    return child.flatMap(c => renderElement(c));
  }

  if (isElement(child)) {
    return render(child);
  }

  if (isBoolean(child) || isNull(child) || isUndefined(child)) {
    return document.createComment(JSON.stringify(child));
  }

  throw new Error(`unknown element type ${typeof child}`);
}
