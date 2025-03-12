/* eslint-disable no-undef */

import search from "../src/index.js";

const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
const doc3 = { id: 'doc3', text: "I'm your shooter." };
const doc4 = { id: 'doc4', text: "it is what it is" };
const doc5 = { id: 'doc5', text: "what Is it" };
const doc6 = { id: 'doc6', text: "it is a banana" };

const docs = [doc1, doc2, doc3, doc4, doc5, doc6];

test('search', () => {
  expect(search(docs, 'shoot!')).toEqual(['doc2', 'doc1']);
  expect(search([], 'shoot?')).toEqual([]);
  expect(search(docs, 'shoot at me is')).toEqual([ 'doc2', 'doc4', 'doc5', 'doc6', 'doc1' ]);
});