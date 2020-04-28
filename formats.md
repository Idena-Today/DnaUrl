# DNA URL Formats

- Encoding refers to Base58 encoding
- checksum refers to the checksum of the url as defined in [main page](Readme.md#Checksum).

## Regular DNA URL

Main use: Safe way to encode an Idena transaction to be sent by a user - including data payload - into a safe to transfer string.

Format: `dna://0xrecipient_address/amount/data/checksum`

- dna:// the protocol part of the url
- 0xrecipient_address: the recipient address, string, in clear. This is a regular DNA Address, 0x then 40 hex chars.  
- amount: numeric. The amount of DNA to send to the recipient. Can be 0.
- data: optional, can be empty. The encoded data payload. 
- checksum: required, encoded checksum of the `dna://0xrecipient_address/amount/data/` part

Note: Eth address are hex chars, not case sensitive (a..f == A..F) however, an optional checksum can be used with eth like addresses, by encoding the hash in the case of the address.  
There could be an added check for eth checksum, but as we can't make sure a case difference was on purpose or not, it will not be integrated as part of the checks of a DnaUrl.

Example workflows:

- Exchange deposit info can be a DnaUrl. This will contain recipient address as well as optional data.   
User has a single - foolproof and checksumed - string to copy/paste into his wallet of choice to sent it.
- Online shop: payment data (recipient, amount, data) is a dnaurl 
- Second layer dApps: data payload and its format is essential in that context. DnaUrl allows to make sure it's properly formatted and untampered with.
- dnaurl can be transfered as qrcode as well.


## Bulk DNA URL

Suggested and implemented by @EarthlingDavey

Main use: transmit several transactions in one go.

Format: `dna://0xrecipient_address1/amount1/data1/../0xrecipient_addressn/amountn/datan/checksum`

Example workflows:

- Voting platform using second layer operations: user selects several options/motions, the website exports a bulk dnaurl string for the wallet to sign and send


## Raw DNA URL

Suggested by @AngainorDev

Main use: transmit a raw transaction - with all core params - to be signed offline

Format: `dna://raw/nonce/epoch/type/to/amount_int/maxfee_int/tips_int/encoded_payload/checksum`

Note: Fields are in the same order as the transaction to be assembled.  
technical info (nonce, epoch) is required since it's part of the signed buffer hash.

Example workflow:  
- Online app produces a raw transaction (needs the nonce), as a DnaUrl
- User transfers the dnaurl to the offline signer (usb key, qrcode)
- offline signer app displays the transaction to be signed, asks for confirmation
- transaction signature is encoded as a dnaurl (see signature only dnaurl below)
- signature is transfered back to online app/wallet for chain submission

## Signature only DNA URL

Suggested by @AngainorDev

Main use: transmit a raw transaction signature for chain submission

Format: `dna://txchecksum/encoded_sig_buffer/checksum`

encoded_sig_buffer is "joinedSignature" encoded in base58. The online wallet then assemble the full tx and sends it.  
it should also validate the signature, so no mismatch is possible.

To keep some link between the raw signature and the signature, checksum part of the dna://raw is used as a temporary txsig id.

Example workflow:  see Raw DNA URL Above
