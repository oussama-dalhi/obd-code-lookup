import { loadFamily } from "./data.js";
import { setMessage, clearResult, showResult } from "./render.js";

const searchInput = document.querySelector("#dtc");
const form = document.querySelector("#fault-form");

const CODE_PATTERN = /^[PBCU][0-3][0-9A-F]{3}$/;

// Clear the old result and show a message, so they never appear together.
function fail(text, type = "error") {
  clearResult();
  setMessage(text, type);
}

async function searchCode() {
  const code = searchInput.value.trim().toUpperCase();

  if (!code) {
    fail("Please enter a fault code.");
    return;
  }

  if (!CODE_PATTERN.test(code)) {
    fail(
      `"${code}" isn't a valid code. Use P, B, C or U followed by 4 characters, e.g. P0301.`,
    );
    return;
  }
  let codes;
  try {
    codes = await loadFamily(code.slice(0, 2));
  } catch (error) {
    console.error("Diagnostic database error:", error);
    fail("Couldn't load the database. Please refresh and try again.");
    return;
  }
  const entry = Object.hasOwn(codes, code) ? codes[code] : null;

  if (!entry || typeof entry !== "object") {
    fail(
      `No information found for ${code}. Only generic codes are included, not manufacturer-specific ones.`,
      "info",
    );
    return;
  }

  setMessage("");
  showResult(code, entry);
}


searchInput.addEventListener("input", () => {
  const { selectionStart, selectionEnd } = searchInput;

  searchInput.value = searchInput.value.toUpperCase();
  searchInput.setSelectionRange(selectionStart, selectionEnd);
  setMessage("");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchCode();
});

