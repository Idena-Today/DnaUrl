# WORK IN PROGRESS #

Specs are there but js code still is in the works. Scaffold only as for now.


## DNA URL

A DnaUrl is a safe way to encode an Idena transaction - including data payload - into a safe to transfer string.

Instead of copying and pasting several fields:
- recipient
- amount
- optional data

and taking the risk of getting any of those invalid (missing char, extra space...), a DNA URL encodes them all into a single string.  
Moreover, that string comes with an embedded checksum that makes it impossible to validate a corrupted chain.

The app using a DNA URL has a reliable way to check the string was input in full, with no change.

This is especially important for dapps and second layer protocols, that will require on data payploads.  
these data payloads are not always human readable, and need to be bit-precise.

Using DNA URLs ensures the whole data is unharmed.

You can think of DNA URLs as evidence bags:
- you can put data in them
- a human still can read the important info (who to send, dna amount)
- any accidental modification of the data will be detected thanks to the checksum 

## Format

The overall format is a URL, that looks like

dna://0xrecipient_address/amount/data/checksum

- dna:// the protocol part of the url
- 0xrecipient_address: the recipient address, string, in clear. This is a regular DNA Address, 0x then 40 hex chars.  
- amount: numeric. The amount of DNA to send to the recipient. Can be 0.
- data: optional, can be empty. The encoded data payload. 
- checksum: required, encoded checksum of the `dna://0xrecipient_address/amount/data/` part

Note: Eth address are hex chars, not case sensitive (a..f == A..F) however, an optional checksum can be used with eth like addresses, by encoding the hash in the case of the address.  
There could be an added check for eth checksum, but as we can't make sure a case difference was on purpose or not, it will not be integrated as part of the checks of a DnaUrl.

### Encoding

data and checksum are encoded using base85 - RFC194

### Checksum

Checksum is a md5 of the `dna://0xrecipient_address/amount/data/` string

## FAQ 

Why this base85 encoding?  
- less space wasted compared to base64
- no / in the charset, therefore compatible with url use.


### Reference

Derived from Bismuth "BisUrl" serialization format.
