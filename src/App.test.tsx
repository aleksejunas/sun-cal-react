import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { jest } from "@jest/globals";

// Mock fetch API
globalThis.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    statusText: "OK",
    headers: new Headers(),
    redirected: false,
    json: () =>
      Promise.resolve({
        results: {
          sunrise: "2023-06-21T04:00:00.000Z",
          sunset: "2023-06-21T20:00:00.000Z",
        },
      }),
  } as Response),
);

// Set a fixed date for testing
jest
  .spyOn(Date.prototype, "toLocaleString")
  .mockReturnValue("6/21/2023, 12:00:00 PM");

describe("Winter Solstice Calculator", () => {
  test("renders the app with title and instructions", () => {
    render(<App />);
    expect(screen.getByText(/Winter Solstice Calculator/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Choose a city to see how much longer the day is/i),
    ).toBeInTheDocument();
  });

  test("shows city list", () => {
    render(<App />);
    expect(screen.getByText(/Press.*for Oslo/i)).toBeInTheDocument();
    expect(screen.getByText(/Press.*for Bergen/i)).toBeInTheDocument();
  });

  test("selects city and displays results", async () => {
    render(<App />);

    // Click on Oslo in the list
    const osloElement = screen.getByText(/Press.*for Oslo/i);
    fireEvent.click(osloElement);

    // Check that results appear
    await waitFor(() => {
      expect(screen.getByText(/In Oslo, the day is/i)).toBeInTheDocument();
      expect(screen.getByText(/Sunrise:/i)).toBeInTheDocument();
      expect(screen.getByText(/Sunset:/i)).toBeInTheDocument();
    });
  });

  test("matches snapshot", () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});
