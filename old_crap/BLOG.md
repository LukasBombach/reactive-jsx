Introducing Reactive JSX

React has gotten a bit of a bad rep lately. And for a good reason. Once you go beyond `useState` and have to use `useEffect`, the game switches from "easy" mode to "intermediate". In fact I believe, to feel confident to know when an effect runs, to optimise it in terms of re-renders in combination with other hooks and to understand quirks with `useRef` requires not only an understanding how React works, but how Reactive Programming works and how React fits in its domain.

Why can't we just write React components like this?

[example]

In fact, we can. Try it out, right there. It totally works. It's not magic. It's not new. It's just a combination of design decisions. Let me explain.

# How it works

- explanation traversal upwards
- interactive examples

<!--

#1 - A Compiler

Code that you can read like a book, that describes what it does clearly and simply is good. Why? Because you can comprehend its logic and spot errors more easily. Robert C. Martin writes about this in length in his book "Clean Code" and I have never seen this so eloquently and skillfully delivered than in Rich Harris' Talk "The Return of 'Write Less, Do More' by Rich Harris" at the 2019 JScamp

https://www.youtube.com/watch?v=BzX4aTRPzno

React delivers on this promise big time when it comes to abstracting the hard problem of making a complex stateful interactive user interface maintainable. Imagine you had to do all that React does by hand. But there's a crack in everything. That's where the light gets In. It's not just hooks that can get complicated or other features like `context` that need to be wired with `useState` before things work, it's the very fact that React tends to have a flawed Signal-To-Noise-Ratio. Compare this:

[useState example side by side with React]

To do this, you need a compiler. Being able to do things in an imperative language like JavaScript requires statements that command those things. In both examples, re-running the code you see to update the element is nowhere to be found. React hides those commands behind `useState` and a runtime that re-evaluates your components in an elaborate and magical manner. Reactive JSX hides this too, but at compile time. The code you write gets transformed (elaborately and magically) to different code that not elaborate nor magical but efficient and straight forward.

This is not completely new. Svelte does this. Elm does this. Although, both of these go one or two steps further and create their own file formats and template language (Svelte) or even an entire language (Elm). Others, like SolidJS, don't. This is a design decision. Svelte and Elm are really good frameworks. SolidJS goes a different direction. Ryan Carniato said in an interview with Jakub Neander that he "likes control"

https://www.youtube.com/watch?v=Dq5EAcup044

and I completely fell this. To me—personally—Svelte is too high

#2 Mental Model


-->
