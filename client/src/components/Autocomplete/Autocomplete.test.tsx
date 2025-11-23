import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import Autocomplete from "./Autocomplete";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Autocomplete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input with placeholder", () => {
    render(<Autocomplete />);
    expect(screen.getByPlaceholderText(/Start typing street/i)).toBeInTheDocument();
  });

  it("shows results from API", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ street: "Test Street", postNumber: 123, city: "Test City" }]
    });

    render(<Autocomplete />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Tes" } });

    expect(await screen.findByText(/Test Street/i)).toBeInTheDocument();
  });

  it("navigates with arrow keys and selects with Enter", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { street: "First Street", postNumber: 1, city: "City" },
        { street: "Second Street", postNumber: 2, city: "City" }
      ]
    });

    render(<Autocomplete />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Stre" } });

    await screen.findByText(/First Street/i);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(input).toHaveValue("Second Street — 2 City");
  });

  it("closes dropdown on Escape", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ street: "Test Street", postNumber: 123, city: "Test City" }]
    });

    render(<Autocomplete />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Tes" } });

    await screen.findByText(/Test Street/i);

    fireEvent.keyDown(input, { key: "Escape" });

    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("selects item with mouse click", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ street: "Click Street", postNumber: 555, city: "MouseCity" }]
    });

    render(<Autocomplete />);
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "Clic" } });

    const option = await screen.findByText(/Click Street/i);

    fireEvent.mouseDown(option);
    
    expect(input).toHaveValue("Click Street — 555 MouseCity");
  });
});
