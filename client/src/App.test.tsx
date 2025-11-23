import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("axios");

test("renders heading", () => {
  render(<App />);
  expect(screen.getByText(/Address search/i)).toBeInTheDocument();
});
