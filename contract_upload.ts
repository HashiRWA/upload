import fs from "fs";
import { SigningCosmWasmClient, SigningCosmWasmClientOptions } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { DirectSecp256k1HdWallet, makeCosmoshubPath } from "@cosmjs/proto-signing";
import { HdPath } from "@cosmjs/crypto";
import path from "path";
import { calculateFee, StdFee} from "@cosmjs/stargate"

interface Options {
  readonly httpUrl: string
  readonly networkId: string
  readonly feeToken: string
  readonly bech32prefix: string
  readonly hdPath: HdPath
  readonly faucetUrl?: string
  readonly defaultKeyFile: string,
  readonly fees: {
	upload: number,
	init: number,
	exec: number
  },
  readonly gasPrice: GasPrice,
}

const mantraOptions: Options = {
  httpUrl: 'https://rpc.hongbai.mantrachain.io:443',
  networkId: 'mantra-hongbai-1',
  bech32prefix: 'mantra',
  feeToken: 'uom',
  faucetUrl: 'https://faucet.hongbai.mantrachain.io',
  hdPath: makeCosmoshubPath(0),
  defaultKeyFile: path.join(process.env.HOME, ".mantra.key"),
  fees: {
	upload: 5000000,
	init: 1000000,
	exec: 500000,
  },
  gasPrice: GasPrice.fromString("0.01uom"),
}

interface Network {
  setup: (password: string, filename?: string) => Promise<[string, SigningCosmWasmClient]>
  recoverMnemonic: (password: string, filename?: string) => Promise<string>
}

const initOptions = (options: Options): Network => {

  const loadOrCreateWallet = async (options: Options, filename: string, password: string): Promise<DirectSecp256k1HdWallet> => {
	const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
		"average legal choose solve apology flat above clutch east forest total control"
	  , {hdPaths: [options.hdPath], prefix: options.bech32prefix,});

	const encrypted = await wallet.serialize(password);
	fs.writeFileSync(filename, encrypted, 'utf8');
	return wallet;
  };

  const connect = async (
	wallet: DirectSecp256k1HdWallet,
	options: Options
  ): Promise<SigningCosmWasmClient> => {
	const clientOptions = {
	  prefix: options.bech32prefix,
	  gasPrice: options.gasPrice
	} as SigningCosmWasmClientOptions
	return await SigningCosmWasmClient.connectWithSigner(options.httpUrl, wallet, clientOptions)
  };

  const setup = async (password: string, filename?: string): Promise<[string, SigningCosmWasmClient]> => {
	const keyfile = filename || options.defaultKeyFile;
	const wallet = await loadOrCreateWallet(options, keyfile, password);
	const client = await connect(wallet, options);

	const [account] = await wallet.getAccounts();
	console.log("Address" ,account.address)
	return [account.address, client];
  }

  const recoverMnemonic = async (password: string, filename?: string): Promise<string> => {
	const keyfile = filename || options.defaultKeyFile;
	const wallet = await loadOrCreateWallet(options, keyfile, password);
	return wallet.mnemonic;
  }

  return {setup, recoverMnemonic};

}


const useUpload = async (
	wasm_path:string
) => {

	const [addr, client] = await initOptions(mantraOptions).setup("password");

	const wasm = fs.readFileSync(path.join(process.env.HOME, wasm_path))

	
	const uploadFee = calculateFee(
		mantraOptions.fees.upload, 
		mantraOptions.gasPrice
	)

	console.log(wasm,uploadFee)

	// need $OM tokens for this upload
	const result = await client.upload(addr, wasm, uploadFee)

	return result

}


const useVerifyCodeID = async (
	codeID:number
) => {

	const [addr, client] = await initOptions(mantraOptions).setup("password");

	const codes = await client.getCodes() 
	const hash = codes.filter((x) => x.id === codeID).map((x) => x.checksum)[0];

	return hash

}


const useInstantiate = async (
	codeId:number,
	label:string
) => {

	const [addr, client] = await initOptions(mantraOptions).setup("password");

	// Config for CW20 contract 
	const INIT = {
		name:"GOLD BOND RWA TOKEN",
		symbol:"GB-RWA",
		decimals:6,
		initial_balances:[
			{
				address:"mantra1pu3he8jq58lzc6evkyd4dj4swg69wq07k5wprr",amount:"9999999"
			}
		],
		mint:{
			minter:"mantra1pu3he8jq58lzc6evkyd4dj4swg69wq07k5wprr",
			cap: "999999999999"
		},
		marketing:{}
	}

	// need gas for this instantiation
	const instantiateResponse = await client.instantiate(
		addr, 
		codeId, 
		INIT, 
		label, 
		"auto"
	)

	return instantiateResponse
}



const useMint = async () => {
  // Setup connection and get the client
  const [addr, client] = await initOptions(mantraOptions).setup("password");

  // Define the mint message
  const mintMsg = {
    mint: {
      recipient: "mantra1pu3he8jq58lzc6evkyd4dj4swg69wq07k5wprr",
      amount: "1000001"  
    }
  };

  // Execute the mint function
  const result = await client.execute(
    addr, 
    "mantra1v2cepavet0vwe3s8phg5sqvnhl9hrddsu4wv870httrdls0ky69qm6j5ng",  
    mintMsg, 
    "auto",  
    ""
  );

  // Print the response
  console.log("Mint response:", result);
  return result;
}


//  get token info

const useGetTokenInfo = async (tokenAddress : string) => {
	// Setup connection and get the client
	const [addr, client] = await initOptions(mantraOptions).setup("password");

	// Define the mint message
	const tokenInfo = await client.queryContractSmart(
		tokenAddress,
		{token_info:{}}
	);

	// Print the response
	console.log("Token Info:", tokenInfo);
	return tokenInfo;
}

