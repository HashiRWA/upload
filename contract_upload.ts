import fs from "fs";
import { SigningCosmWasmClient, SigningCosmWasmClientOptions } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { DirectSecp256k1HdWallet, makeCosmoshubPath } from "@cosmjs/proto-signing";
import { HdPath } from "@cosmjs/crypto";
import path from "path";
import { calculateFee, StdFee} from "@cosmjs/stargate"


const MNEMONIC = "average legal choose solve apology flat above clutch east forest total control"
const contractAddr = 'mantra15g85x8gnlm9k8cjj9vu6v97fps3g2lmjyg64p0usdxrnc082wwyqsu6q57'
const asset_addr = "mantra1c0wehfltspqczqmgv86nn0asf5jstld0yvqzzjtsavsn7pgzakusqa77lj"
const collateral_addr = "mantra15cxyuljght67pazn72kggeqa6ejj7f6gpeypa8yw6tzm95qr0cksq7css2"
const owner_addr = "mantra1pu3he8jq58lzc6evkyd4dj4swg69wq07k5wprr"

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
		MNEMONIC
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
	label:string
) => {

	const [addr, client] = await initOptions(mantraOptions).setup("password");

	const codeID = 202;
	// Config for Bank contract
	const INIT = {
		config: {
			name: "Final Test Pool",
			symbol: "FTP",
			maturationdate: 1720613677,  
			debtinterestrate: "15",
			strikeprice: "2",
			lendinterestrate: "6",
			overcollateralizationfactor: "2",
			asset: asset_addr,
			collateral: collateral_addr,
			lockInPeriod: "0"
			},
		oracle: owner_addr,  
		admin: owner_addr,
	}
			
	// need gas for this instantiation
	const instantiateResponse = await client.instantiate(
		addr, 
		codeID, 
		INIT, 
		label, 
		"auto"
	)

	return instantiateResponse
}

const useMutation = async () => {

	const [addr, client] = await initOptions(mantraOptions).setup("password");
	const res = await client.execute(
		addr,
		"mantra1m7wqgq02e95anl7jk2qruvtdl7afyff0d6pddr0zhqmgsvle70ls7aa2ws",
		{
			send_from:{
				owner:owner_addr,
				contract: "mantra1m7wqgq02e95anl7jk2qruvtdl7afyff0d6pddr0zhqmgsvle70ls7aa2ws",
				amount:"2000",
				msg:""
			}
		},
		"auto",
		"",
	)
	return res
}



const useFetchAllowanceAsset = async () => {
	
	const [addr, client] = await initOptions(mantraOptions).setup("password");

	const res = await client.queryContractSmart(
		asset_addr,
		{
			allowance:{
				owner: owner_addr,
				spender: contractAddr,
			}
		}
	)
	return res
}

const useGiveApprovalAsset = async () => {
	
	const [addr, client] = await initOptions(mantraOptions).setup("password");

	const res = await client.execute(
		addr,
		asset_addr,
		{
			increase_allowance:{
				spender: contractAddr,
				amount:"200000000",
			}
		},
		"auto",
		"",
	)
	return res
}

const useDeposit = async () =>{

	const [addr, client] = await initOptions(mantraOptions).setup("password");


	const args = { 
		transact:{
			deposit:{
				denom: asset_addr,
				amount : "400000000",
			}
		}
	}

	try{
		const res = await client.execute(
      addr,
			contractAddr, 
			args,
			"auto",
			"",
		)
		return {
			data:{
				res
			},
			error:undefined,
			isPending:false
		}

	}
	catch(error:unknown){
		console.error(error)
		return {error : error, isPending:false}
	}
}

const useWithdraw = async () =>{

	const [addr, client] = await initOptions(mantraOptions).setup("password");


	const args = { 
		transact:{
			withdraw:{
				denom: asset_addr,
				amount : "50000000",
			}
		}
	}

	try{
		const res = await client.execute(
      addr,
			contractAddr, 
			args,
			"auto",
			"",
		)
		return {
			data:{
				res
			},
			error:undefined,
			isPending:false
		}

	}
	catch(error:unknown){
		console.error(error)
		return {error : error, isPending:false}
	}
}



const useWithdrawInterest = async () =>{

	const [addr, client] = await initOptions(mantraOptions).setup("password");


	const args = { 
		transact:{
			withdrawInterest: {}
		}
	}

	try{
		const res = await client.execute(
      addr,
			contractAddr, 
			args,
			"auto",
			"",
		)
		return {
			data:{
				res
			},
			error:undefined,
			isPending:false
		}

	}
	catch(error:unknown){
		console.error(error)
		return {error : error, isPending:false}
	}
}





// Borrow - Loan

const useFetchAllowanceCollateral = async () => {
	
	const [addr, client] = await initOptions(mantraOptions).setup("password");

	const res = await client.queryContractSmart(
		collateral_addr,
		{
			allowance:{
				owner: owner_addr,
				spender: contractAddr,
			}
		}
	)
	return res
}

const useGiveApprovalCollateral= async () => {
	
	const [addr, client] = await initOptions(mantraOptions).setup("password");

	const res = await client.execute(
		addr,
		collateral_addr,
		{
			increase_allowance:{
				spender: contractAddr,
				amount:"200000000",
			}
		},
		"auto",
		"",
	)
	return res
}



const useQuoteLoan = async () => {
	const [addr, client] = await initOptions(mantraOptions).setup("password");

	const args = { 
			getLoanQuote:{
				amount: "5000000",
			}
	}

	try{
		const res : any = await client.queryContractSmart(
			contractAddr, 
			args
		)

		return {
			data: JSON.stringify(res),
			error:undefined,
			isPending:false
		}

	}
	catch(error:unknown){
		console.error(error)
		return {error : error, isPending:false}
	}
}

const useLoan = async () =>{
	const [addr, client] = await initOptions(mantraOptions).setup("password");

	const args = { 
		transact:{
			loan:{
				asset_denom: asset_addr,
				asset_amount : "5000000",
				collateral_denom: collateral_addr,
			}
		}
	}

	try{
		const res = await client.execute(
      addr,
			contractAddr, 
			args,
			"auto",
			"",
		)
		return {
			data:{
				res
			},
			error:undefined,
			isPending:false
		}

	}
	catch(error:unknown){
		console.error(error)
		return {error : error, isPending:false}
	}
}


// Repay 


const useFetchAllowanceAssetRepay = async () => {
	
	const [addr, client] = await initOptions(mantraOptions).setup("password");

	const res = await client.queryContractSmart(
		asset_addr,
		{
			allowance:{
				owner: owner_addr,
				spender: contractAddr,
			}
		}
	)
	return res
}

const useGiveApprovalAssetRepay= async () => {
	
	const [addr, client] = await initOptions(mantraOptions).setup("password");

	const res = await client.execute(
		addr,
		asset_addr,
		{
			increase_allowance:{
				spender: contractAddr,
				amount:"200000000",
			}
		},
		"auto",
		"",
	)
	return res
}

const useTakeApprovalAssetRepay= async () => {
	
	const [addr, client] = await initOptions(mantraOptions).setup("password");

	const res = await client.execute(
		addr,
		asset_addr,
		{
			decrease_allowance:{
				spender: contractAddr,
				amount:"200000000",
			}
		},
		"auto",
		"",
	)
	return res
}



const useQuoteRepay = async () => {
	const [addr, client] = await initOptions(mantraOptions).setup("password");

	const args = { 
			getRepayQuote:{
				user: owner_addr,
			}
	}

	try{
		const res : any = await client.queryContractSmart(
			contractAddr, 
			args
		)

		return {
			data: JSON.stringify(res),
			error:undefined,
			isPending:false
		}

	}
	catch(error:unknown){
		console.error(error)
		return {error : error, isPending:false}
	}
}


const useRepay = async () =>{
	const [addr, client] = await initOptions(mantraOptions).setup("password");

	const args = { 
		transact:{
			repay:{
				asset_denom: asset_addr,
				asset_principle: "1000000",
				collateral_denom: collateral_addr,
			}
		}
	}

	try{
		const res = await client.execute(
      addr,
			contractAddr, 
			args,
			"auto",
			"",
		)
		return {
			data:{
				res
			},
			error:undefined,
			isPending:false
		}

	}
	catch(error:unknown){
		console.error(error)
		return {error : error, isPending:false}
	}
}

const useFetchWithdrawableAndRepayablePositions = async () => {
	const [addr, client] = await initOptions(mantraOptions).setup("password");

	const res = await client.queryContractSmart(
		contractAddr,
		{
			getWithdrawableAndRepayablePositions:{
				user: owner_addr,
			}
		}
	)
	return res
}

const useGetPoolInfo = async () => {
	const [addr, client] = await initOptions(mantraOptions).setup("password");

	const res = await client.queryContractSmart(
		contractAddr,
		{
			allDetails:{
				user: owner_addr,
			}
		}
	)
	return res
}