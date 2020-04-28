const { dnaUrlEncode, dnaUrlDecode, checksum } = require("../src/dnaurl");

describe("Checksum Tests", () => {
  test("checksum 1", () => {
    const string = "sample test string";
    const check = checksum(string);
    expect(check).toBe("bGwPXdW4PWz");
  });
  test("checksum 2", () => {
    const string = "dna://0x0000000000000000000000000000000000000000/0/3yZe7d/AXY5DmfkgTd";
    const check = checksum(string);
    expect(check).toBe("hhsozbu94ga");
  });
 });

describe("DnaUrl Single Tx Tests", () => {
  test("DnaUrl 1", () => {
    const transaction = {
      "recipient": "0x0000000000000000000000000000000000000000",
      "amount": 0,
      "data": "test"
    };
    const expected = "dna://0x0000000000000000000000000000000000000000/0/3yZe7d/AXY5DmfkgTd";
    const dnaUrl = dnaUrlEncode(transaction);
    expect(dnaUrl).toBe(expected);
  });
  test("DnaUrl 2", () => {
    const transaction = {
      "recipient": "0x0000000000000000000000000000000000000000",
      "amount": 10,
      "data": ""
    };
    const expected = "dna://0x0000000000000000000000000000000000000000/10//74R79Hk685b";
    const dnaUrl = dnaUrlEncode(transaction);
    expect(dnaUrl).toBe(expected);
  });
  test("DnaUrl 3+", () => {
    const transaction = {
      "recipient": "0x0000000000000000000000000000000000000000",
      "amount": 3,
      "data": "test3"
    };
    const expected = "dna://0x0000000000000000000000000000000000000000/3/E8f4pEn/NbKHYJ3LyyS";
    const dnaUrl = dnaUrlEncode(transaction);
    expect(dnaUrl).toBe(expected);
    const decoded = dnaUrlDecode(dnaUrl);
    const expected2 = "{\"type\":\"base\",\"recipient\":\"0x0000000000000000000000000000000000000000\",\"amount\":\"3\",\"data\":\"test3\",\"status\":\"OK\",\"message\":\"\"}";
    // Will JSON.stringify be consistent across all impl or do we have to test key by key?
    expect(JSON.stringify(decoded)).toBe(expected2);
  });
});

describe("DnaUrl Batch Tests", () => {
  test("DnaUrl Batch 1", () => {
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
    const expected = "dna://bulk/0x92ab3627cfe74def8d9381373226ab28cba69327/123/2g/0x92ab3627cfe74def8d9381373226ab28cba69328/459/4pZ/0x92ab3627cfe74def8d9381373226ab28cba69329/123//YQ1VwSEKZr4";
    expect(dnaUrl).toBe(expected);

    // TODO: redecode and check?
    // const txns = dnaUrlDecode(dnaUrl);
  });
});


describe("DnaUrl Raw Tx Tests", () => {
  test("txVector1", () => {
    const transaction = {
      "nonce": 1,
      "epoch": 41,
      "type": 0,
      "recipient": "0x02bD24aD70C2335F5B3FE47bfcE8eD6e39D447CB",
      "amount": 1,
      "maxFee": 10000,
      "tips": null,
      "data": "0x"
    };
    const expected = "dna://raw/1/41/0/0x02bD24aD70C2335F5B3FE47bfcE8eD6e39D447CB/1/10000//4gw/X1xxavvWwXa";
    const dnaUrl = dnaUrlEncode(transaction, "raw");
    expect(dnaUrl).toBe(expected);
    const decoded = dnaUrlDecode(dnaUrl);
    //console.log(decoded)
    // Make sure decoded = original
    for( var key in transaction ) {
        expect(decoded[key]).toBe(transaction[key]);
    }
    // hash is what will need to be signed
    expect(decoded["hash"]).toBe("df19875a7f76deb535fc2bce4fc4536270ed9c3a1f422e1c0950234bac7ddcdc")
  });
  test("txVector1b", () => {
    const transaction = {
      "nonce": 1,
      "epoch": 41,
      "type": 0,
      "recipient": "0x02bD24aD70C2335F5B3FE47bfcE8eD6e39D447CB",
      "amount": 1,
      "maxFee": 10000,
      "tips": 1,
      "data": "0x"
    };
    const expected = "dna://raw/1/41/0/0x02bD24aD70C2335F5B3FE47bfcE8eD6e39D447CB/1/10000/1/4gw/NhaTbUHq2j";
    const dnaUrl = dnaUrlEncode(transaction, "raw");
    expect(dnaUrl).toBe(expected);
    const decoded = dnaUrlDecode(dnaUrl);
    //console.log(decoded)
    // Make sure decoded = original
    for( var key in transaction ) {
        expect(decoded[key]).toBe(transaction[key]);
    }
    // hash is what will need to be signed
    expect(decoded["hash"]).toBe("8221fce056eea4e8ea7708f0456df5cb73d85c08da0eeb08487b44eb25e53f36")
  });
  test("txVector1c", () => {
    const transaction = {
      "nonce": 1,
      "epoch": 41,
      "type": 0,
      "recipient": "0x02bD24aD70C2335F5B3FE47bfcE8eD6e39D447CB",
      "amount": 1,
      "maxFee": 10000,
      "tips": null,
      "data": null
    };
    const expected = "dna://raw/1/41/0/0x02bD24aD70C2335F5B3FE47bfcE8eD6e39D447CB/1/10000///9qtKYVGoG7j";
    const dnaUrl = dnaUrlEncode(transaction, "raw");
    expect(dnaUrl).toBe(expected);
    const decoded = dnaUrlDecode(dnaUrl);
    //console.log(decoded)
    // Make sure decoded = original
    for( var key in transaction ) {
        expect(decoded[key]).toBe(transaction[key]);
    }
    // hash is what will need to be signed
    expect(decoded["hash"]).toBe("df19875a7f76deb535fc2bce4fc4536270ed9c3a1f422e1c0950234bac7ddcdc")
  });
});

describe("DnaUrl Sig Tests", () => {
  // signature from dnamask test vector.
  test("txVector1", () => {
    const transaction = {
      "txid": "X1xxavvWwXa", // encoded checksum of tx to sign
      "signature": "df3a8b3ed0801452f051cc8f28cefbe80d6fe7d26a09803ff5b7a3c0d42440a70d5bdb718eb12c627708af81af08607fe01ae63a4732880cf0dbe75175007ce000" // hex
    };
    const expected = "dna://sig/X1xxavvWwXa/LhYToi5nL8RWtViFiKxnzP7x3HcooE6gojgQd5pikrDwy9qAZaaiTL4348EaLMrekyTJzEnozZXTpqZZae5ooAUas/bULVxFka8kM";
    const dnaUrl = dnaUrlEncode(transaction, "sig");
    expect(dnaUrl).toBe(expected);
    const decoded = dnaUrlDecode(dnaUrl);
    //console.log(decoded)
    // Make sure decoded = original
    for( var key in transaction ) {
        expect(decoded[key]).toBe(transaction[key]);
    }
  });
});
