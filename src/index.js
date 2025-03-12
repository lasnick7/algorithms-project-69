function makeTerm(token) {
    const matchResult = token.match(/\w+/g); 
    return matchResult ? matchResult[0] : ''; 
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

function invertIndex(docs) {
    const index = {};

    const docsWithArrText = docs.map((doc) => {
        const newDoc = {...doc};

        const arr = doc.text
        .toLowerCase()
        .split(' ')
        .map((token) => makeTerm(token))
        .sort();

        newDoc.text = arr;
        return newDoc;
    });

    docsWithArrText.forEach((doc) => doc.text.forEach((word) => {
        if(!(word in index)) {
            index[word] = [];
        }
        index[word].push(doc.id)
    }));

    return index;
}

function TF(doc, word) {
    const arr = doc.text
        .toLowerCase()
        .split(' ')
        .map((token) => makeTerm(token))
        .sort();
    
    const wordCount = arr.length;

    const entriesCount = countEntries(arr, word);

    return entriesCount / wordCount;
}

function IDF(docs, word, index) {
    const docsCount = docs.length;
    const termCount = index[word].length;
    return Math.log2(1 + (docsCount - termCount + 1) / (termCount + 0.5));
}

export default function search(docs, items) {
    
    const index = invertIndex(docs);

    const wordsToSearch = items
        .toLowerCase()
        .split(' ')
        .map((token) => makeTerm(token));

    const result = docs.map((doc) => {
        let TFIDF = 0;

        wordsToSearch.forEach((word) => {
            const currWordTF = TF(doc, word);
            const currWordIDF = IDF(docs, word, index);
            const currWordTFIDF = currWordTF * currWordIDF;
            TFIDF += currWordTFIDF;
        });

        return {
            id: doc.id, 
            TFIDF,
        };
    })
    .filter((doc) => doc.TFIDF > 0)
    .sort((a, b) => b.TFIDF - a.TFIDF)
    .map((doc) => doc.id);

    return result;
}