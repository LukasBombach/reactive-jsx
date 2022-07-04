import { render } from "./render";
import { react } from "./reaction";
import { isFunction, isString, isNumber, isBoolean, isArray } from "./typeGuards";
import { isElement, isText } from "./typeGuards";
import { isTextNode, isCommentNode } from "./typeGuards";
import { isNull, isUndefined } from "./typeGuards";

import type { Child, ChildValue } from "./createElement";

type ChildElement = HTMLElement | Text | Comment;

/**
 *
 */
export function renderChildren(children: ChildValue[] | (() => ChildValue[])): ChildElement[] {
  /* if (Array.isArray(child)) {
    return child.flatMap(c => renderChild(c));
  } else if (isFunction(child)) {
    return reconcile(child);
  } else {
    return renderElement(child);
  } */

  if (isArray(children)) {
    return children.map(renderElement);
  } else {
    return reconcileChildren(children);
  }
}

function reconcileChildren(children: () => ChildValue[]): ChildElement[] {
  return react(current => {
    // This will be the initial render
    if (current === undefined) {
      return children().map(renderElement);
    }

    // return reconcile();
  });
}

/* 
type A<T> = T | T[];
type FA<T> = () => A<T>;
type Current = [el: A<ChildElement>, val: A<ChildValue>];
type GetNext = FA<ChildValue>;

function reconcile2(getNext: GetNext): A<ChildElement> {
  const [elems] = react<Current>(currentOrUndefined => {
    const next = getNext();

    // This will be the initial render
    if (currentOrUndefined === undefined) {
      return [renderElement(next), next];
    }

    const [el, current] = currentOrUndefined;

    if (Array.isArray(current) && Array.isArray(next)) {
      throw new Error("todo");
    }

    if (isText(current) && isText(next)) {
      if (next !== current) {
        el.
      }
    }
  });

  return el;
} */

/**
 * todo lots of perf and clean code improvements possible
 */
function reconcile(nextChild: () => ChildValue | ChildValue[]): ChildElement | ChildElement[] {
  return react(current => {
    const next = nextChild();

    console.log("current", current);
    console.log("next", next);

    if (Array.isArray(next)) {
      return next.flatMap(c => renderChild(c));
    }

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
 * todo [1] why flatMap?
 */
/* function renderElement(child: ChildValue | ChildValue[]): ChildElement | ChildElement[] {
  if (Array.isArray(child)) {
    return child.flatMap(c => renderElement(c)); // [1]
  } */
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
