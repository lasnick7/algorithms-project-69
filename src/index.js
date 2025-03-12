function makeTerm(token) {
    const matchResult = token.match(/\w+/g); 
    return matchResult ? matchResult[0] : ''; 
}

function makeArrayFromText(text) {
    return text.toLowerCase().split(' ').map((token) => makeTerm(token));
}

function countEntries(doc, word) {
    let count = 0;

    const arrayOfWords = makeArrayFromText(doc.text);

    for (let item of arrayOfWords) {
        if (item === word) {
            count += 1;
        }
    }
    console.log(`entries for ${doc.id}, word ${word}: ${count}`)
    return count;
}

function invertIndex(docs) {
    const index = {};

    const docsWithArrText = docs.map((doc) => {
        const newDoc = {...doc};

        const arrayOfWords = makeArrayFromText(doc.text);

        newDoc.text = arrayOfWords;
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
    const arrayOfWords = makeArrayFromText(doc.text);
    
    const wordCount = arrayOfWords.length;

    const entriesCount = countEntries(doc, word);

    return entriesCount / wordCount;
}

function IDF(docs, word, index) {
    const docsCount = docs.length;
    const termCount = index[word].length;
    if (termCount !== 0) {
        return Math.log2(1 + (docsCount - termCount + 1) / (termCount + 0.5));
    } else {
        return 0;
    }
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
            TFIDF += currWordTFIDF;
        });

        return {
            id: doc.id, 
            TFIDF,
        };
    }); 

    console.log(result); 

    return result.filter((doc) => doc.TFIDF > 0)
        .sort((a, b) => b.TFIDF - a.TFIDF)
        .map((doc) => doc.id);
}

const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
const doc3 = { id: 'doc3', text: "I'm your shooter." };
const doc4 = { id: 'doc4', text: "it is what it is" };
const doc5 = { id: 'doc5', text: "what Is it" };
const doc6 = { id: 'doc6', text: "it is a banana" };

const docs = [doc1, doc2, doc3, doc4, doc5, doc6];

console.log(search(docs, 'shoot at me'))