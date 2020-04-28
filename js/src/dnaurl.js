// Derived from bisurl

const createHash = require('create-hash');
const encoder = require('bs58')
const RLP = require('rlp');
const keccak256 = require("keccak256");

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

function dnaRawUrlTxnString(transaction) {
    // nonce, epoch, type, to=recipient, amount, maxfee, tips, payload=data
    encData = transaction['data'] ? encoder.encode(Buffer.from(transaction['data'])).toString() : '';
    // tips and data can be null
    tips = transaction['tips'] ? transaction['tips'].toString() : '';
    // console.log(transaction);
    return transaction['nonce'].toString() + "/"
        + transaction['epoch'].toString() + "/"
        + transaction['type'].toString() + "/"
        + transaction['recipient'] + "/"
        + transaction['amount'].toString() + "/"
        + transaction['maxFee'].toString() + "/"
        + tips + "/"
        + encData + '/';
}

function dnaSigUrlTxnString(transaction) {
    // txid (string, encoded checksum of signed tx)
    // signature (hex encoded)
    //console.log(transaction);
    return transaction['txid'] + "/"
         + encoder.encode(Buffer.from(transaction['signature'], 'hex')).toString() + "/"
}

function dnaUrlProtocolAndChecksum(txnString) {
    // console.log(txnString)
    url = "dna://" + txnString;
    chk = checksum(url);
    url += chk;
    return url;
}

function dnaUrlEncode(transactions, urlType="base") {
    if (urlType=="raw") {
        var txnString = 'raw/';
        txnString += dnaRawUrlTxnString(transactions);
    } else if (urlType=="sig") {
        var txnString = 'sig/';
        txnString += dnaSigUrlTxnString(transactions);
    } else if (Array.isArray(transactions)) {
        var txnString = 'bulk/'
        for (const transaction of transactions) {
            //console.log(transaction);
            string = dnaUrlTxnString(transaction);
            //console.log(string)
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
    var urlType = "base";
    if (segments[0] != "dna:") {
        status = 'KO';
        message += 'Not a DNA URL\n';
    };
    if (segments[1] != "") {
        status = 'KO';
        message += 'Not a DNA URL\n';
    };
    if (segments[2] === 'bulk') {
        urlType = "bulk";
        var bulkSegments = segments.slice(3, -1);
        if (bulkSegments.length % 3 !== 0) {
            status = 'KO';
            message += 'Bulk DNA URL incorrect format\n';
        } else {
            transaction = {"type" : "bulk", "transactions": []};
            for (i = 0; i < bulkSegments.length / 3; i++) {
                var j = 3 * i;
                var k = 3 * i + 1;
                var l = 3 * i + 2;
                transaction["transactions"].push({ "recipient": bulkSegments[j], "amount": bulkSegments[k], "data": encoder.decode(bulkSegments[l]).toString() });
            }
        }
    } else if (segments[2] === 'raw') {
        urlType = "raw";
        var rawSegments = segments.slice(3, -1);
        //console.log(rawSegments);
        if (rawSegments.length !== 8) {
            status = 'KO';
            message += 'Raw DNA URL incorrect number of segments\n';
        } else {
            // rawSegments is the core format directly. we may need paranoid checks to check types of each segment
            // nonce, epoch, type, to, amount, maxFee, tips, payload
            [0,1,2,4,5].forEach(function(index){
                rawSegments[index] = parseInt(rawSegments[index]);
            });
            rawSegments[6] = rawSegments[6] ? parseInt(rawSegments[6]) : null;
            rawSegments[7] = rawSegments[7] ? encoder.decode(rawSegments[7]).toString() : null;
            const hash = keccak256(RLP.encode(rawSegments))
            //console.log(rawSegments)
            //console.log(RLP.encode(rawSegments))  // "de0129809402bd24ad70c2335f5b3fe47bfce8ed6e39d447cb018227108080"
            transaction = {"type": "raw", "raw": rawSegments, "nonce": rawSegments[0], "epoch": rawSegments[1],
                           "type":rawSegments[2],  "recipient": rawSegments[3], "amount": rawSegments[4],
                           "maxFee": rawSegments[5], "tips": rawSegments[6], "data": rawSegments[7], "hash": hash.toString('hex') }
        }
    } else if (segments[2] === 'sig') {
        urlType = "sig";
        var rawSegments = segments.slice(3, -1);
        //console.log(rawSegments);
        transaction = {"type": "sig", "txid": rawSegments[0], "signature": encoder.decode(rawSegments[1]).toString('hex') }
    } else {
        transaction = {"type": "base", "recipient": segments[2], "amount": segments[3], "data": encoder.decode(segments[4]).toString() }
    }
    rebuild = dnaUrlEncode(transaction, urlType);
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
