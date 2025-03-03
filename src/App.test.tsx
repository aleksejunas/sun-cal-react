// import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

jest
  .spyOn(globalThis, "Date")
  .mockImplementation(() => new Date("2025-03-03T12:00:00Z"));

test("renders Winter Solstice Calculator", () => {
  const { getByText } = render(<App />);
  expect(getByText("Winter Solstice Calculator")).toBeInTheDocument();
});

test("displays current date and time", () => {
  const now = new Date().toLocaleString();
  const { getByTestId } = render(<App />);
  expect(getByTestId("current-date-time")).toHaveTextContent(now);
});

test("renders city options", () => {
  const { getByText } = render(<App />);
  expect(getByText("Press 1 for Oslo")).toBeInTheDocument();
  expect(getByText("Press 2 for Bergen")).toBeInTheDocument();
});

test("displays day length for selected city", () => {
  const { getByText } = render(<App />);
  expect(getByText(/In Oslo, the day is/)).toBeInTheDocument();
});
