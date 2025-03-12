function quicSort(arr) {
    if (arr.length < 2) {
        return arr;
    }

    const pivot = arr[0];

    const left = [];
    const center = [];
    const right = [];

    for (let item of arr) {
        if (item < pivot) {
            left.push(item);
        } else if (item === pivot) {
            center.push(item);
        } else if (item > pivot) {
            right.push(item);
        }
    }

    return [...quicSort(left), ...center, ...quicSort(right)];
}

function binarySearch(arr, item) {
    if (arr.length < 2) {
        if (arr[0] === item) {
            return true;
        }
        return false;
    }

    const middleIndex = Math.round(arr.length / 2);

    if (item === arr[middleIndex]) {
        return true;
    } 
    if (item < arr[middleIndex]) {
        return binarySearch(arr.slice(0, middleIndex), item);
    }
    if (item > arr[middleIndex]) {
        return binarySearch(arr.slice(middleIndex + 1, arr.length), item);
    }
}

export default function search(docs, item) {
    return docs.filter((doc) => {
        const arr = quicSort(doc.text.toLowerCase().split(' '));
        return binarySearch(arr, item);
    }).map((doc) => doc.id);
}