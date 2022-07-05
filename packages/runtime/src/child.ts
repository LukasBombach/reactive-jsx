import { render } from "./render";
import { react } from "./reaction";
import { isFunction, isString, isNumber, isBoolean, isArray } from "./typeGuards";
import { isTextChild, isVoidChild } from "./typeGuards";
import { isElement } from "./typeGuards";
import { isTextNode, isCommentNode } from "./typeGuards";
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
    return renderElement(child);
  }
}

/**
 * todo lots of perf and clean code improvements possible
 */
function reconcile(nextChild: () => Child): Result {
  return react(currentOrInitial => {
    const next = nextChild();

    if (currentOrInitial === undefined) {
      return { value: next, ref: renderElement(next) };
    }

    const { value: current, ref } = currentOrInitial;

    if (isArray(current) && isArray(next)) {
      if (next.length !== current.length) {
        throw new Error("todo: implement this case");
      }
      throw new Error("todo: implement this case");
    }

    if (isTextChild(current) && isTextChild(next)) {
      if (current.toString() !== next.toString()) {
        ref.nodeValue = next.toString();
      }
      return { ref, value: next };
    }

    if (isVoidChild(current) && isVoidChild(next)) {
    }

    /* if (isString(next) || isNumber(next)) {
      const str = next.toString();
      if (isTextNode(current)) {
        if (str !== current.nodeValue) {
          current.nodeValue = str;
        }
        return current;
      } else {
        const text = document.createTextNode(str);
        current.parentElement?.replaceChild(text, current);
        return text;
      }
    }

    if (isElement(next)) {
      current.parentElement?.replaceChild(renderElement(next), current);
    }

    if (isBoolean(next) || isNull(next) || isUndefined(next)) {
      const str = typeof next;
      if (isCommentNode(current)) {
        if (str !== current.nodeValue) {
          current.nodeValue = str;
        }
        return current;
      } else {
        const comment = document.createComment(str);
        current.parentElement?.replaceChild(comment, current);
        return comment;
      }
    }

    throw new Error(`unknown child type ${typeof next}`); */
  });
}

/**
 *
 */
function renderElement(child: Child): Result {
  if (isString(child) || isNumber(child)) {
    return new Text(child.toString());
  }

  if (isElement(child)) {
    return render(child);
  }

  if (isBoolean(child) || isNull(child) || isUndefined(child)) {
    return document.createComment(typeof child);
  }

  throw new Error(`unknown element type ${typeof child}`);
}
