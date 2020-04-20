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
    const transaction = {"recipient": recipient, "amount": amount, "data": data}
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
    el.innerHTML = JSON. stringify(transaction);
}


document
  .querySelector("#btn-encode")
  .addEventListener("click", encode);

document
  .querySelector("#btn-decode")
  .addEventListener("click", decode);
