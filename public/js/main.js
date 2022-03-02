import {
  setSearchFocus,
  showClearTextButton,
  clearSearchText,
  clearPressedListener,
} from "./searchBar.js";
import {
  deleteSearchResults,
  buildSearchResults,
  clearStatsLine,
  setStatsLine,
} from "./searchResults.js";
import { getSearchTerm, retrieveSearchResults } from "./dataFunctions.js";

document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
    initApp();
  }
});

const initApp = () => {
  setSearchFocus(); // Set the focus.

  /* Search button event listeners */
  const search = document.getElementById("search");
  search.addEventListener("input", showClearTextButton);
  const clear = document.getElementById("clear");
  clear.addEventListener("click", clearSearchText);
  clear.addEventListener("keydown", clearPressedListener);

  const form = document.getElementById("searchBar");
  form.addEventListener("submit", submitTheSearch);
};

// Procedural "workflow" function.
const submitTheSearch = (event) => {
  event.preventDefault();
  deleteSearchResults(); // delete results.
  processTheSearch(); // Process the search
  setSearchFocus(); // Set the focus
};

// Procedural.
const processTheSearch = async () => {
  clearStatsLine(); // Clear the stats line.
  const searchTerm = getSearchTerm();
  if (searchTerm === "") return;
  const resultArray = await retrieveSearchResults(searchTerm);
  if (resultArray.length) buildSearchResults(resultArray);
  // Set stats line (Displaying 88 results).
  setStatsLine(resultArray.length);
};
