export const getSearchTerm = () => {
  const rawSearchTerm = document.getElementById("search").value.trim();
  const regex = /[ ](2,)/gi;
  const searchTerm = rawSearchTerm.replaceAll(regex, " ");
  return searchTerm;
};

export const retrieveSearchResults = async (searchTerm) => {
  const wikiSearchString = getWikiSearchString(searchTerm);
  const wikiSearchResults = await requestData(wikiSearchString);

  let resultArr = [];
  if (wikiSearchResults.hasOwnProperty("query")) {
    resultArr = processWikiResults(wikiSearchResults.query.pages);
  }
  return resultArr;
};

const getWikiSearchString = (searchTerm) => {
  const maxChars = getMaxChars();

  const rawSearchString = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrlimit=20&prop=pageimages|extracts&exchars=${maxChars}&exintro&explaintext&exlimit=max&format=json&origin=*`;

  const searchString = encodeURI(rawSearchString); // Encode spaces or uri that might not work.
  return searchString;
};

const getMaxChars = () => {
  // defines max Chars to be extracted from the wikipedia api depending on the viewport width.
  const width = window.innerWidth || document.body.clientWidth;
  let maxChars;
  if (width < 414) maxChars = 65;
  if (width >= 414 && width < 1400) maxChars = 100;
  if (width >= 1400) maxChars = 130;

  return maxChars;
};

const requestData = async (searchString) => {
  try {
    const response = await fetch(searchString);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

const processWikiResults = (results) => {
  const resultArr = [];
  Object.keys(results).forEach((key) => {
    const id = key;
    const title = results[key].title;
    const text = results[key].extract;
    const img = results[key].hasOwnProperty("thumbnail")
      ? results[key].thumbnail.source
      : null;

    const item = {
      id: id,
      title: title,
      img: img,
      text: text,
    };
    resultArr.push(item);
  });

  return resultArr;
};
