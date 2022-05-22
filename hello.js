
let invoice = require('./invoices.json');
let plays = require('./plays.json');
let st = require('./statement.js');


//console.log(st.statement(invoice, plays));
//console.log(st.c(1,2));
//console.log(invoice);

// console.log(st.c(invoice, plays));

const assert = require('assert');
//  assert.strictEqual(st.c(invoice, plays),`Statement for bigCo
// hamlet:$650.00 (55 seats) 
// gold:$580.00 (35 seats) 
// hello:$500.00 (40 seats) 
// Amount owned is $1,730.00
// You earned 47 credits \n`);

console.log(st.plain(invoice, plays));
console.log(st.html(invoice, plays));