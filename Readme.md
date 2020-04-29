# WORK IN PROGRESS

Encode and decode working, partial HTML demo working.

Now hosted as a npm module https://www.npmjs.com/package/dnaurl

## DnaUrl

A DnaUrl is a safe way to encode an Idena transaction - including data payload - into a safe to transfer string.

Instead of copying and pasting several fields like

- Recipient
- Amount
- Optional data

and taking the risk of getting any of those invalid (missing char, extra space, ...), a DnaUrl encodes them all into a single string.  
Moreover, that string comes with an embedded checksum that makes it impossible to validate a corrupted chain.

The app using a DnaUrl has a reliable way to check if the string was input in full, with no change.

This is especially important for dapps and second layer protocols, that will require a data payload.  
These data payloads are not always human readable, and need to be bit-precise.

Using DnaUrl ensures the whole data is unharmed.

You can think of DnaUrls as evidence bags:

- You can put data in them
- A human still can read the important info (who to send, DNA amount)
- Any accidental modification of the data will be detected thanks to the checksum

## Format

The overall format is a URL, that looks like this

`dna://0xrecipient_address/amount/data/checksum`

- `dna://` the protocol part of the url
- 0xrecipient_address: the recipient address, string, in clear. This is a regular DNA address. 0x then 40 hex chars.
- amount: numeric. The amount of DNA to send to the recipient. Can be 0.
- data: optional, can be empty. The encoded data payload.
- checksum: required, encoded checksum of the `dna://0xrecipient_address/amount/data/` part

**Note**: ETH address are hex chars, not case sensitive (a..f == A..F) however, an optional checksum can be used with ETH like addresses, by encoding the hash in the case of the address.  
There could be an added check for ETH checksum, but as we can&#39;t make sure a case difference was on purpose or not, it will not be integrated as part of the checks of a DnaUrl.

### Encoding

Data and checksum are encoded using base58.

### Checksum

Checksum consist of the first 8 bytes of md5 from the `dna://0xrecipient_address/amount/data/` string.  
Goal is to prevent accidental damaging of the string while in transit, not to have a secure cryptographic primitive.

## Extended formats

More formats are specified for specific cases, like bulk transaction sending or offline signing.  
**All formats specs are now listed on the dedicated [DnaUrl Formats](formats.md) page**

## Demo

See crude [live demo](https://idena-today.github.io/DnaUrl/js/dist/)

## FAQ

Why base58 encoding?

- No `/` in the charset, therefore compatible with url use
- No character that would be escaped or encoded in various apps
- Every segment of the url can be doubleclicked to be copied individually

## History

- v0.0.6: Added &quot;raw&quot; and &quot;sig&quot; formats & test vectors - Change format of decoded transaction object
- v0.0.5: Added doc for npm
- v0.0.4: Published to npm
- v0.0.3: Moved from base85 to base58, shorter checksum
- v0.0.2: Working demo
- v0.0.1: Initial commit

## Compatible implementations

WIP

### Reference

Derived from Bismuth &quot;BisUrl&quot; serialization format.

## Package development

- Go to the js folder `cd js`
  
- To install dependencies run `npm install`
  
- For a local server during development `npm run start`. Changes in /src are loaded into the browser.
  
- To build into the /dist folder `npm run build`
  
- Tests (when written) `npm run test`
  
- After building, serve with `npm run serve`
