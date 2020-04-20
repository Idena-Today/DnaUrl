// Derived from bisurl

const createHash = require('create-hash');
const { Ascii85 } = require('ascii85');


const encoder = new Ascii85({
    // Use RFC194 table
    table: [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        '!', '#', '$', '%', '&', '(', ')', '*', '+', '-', ';', '<', '=', '>', '?', '@', '^', '_', '`', '{', '|', '}', '~'
    ]
});


function checksum(string) {
    //  checksum for bisurl
    buffer = Buffer.from(string);
    md5 = createHash('md5').update(buffer).digest();
    encoded = encoder.encode(md5).toString()
    return encoded;
}

function dnaUrlEncode(transaction) {
    //  Assemble a dna url from json transaction data
    url = "dna://" + transaction['recipient'] + "/"
        + transaction['amount'].toString() + "/"
        + encoder.encode(transaction['data']).toString() + "/";
    chk = checksum(url);
    url += chk;
    return url;
}

function dnaUrlDecode(dnaUrl) {
    segments = dnaUrl.split("/");
    var message = "";
    var status = "OK";
    // TODO: more sanity checks
    //console.log(segments);
    if (segments[0] != "dna:") {
        status = 'KO';
        message += 'Not a DNA URL\n';
    };
    if (segments[1] != "") {
        status = 'KO';
        message += 'Not a DNA URL\n';
    };
    transaction = {"recipient": segments[2], "amount": segments[3], "data": encoder.decode(segments[4]).toString()}
    rebuild = dnaUrlEncode(transaction);
    //console.log(rebuild);
    if (rebuild!=dnaUrl) {
        status = 'KO';
        message += 'Wrong Checksum\n';
    }
    transaction["status"] = status;
    transaction["message"] = message;
    return transaction;
}


module.exports = {
    dnaUrlEncode,
    dnaUrlDecode,
    checksum
}
