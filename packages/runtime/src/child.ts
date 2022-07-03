import { render } from "./render";
import { react } from "./reaction";
import { isFunction, isString, isNumber, isBoolean } from "./typeGuards";
import { isTag, isComponent, isElement, isReactiveChild, isEventHandler } from "./typeGuards";
import { isTextNode, isCommentNode } from "./typeGuards";
import { isNull, isUndefined } from "./typeGuards";

import type { ChildValue } from "./createElement";

type ChildElement = HTMLElement | Text | Comment;

// type ChildValue = Element | string | number | boolean | null | undefined;

export function reconcile(current: ChildElement | undefined, nextChild: () => ChildValue): ChildElement {
  react(() => {
    const next = nextChild();

    if (current === undefined) {
      return renderChild(next);
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

    /*  if (isElement(child)) {
      if (child !== current) {
        if (isUndefined(current)) {
          element.append(child);
        } else {
          element.replaceChild(child, current);
        }
      }
      return child;
    } */

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

export function renderChild(child: ChildValue): ChildElement {
  if (isString(child) || isNumber(child)) {
    return new Text(child.toString());
  }

  if (isElement(child)) {
    return render(child);
  }

  if (isBoolean(child) || isNull(child) || isUndefined(child)) {
    return document.createComment(typeof child);
  }

  throw new Error(`unknown child type ${typeof child}`);
}
