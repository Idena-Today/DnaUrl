//const dnaurl = require("./dnaurl");

const {
    dnaUrlEncode,
    dnaUrlDecode,
    checksum
} = require("./dnaurl");


function encode() {
    const recipient = document.querySelector("#dna-recipient").value.trim().toLowerCase();
    const amount = parseFloat(document.querySelector("#dna-amount").value.trim());
    const data = document.querySelector("#dna-data").value.trim();
    const transaction = { "recipient": recipient, "amount": amount, "data": data }
    const dnaUrl = dnaUrlEncode(transaction);
    const el = document.querySelector("#dna-encode-result")
    el.classList.remove("hidden");
    el.innerHTML = dnaUrl;
}

function decode() {
    const dnaUrl = document.querySelector("#dnaurl").value.trim();
    const transaction = dnaUrlDecode(dnaUrl);
    const el = document.querySelector("#dna-decode-result")
    el.classList.remove("hidden");
    el.innerHTML = JSON.stringify(transaction);
}

/*
// Moved to test, kept for temp. reference.
const bulkTransactions = [
    {
        recipient: '0x92ab3627cfe74def8d9381373226ab28cba69327',
        amount: 123,
        data: 'a'
    },
    {
        recipient: '0x92ab3627cfe74def8d9381373226ab28cba69328',
        amount: 459,
        data: '22'
    },
    {
        recipient: '0x92ab3627cfe74def8d9381373226ab28cba69329',
        amount: 123,
        data: ''
    }
];


const dnaUrl = dnaUrlEncode(bulkTransactions);
console.log(dnaUrl)

const txns = dnaUrlDecode(dnaUrl);
console.log(txns);
*/

document
    .querySelector("#btn-encode")
    .addEventListener("click", encode);

document
    .querySelector("#btn-decode")
    .addEventListener("click", decode);
