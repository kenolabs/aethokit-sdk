# AETHOKIT-SDK

Aethokit-sdk is a solana SDK that allows developers to sponsor gas transactions on the solana blockchain.

## USAGE
Install the NPM package
```bash
# Other package managers can be used such as yarn and npm.
bun i @kenolabs/aethokit
```

Then import the package and initialize it with a gasKey gotten from the aethokit dashboard(coming soon). But to test, reach out to [brite0x](https://t.me/brite0x).
```ts
import Aethokit from "@kenolabs/aethokit"

// Initalize the SDK
const aethokitClient = Aethokit({ gasKey });
```

### USAGE SENDING SOL WITH KEYPAIR
```ts
import { 
  SystemProgram,
  TransactionMessage,
  Keypair,
  ClusterApi,
  PublicKey,
  Connection,
  VersionedTransaction,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";

const senderKeypair = Keypair.generate();

const senderAmount = 1 * LAMPORTS_PER_SOL;

const fundUserIx = SystemProgram.transfer({
  fromPubkey: senderKeypair.publicKey,
  toPubkey: recieverPublicKey,
  lamports: senderAmount,
});

const gasAddress = await aethokitClient.getGasAddress();

const connection = new Connection(ClusterApi("devnet"));
const { blockhash: recentBlockHash } = await connection.getLatestBlockhash("confirmed");

const txMsg = new TransactionMessage({
  payerKey: new PublicKey(gasAddress),
  recentBlockHash,
  instructions: [fundUserIx]
}).compileToV0Message();

const transaction = new VersionedTransaction(txMsg);

// Sign tx with sender keypair
transaction.sign([senderKeypair]);

const serializedTx = Buffer.from(transaction.serialize()).toString('base64');

// Send serialized transaction to the gas tank for sponsorship
// Without private RPC or network specified
const txHash = await aethokitClient.sponsorTx({ transaction: serializedTx }); // Tx will sent to default network which is devnet with public rpc

// Wit network
const txHash = await aethokitClient.sponsorTx({ transaction: serializedTx, rpcOrNetwork: "mainnet" });

// With private RPC
const txHash = await aethokitClient.sponsorTx({ transaction: serializedTx, rpcOrNetwork: "private-rpc-url" });

console.log({ txHash });
```

### USAGE SENDING SOL WITH PRIVY
```ts
const txMsg = ...;

const transaction = new VersionedTransaction(txMsg);
const serializedMessage = Buffer.from(transaction.message.serialize()).toString('base64');

// Kindly check the privy docs to know how to get the the wallet provider - https://docs.privy.io
const provider = await privySolWallet.getProvider();
const { signature: userSignature } = await provider.request({
  method: 'signMessage',
  params: {
    message: serializedMessage
  }
});

// Add user signature to the transaction
const userSignatureBuffer = Buffer.from(userSignature, 'base64');
transaction.addSignature(new PublicKey(privySolWallet.address), userSignatureBuffer);

const serializedTransaction = Buffer.from(transaction.serialize()).toString('base64');

// Send serialized transaction to the gas tank for sponsorship
const txHash = await aethokitClient.sponsorTx({ transaction: serializedTransaction });

console.log({ txHash });
```

Other features coming soon!