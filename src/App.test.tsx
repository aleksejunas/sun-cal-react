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
    expect(screen.getByText(/Vintersolverv Kalkulator/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Velg en by for å sjekke hvor mye lengre dagen er nå/i),
    ).toBeInTheDocument();
  });

  test("shows city list", () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Oslo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bergen/i })).toBeInTheDocument();
  });

  test("selects city and displays results", async () => {
    render(<App />);

    // Click on Oslo in the list
    const osloElement = screen.getByRole('button', { name: /Oslo/i });
    fireEvent.click(osloElement);

    // Check that results appear
    await waitFor(() => {
      expect(screen.getByText(/Oslo: Dagen er/i)).toBeInTheDocument();
      expect(screen.getByText(/Sol opp:/i)).toBeInTheDocument();
      expect(screen.getByText(/Sol ned:/i)).toBeInTheDocument();
    });
  });

  test("matches snapshot", () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});
