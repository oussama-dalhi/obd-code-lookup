const searchInput = document.querySelector("#dtc");
const resultDisplay = document.querySelector(".results-card");
const message = document.querySelector("#message");

const SYSTEMS = {
  P: "Powertrain",
  B: "Body",
  C: "Chassis",
  U: "Network",
};

resultDisplay.setAttribute("aria-live", "polite");

// Escape HTML to prevent HTML injection.
function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

export function setMessage(text, type = "error") {
  message.textContent = text;
  message.dataset.type = type;
  message.hidden = !text;
  searchInput.setAttribute(
    "aria-invalid",
    text && type === "error" ? "true" : "false",
  );
}

export function clearResult() {
  resultDisplay.innerHTML = "";
}


export function showResult(code, entry) {
  const {
    title = "Untitled diagnostic code",
    description = "",
    causes = [],
    symptoms = []
  } = entry;

  const system = SYSTEMS[code[0]] ?? "Unknown";

  const causeItems = Array.isArray(causes)
    ? causes
        .map(
          (cause) => `
            <li>
              ${escapeHTML(cause.label)}
              ${
                cause.likelihood
                  ? `<span class="likelihood">${escapeHTML(cause.likelihood)}</span>`
                  : ""
              }
            </li>`,
        )
        .join("")
    : "";

  const symptomItems = Array.isArray(symptoms)
    ? symptoms.map((symptom) => `<li>${escapeHTML(symptom)}</li>`).join("")
    : "";

  resultDisplay.innerHTML = `
    <div class="fault-header" data-system="${escapeHTML(code[0])}">
      <span class="fault-code">${escapeHTML(code)}</span>
      <span class="severity">${system} system</span>
    </div>

    <h2>${escapeHTML(title)}</h2>
    <p class="description">${escapeHTML(description)}</p>

    ${
      causeItems
        ? `<div class="block">
             <h3 class="fix-header">Common causes</h3>
             <ul class="fixes">${causeItems}</ul>
           </div>`
        : ""
    }

    ${
      symptomItems
        ? `<div class="block">
             <h3 class="fix-header">Symptoms</h3>
             <ul class="symptoms">${symptomItems}</ul>
           </div>`
        : ""
    }

    <p class="note">
      Codes describe symptoms, not confirmed faults.
      Check with proper diagnostic procedures before replacing parts.
    </p>

    <a
      href="https://www.google.com/search?q=${encodeURIComponent(`OBD-II fault code ${code}`)}"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn more →
    </a>
  `;
}
