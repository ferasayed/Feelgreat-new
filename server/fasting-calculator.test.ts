import { describe, it, expect } from "vitest";

/**
 * Tests for the fasting calculator logic.
 * The calculator is purely frontend, so we test the core time utility functions here.
 */

// Replicate the addHours function from FastingCalculator.tsx
function addHours(time: string, hours: number): string {
  const [h, m] = time.split(":").map(Number);
  const totalMinutes = (h * 60 + m + hours * 60) % (24 * 60);
  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

// Replicate the formatTime12 function
function formatTime12(time24: string, lang: string): string {
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12;
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const suffix = lang === "ar"
    ? (ampm ? "م" : "ص")
    : (ampm ? "PM" : "AM");
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

describe("Fasting Calculator - addHours", () => {
  it("should add hours within the same day", () => {
    expect(addHours("08:00", 4)).toBe("12:00");
    expect(addHours("10:30", 2)).toBe("12:30");
  });

  it("should wrap around midnight correctly", () => {
    expect(addHours("20:00", 16)).toBe("12:00");
    expect(addHours("21:00", 16)).toBe("13:00");
    expect(addHours("22:00", 16)).toBe("14:00");
    expect(addHours("23:00", 16)).toBe("15:00");
  });

  it("should handle midnight edge cases", () => {
    expect(addHours("00:00", 16)).toBe("16:00");
    expect(addHours("23:59", 1)).toBe("00:59");
  });

  it("should handle 8-hour eating window correctly", () => {
    // If fasting starts at 20:00, eating starts at 12:00, eating ends at 20:00
    const fastingStart = "20:00";
    const eatingStart = addHours(fastingStart, 16);
    const eatingEnd = addHours(eatingStart, 8);
    expect(eatingStart).toBe("12:00");
    expect(eatingEnd).toBe("20:00");
  });

  it("should calculate Unimate time (11 hours after fasting start)", () => {
    expect(addHours("20:00", 11)).toBe("07:00");
    expect(addHours("21:00", 11)).toBe("08:00");
    expect(addHours("19:00", 11)).toBe("06:00");
  });

  it("should calculate snack time (4 hours after eating start)", () => {
    expect(addHours("12:00", 4)).toBe("16:00");
    expect(addHours("13:00", 4)).toBe("17:00");
  });
});

describe("Fasting Calculator - formatTime12", () => {
  it("should format morning times in English", () => {
    expect(formatTime12("07:00", "en")).toBe("7:00 AM");
    expect(formatTime12("11:30", "en")).toBe("11:30 AM");
  });

  it("should format afternoon/evening times in English", () => {
    expect(formatTime12("12:00", "en")).toBe("12:00 PM");
    expect(formatTime12("20:00", "en")).toBe("8:00 PM");
    expect(formatTime12("13:45", "en")).toBe("1:45 PM");
  });

  it("should format midnight correctly", () => {
    expect(formatTime12("00:00", "en")).toBe("12:00 AM");
  });

  it("should format times in Arabic", () => {
    expect(formatTime12("07:00", "ar")).toBe("7:00 ص");
    expect(formatTime12("20:00", "ar")).toBe("8:00 م");
    expect(formatTime12("12:00", "ar")).toBe("12:00 م");
  });

  it("should format times in other languages (same as English)", () => {
    expect(formatTime12("15:00", "fr")).toBe("3:00 PM");
    expect(formatTime12("09:00", "de")).toBe("9:00 AM");
  });
});

describe("Fasting Calculator - Full Schedule Generation", () => {
  it("should generate a complete 16:8 schedule for dinner at 20:00", () => {
    const dinnerTime = "20:00";
    const fastingStart = dinnerTime;
    const eatingStart = addHours(fastingStart, 16);
    const unimateTime = addHours(fastingStart, 11);
    const snackTime = addHours(eatingStart, 4);
    const eatingEnd = addHours(eatingStart, 8);

    expect(fastingStart).toBe("20:00");
    expect(eatingStart).toBe("12:00");
    expect(unimateTime).toBe("07:00");
    expect(snackTime).toBe("16:00");
    expect(eatingEnd).toBe("20:00");
  });

  it("should generate a complete 16:8 schedule for dinner at 19:00", () => {
    const dinnerTime = "19:00";
    const fastingStart = dinnerTime;
    const eatingStart = addHours(fastingStart, 16);
    const unimateTime = addHours(fastingStart, 11);
    const snackTime = addHours(eatingStart, 4);
    const eatingEnd = addHours(eatingStart, 8);

    expect(fastingStart).toBe("19:00");
    expect(eatingStart).toBe("11:00");
    expect(unimateTime).toBe("06:00");
    expect(snackTime).toBe("15:00");
    expect(eatingEnd).toBe("19:00");
  });

  it("should generate a complete 16:8 schedule for late dinner at 22:00", () => {
    const dinnerTime = "22:00";
    const fastingStart = dinnerTime;
    const eatingStart = addHours(fastingStart, 16);
    const unimateTime = addHours(fastingStart, 11);
    const snackTime = addHours(eatingStart, 4);
    const eatingEnd = addHours(eatingStart, 8);

    expect(fastingStart).toBe("22:00");
    expect(eatingStart).toBe("14:00");
    expect(unimateTime).toBe("09:00");
    expect(snackTime).toBe("18:00");
    expect(eatingEnd).toBe("22:00");
  });
});
