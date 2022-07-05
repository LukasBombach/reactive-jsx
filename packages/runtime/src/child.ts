import { render } from "./render";
import { react } from "./reaction";
import { isFunction, isString, isNumber, isBoolean } from "./typeGuards";
import { isElement } from "./typeGuards";
import { isTextNode, isCommentNode } from "./typeGuards";
import { isNull, isUndefined } from "./typeGuards";

import type { Child, ChildValue, Element } from "./createElement";

interface ChildElement extends Element {
  ref: HTMLElement | Text | Comment;
}

/**
 *
 */
export function renderChild(child: Child): ChildElement {
  if (isFunction(child)) {
    return reconcile(child);
  } else {
    return renderElement(child);
  }
}

/**
 * todo lots of perf and clean code improvements possible
 */
function reconcile(nextChild: () => ChildValue): ChildElement {
  return react(current => {
    const next = nextChild();

    if (current === undefined) {
      return renderElement(next);
    }

    if (isString(next) || isNumber(next)) {
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

    throw new Error(`unknown child type ${typeof next}`);
  });
}

/**
 *
 */
function renderElement(child: ChildValue): ChildElement {
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
