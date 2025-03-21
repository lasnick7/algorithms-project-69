/* eslint-disable linebreak-style */
/* eslint-disable no-console */

function makeTerm(token) {
  const matchResult = token.match(/\w+/g);
  return matchResult ? matchResult[0] : '';
}

function makeArrayFromText(text) {
  return text
    .toLowerCase()
    .split(' ')
    .map((token) => makeTerm(token));
}

function countEntries(doc, word) {
  let count = 0;

  const arrayOfWords = makeArrayFromText(doc.text);

  for (let i = 0; i < arrayOfWords.length; i += 1) {
    if (arrayOfWords[i] === word) {
      count += 1;
    }
  }
  console.log(`entries for ${doc.id}, word ${word}: ${count}`);
  return count;
}

function invertIndex(docs) {
  const index = {};

  const docsWithArrText = docs.map((doc) => {
    const newDoc = { ...doc };

    const arrayOfWords = makeArrayFromText(doc.text);

    newDoc.text = arrayOfWords;
    return newDoc;
  });

  docsWithArrText.forEach((doc) => doc.text.forEach((word) => {
    if (!Object.keys(index).includes(word)) {
      index[word] = [];
    }
    if (!index[word].includes(doc.id)) {
      index[word].push(doc.id);
    }
  }));

  return index;
}

function TF(doc, word) {
  const arrayOfWords = makeArrayFromText(doc.text);

  const wordCount = arrayOfWords.length;

  const entriesCount = countEntries(doc, word);

  return entriesCount / wordCount;
}

function IDF(docs, word, index) {
  const docsCount = docs.length;
  if (index[word]) {
    const termCount = index[word].length || 0;
    return Math.log2(1 + (docsCount - termCount + 1) / (termCount + 0.5));
  }

  return 0;
}

export default function search(docs, items) {
  const index = invertIndex(docs);

  const wordsToSearch = makeArrayFromText(items);

  const result = docs.map((doc) => {
    let TFIDF = 0;

    wordsToSearch.forEach((word) => {
      const currWordTF = TF(doc, word);
      const currWordIDF = IDF(docs, word, index);
      const currWordTFIDF = currWordTF * currWordIDF;

      console.log(`word ${word} in doc ${doc.id} TF: ${currWordTF}, IDF: ${currWordIDF}, TF-IDF: ${currWordTFIDF}`);
      TFIDF += currWordTFIDF;
    });

    return {
      id: doc.id,
      TFIDF,
    };
  });

  console.log(result);

  return result
    .filter((doc) => doc.TFIDF > 0)
    .sort((a, b) => b.TFIDF - a.TFIDF)
    .map((doc) => doc.id);
}
