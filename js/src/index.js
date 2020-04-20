const dnaurl = require("./dnaurl");
var dnaUrl = dnaurl.dnaUrl;

document
  .querySelector("#btn-generate")
  .addEventListener("click", generate_seed);

const genVoteUrlButton = document.querySelector("#generate-vote-url");
if (genVoteUrlButton) genVoteUrlButton.addEventListener("click", generate_vote);
