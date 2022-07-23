import { getProgram } from "./getProgram";

describe("declarations", () => {
  test("x", async () => {
    const program = await getProgram("let count = 0; const Button = () => <button onClick={() => count++} />;");
    expect(program).not.toBeNull();
  });
});
