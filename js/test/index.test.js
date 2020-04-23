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
    const expected2 = "{\"recipient\":\"0x0000000000000000000000000000000000000000\",\"amount\":\"3\",\"data\":\"test3\",\"status\":\"OK\",\"message\":\"\"}";
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
