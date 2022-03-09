let count = 1;

function handleClick() {
  count = count + 1;
}

const el = (
  <button onClick={handleClick}>
    Clicked {count} {count === 1 ? "time" : "times"}
  </button>
);

document.body.append(el);
