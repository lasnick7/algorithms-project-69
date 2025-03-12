function makeTerm(token) {
    const matchResult = token.match(/\w+/g); // Поиск совпадений
    return matchResult ? matchResult[0] : ''; // Возвращаем первое совпадение или пустую строку
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
        // let totalEntriesCount = 0;
        // let wordCount = 0;
        let TFIDF = 0;

        // const arrOfWords = doc.text
        //     .toLowerCase()
        //     .split(' ')
        //     .map((token) => makeTerm(token))
        //     .sort();

        wordsToSearch.forEach((word) => {
            const currWordTF = TF(doc, word);
            const currWordIDF = IDF(docs, word, index);
            const currWordTFIDF = currWordTF * currWordIDF;
            TFIDF += currWordTFIDF;
        });

        return {
            id: doc.id, 
            TFIDF,
            // count: totalEntriesCount,
            // words: wordCount,
        };
    })
    .filter((doc) => doc.TFIDF > 0)
    .sort((a, b) => b.TFIDF - a.TFIDF)
    .map((doc) => doc.id);
    // .map((doc) => doc.id);
    // .sort((a, b) => {
    //     if (a.words !== b.words) {
    //         return b.words - a.words;
    //     }
    //     return b.count - a.count;
    // })
    // .map((doc) => doc.id);

    return result;
}

console.log(search(docs, 'shoot at me is'))
// console.log(TF(doc2, 'shoot'))
// console.log(IDF(docs, 'shoot', invertIndex(docs)))
// console.log(invertIndex(docs))