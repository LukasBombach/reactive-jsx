export const Component = () => {
  let count = 1;
  let double = count * 2;

  return (
    <button onClick={() => count++}>
      {count} * 2 = {double}
    </button>
  );
};
