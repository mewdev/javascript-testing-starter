import { describe, test, it, expect } from "vitest";
import { max, calculateAverage } from "../src/intro";

// string as name of the tested function/unit
describe("max", () => {
  // pay attention to the naming !!!
  it("should return first argument if it is greater", () => {
    expect(max(2, 1)).toBe(2);
  });
  it("should return second argument if it is greater", () => {
    expect(max(1, 2)).toBe(2);
  });
  it("should return first argument if arguments are equal", () => {
    expect(max(1, 1)).toBe(1);
  });
});

describe("calculateAverage", () => {
  it("should return NaN if given an empty array", () => {
    expect(calculateAverage([])).toBe(NaN);
  });
  it("should calculate the averae of an array with a single element", () => {
    expect(calculateAverage([1])).toBe(1);
  });
  it("should calculate the average of an array with two elements", () => {
    expect(calculateAverage([1, 2])).toBe(1.5);
  });
  it("should calculate the average of an array with three elements", () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});
