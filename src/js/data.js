
const DATA_DIR = "./data/codes";

// Cache loaded JSON files.
const familyCache = new Map();

// Load and cache a JSON family.
export function loadFamily(family) {
  if (!familyCache.has(family)) {
    const request = fetch(`${DATA_DIR}/${family}.json`)
      .then((response) => {
        if (response.status === 404) return {};

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        if (data === null || typeof data !== "object" || Array.isArray(data)) {
          throw new Error(`Invalid JSON structure in ${family}.json`);
        }

        return data;
      })
      .catch((error) => {
        familyCache.delete(family);
        throw error;
      });

    familyCache.set(family, request);
  }

  return familyCache.get(family);
}