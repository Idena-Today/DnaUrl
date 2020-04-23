// Derived from bisurl

const createHash = require('create-hash');
const encoder = require('bs58')


function checksum(string) {
    //  checksum : first 8 bytes of md5
    buffer = Buffer.from(string);
    md5 = createHash('md5').update(buffer).digest();
    encoded = encoder.encode(md5.slice(0,8)).toString()
    return encoded;
}

function dnaUrlTxnString(transaction) {
    encData = transaction['data'] ? encoder.encode(Buffer.from(transaction['data'])).toString() : ''
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

// 0x0000000000000000000000000000000000000000
