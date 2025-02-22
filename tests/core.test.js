import { it, expect, describe } from "vitest";
import { getCoupons, calculateDiscount, validateUserInput } from "../src/core";

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
});
