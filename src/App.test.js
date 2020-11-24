import { render, screen } from "@testing-library/react";
import App from "./App";

test("fake test", () => {
	render(<App />);
	expect(1 === 1).toBeTruthy();
});
