function makeTerm(token) {
    return token.match(/\w+/g)[0];
}

function countEntries(arr, item) {
    let count = 0;

    let startIndex = 0;
    let endIndex = arr.length - 1;

    function getMiddleIndex(startIndex, endIndex) {
        return Math.floor((endIndex - startIndex) / 2) + startIndex;
    }

    let middleIndex = getMiddleIndex(startIndex, endIndex);

    while(startIndex <= endIndex) {
        if (arr[middleIndex] === item) {
            count += 1;

            for (let i = middleIndex + 1; i <= endIndex; i += 1) {
                if (arr[i] === item) {
                    count += 1;
                } else {
                    break;
                }
            }

            for (let i = middleIndex - 1; i >= startIndex; i -= 1) {
                if (arr[i] === item) {
                    count += 1;
                } else {
                    break;
                }
            }

            return count;
        } else if (arr[middleIndex] < item) {
            startIndex = middleIndex + 1;
            middleIndex = getMiddleIndex(startIndex, endIndex);
        } else if (arr[middleIndex] > item) {
            endIndex = middleIndex - 1;
            middleIndex = getMiddleIndex(startIndex, endIndex);
        }
    }

    return count;
}

export default function search(docs, items) {
    const result = docs.map((doc) => {
        let totalEntriesCount = 0;
        let wordCount = 0;

        const arr = doc.text
            .toLowerCase()
            .split(' ')
            .map((token) => makeTerm(token))
            .sort();

        const words = items
            .toLowerCase()
            .split(' ')
            .map((token) => makeTerm(token));

        words.forEach((word) => {
            const entriesForCurrWord = countEntries(arr, word);
            if (entriesForCurrWord > 0) {
                totalEntriesCount += entriesForCurrWord;
                wordCount += 1;
            }
        });

        return {
            id: doc.id, 
            count: totalEntriesCount,
            words: wordCount,
        };
    })
    .filter((doc) => doc.count > 0)
    .sort((a, b) => {
        if (a.words !== b.words) {
            return b.words - a.words;
        }
        return b.count - a.count;
    })
    .map((doc) => doc.id);

    return result;
}

// const withW = [
//     { id: 'doc1', count: 1, words: 1 },
//     { id: 'doc2', count: 5, words: 3 },
//     { id: 'doc4', count: 2, words: 1 },
//     { id: 'doc5', count: 1, words: 1 },
//     { id: 'doc6', count: 1, words: 1 }
//   ]

// function newSort(docs) {
//     const sortedByWords = docs.sort(a)
// }


const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
const doc3 = { id: 'doc3', text: "I'm your shooter." };
const doc4 = { id: 'doc4', text: "it is what it is" };
const doc5 = { id: 'doc5', text: "what Is it" };
const doc6 = { id: 'doc6', text: "it is a banana" };

const docs = [doc1, doc2, doc3, doc4, doc5, doc6];

// console.log(search(docs, 'shoot at me is'))

function invertIndex(docs) {
    const index = {};

    const docsWithArrText = docs.map((doc) => {
        const arr = doc.text
        .toLowerCase()
        .split(' ')
        .map((token) => makeTerm(token))
        .sort();
        doc.text = arr;
        return doc;
    });

    docsWithArrText.forEach((doc) => doc.text.forEach((word) => {
        if(!(word in index)) {
            index[word] = [];
        }
        index[word].push(doc.id)
    }));

    return index;
}

console.log(invertIndex(docs))