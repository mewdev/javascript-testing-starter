import { it, expect, describe } from "vitest";
import {
  getCoupons,
  calculateDiscount,
  validateUserInput,
  isPriceInRange,
  isValidUsername,
  canDrive,
  fetchData,
} from "../src/core";

describe("getCoupons", () => {
  // expect an array
  it("should return an array of objects", () => {
    const coupons = getCoupons();
    expect(Array.isArray(coupons)).toBe(true);
    expect(coupons.length).toBeGreaterThan(0);
  });
  it("should return an array of objects with code property as string", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("code");
      expect(typeof coupon.code).toBe("string");
      expect(coupon.code).toBeTruthy();
    });
  });
  it("should return an array of objects with discount property as number between 0 and 1", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("discount");
      expect(typeof coupon.discount).toBe("number");
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

describe("calculateDiscount", () => {
  it("should return discounted price", () => {
    expect(calculateDiscount(100, "SAVE10")).toBe(90);
    expect(calculateDiscount(100, "SAVE20")).toBe(80);
  });
  it("should handle non numeric price", () => {
    expect(calculateDiscount("100", "SAVE10")).toMatch(/invalid/i);
  });
  it("should handle negative price", () => {
    expect(calculateDiscount(-100, "SAVE10")).toMatch(/invalid/i);
  });
  it("should handle non-string discount code", () => {
    expect(calculateDiscount(100, 10)).toMatch(/invalid/i);
  });
  it("should handle invalid discount code", () => {
    expect(calculateDiscount(100, "SAVE100")).toBe(100);
  });
});

describe("validateUserInput", () => {
  it("should return a validation successful", () => {
    expect(validateUserInput("John", 25)).toMatch(/successful/i);
  });
  it("should return invalid username if username is not a string", () => {
    expect(validateUserInput(123, 25)).toMatch(/invalid/i);
  });
  it("should return invalid username if username is less than 3 characters", () => {
    expect(validateUserInput(("Jo", 25))).toMatch(/invalid/i);
  });
  it("should return invalid username if username is greater than 250 chars", () => {
    expect(validateUserInput("J".repeat(251), 25)).toMatch(/invalid/i);
  });
  it("should return invalid age if age is not a number", () => {
    expect(validateUserInput("John", "25")).toMatch(/invalid/i);
  });
  it("should return invalid age if age is less than 18", () => {
    expect(validateUserInput("John", 17)).toMatch(/invalid/i);
  });
  it("should return invalid age if age is greater than 115", () => {
    expect(validateUserInput("John", 116)).toMatch(/invalid/i);
  });
  it("should return error if both username and age are invalid", () => {
    expect(validateUserInput("", 0)).toMatch(/invalid username/i);
    expect(validateUserInput("", 0)).toMatch(/invalid age/i);
  });
});

// isPriceInRange parametrized test
describe("isPriceInRange", () => {
  it.each([
    { scenario: "price < min", price: -1, result: false },
    { scenario: "price = min", price: 1, result: true },
    { scenario: "price is between min and max", price: 5, result: true },
    { scenario: "price = max", price: 10, result: true },
    { scenario: "price > max", price: 11, result: false },
  ])("should return $result if $scenario", ({ price, result }) => {
    expect(isPriceInRange(price, 0, 10)).toBe(result);
  });
});

describe("isValidUsername", () => {
  const minLength = 5;
  const maxLength = 15;
  it("should return false if username is empty", () => {
    expect(isValidUsername("")).toBe(false);
  });
  it("should return false if username is outside min or max range", () => {
    expect(isValidUsername("a".repeat(minLength - 1))).toBe(false);
    expect(isValidUsername("a".repeat(maxLength + 1))).toBe(false);
  });
  it("should return true if username is equal to min or max", () => {
    expect(isValidUsername("a".repeat(minLength))).toBe(true);
    expect(isValidUsername("a".repeat(maxLength))).toBe(true);
  });
  it("should return true if username is withih the range", () => {
    expect(isValidUsername("a".repeat(minLength + 1))).toBe(true);
    expect(isValidUsername("a".repeat(maxLength - 1))).toBe(true);
  });
  it("should return false if username is not a valid type", () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(1)).toBe(false);
  });
});

describe("canDrive", () => {
  it("should return false if country code is invalid", () => {
    expect(canDrive(20, "DE")).toMatch(/invalid/i);
    expect(canDrive(20, "")).toMatch(/invalid/i);
    expect(canDrive(20, 1)).toMatch(/invalid/i);
    expect(canDrive(20, null)).toMatch(/invalid/i);
    expect(canDrive(20, undefined)).toMatch(/invalid/i);
  });
  // parametrized test example
  it.each([
    { age: 15, country: "US", result: false },
    { age: 16, country: "US", result: true },
    { age: 17, country: "US", result: true },
    { age: 16, country: "UK", result: false },
    { age: 17, country: "UK", result: true },
    { age: 18, country: "UK", result: true },
  ])(
    "should return $result for ($age, $country)",
    ({ age, country, result }) => {
      expect(canDrive(age, country)).toBe(result);
    },
  );
  it("should return false if number is a string or negative", () => {
    expect(canDrive(-1, "US")).toBe(false);
    expect(canDrive(-1, "UK")).toBe(false);
    expect(canDrive("1", "US")).toBe(false);
    expect(canDrive("1", "UK")).toBe(false);
  });
  it("should return invalid if age is not a valid type", () => {
    expect(canDrive("", "US")).toMatch(/invalid/i);
    expect(canDrive(null, "US")).toMatch(/invalid/i);
    expect(canDrive(undefined, "US")).toMatch(/invalid/i);
  });
});

describe("fetchData", () => {
  it("should a promise that will result in array of promise", async () => {
    try {
      const result = await fetchData();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result).toMatchObject([1, 2, 3]);
    } catch (error) {
      expect(error).toHaveProperty("reason");
      expect(error.reason).toMatch(/failed/i);
    }
  });
});
