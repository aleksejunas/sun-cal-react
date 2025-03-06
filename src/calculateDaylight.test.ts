import { calculateDaylight } from "./App"; // You'll need to export this function

describe("calculateDaylight", () => {
  test("calculates daylight hours correctly", () => {
    // Test a few key cases
    expect(calculateDaylight(2023, 6, 21, 90)).toBeCloseTo(24); // North pole summer
    expect(calculateDaylight(2023, 12, 21, 90)).toBeCloseTo(0); // North pole winter
    expect(calculateDaylight(2023, 6, 21, 0)).toBeCloseTo(12); // Equator
  });
});
