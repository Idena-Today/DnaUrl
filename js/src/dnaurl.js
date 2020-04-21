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

function dnaUrlTxnString(transaction) {
    encData = transaction['data'] ? encoder.encode(transaction['data']).toString() : ''
    // console.log(transaction);
    return transaction['recipient'] + "/"
        + transaction['amount'].toString() + "/"
        + encData + '/';
}

function dnaUrlProtocolAndChecksum(txnString) {
    // console.log(txnString)
    url = "dna://" + txnString;
    chk = checksum(url);
    url += chk;
    return url;
}

function dnaUrlEncode(transactions) {
    if (Array.isArray(transactions)) {
        var txnString = 'bulk/'
        for (const transaction of transactions) {
            console.log(transaction);
            string = dnaUrlTxnString(transaction);
            console.log(string)
            txnString += string;
        };
    } else {
        txnString = dnaUrlTxnString(transactions);
    }
    url = dnaUrlProtocolAndChecksum(txnString);
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
    if (segments[2] === 'bulk') {
        var bulkSegments = segments.slice(3, -1);
        if (bulkSegments.length % 3 !== 0) {
            status = 'KO';
            message += 'Bulk DNA URL incorrect format\n';
        }
        transaction = [];
        for (i = 0; i < bulkSegments.length / 3; i++) {
            var j = 3 * i;
            var k = 3 * i + 1;
            var l = 3 * i + 2;
            transaction.push({ "recipient": bulkSegments[j], "amount": bulkSegments[k], "data": encoder.decode(bulkSegments[l]).toString() });
        }
    } else {
        transaction = { "recipient": segments[2], "amount": segments[3], "data": encoder.decode(segments[4]).toString() }
    }
    rebuild = dnaUrlEncode(transaction);
    if (rebuild != dnaUrl) {
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
