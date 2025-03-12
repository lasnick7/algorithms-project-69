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

export default function search(docs, item) {
    return docs.map((doc) => {
        const arr = doc.text
            .toLowerCase()
            .split(' ')
            .map((token) => makeTerm(token))
            .sort();

        return {
            id: doc.id, 
            count: countEntries(arr, makeTerm(item)),
        };
    })
    .sort((a, b) => b.count - a.count)
    .filter((doc) => doc.count > 0)
    .map((doc) => doc.id);
}

const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
const doc3 = { id: 'doc3', text: "I'm your shooter." };
const docs = [doc1, doc2, doc3];

console.log(search(docs, 'shoot'))
