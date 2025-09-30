import axios from "axios"

export interface initParamsType {
	gasKey: string;
	rpcOrNetwork?: string;
}

export default class Aethokit {
	private gasKey: string;
	private rpcOrNetwork?: string;

	/**
	 * Initialize the Aethokit SDK
	 * @param {initParamsType} initParams object containing the GAS KEY and an optional param that takes either an rpc or a network 
	 * @throws {Error} if the GAS KEY is not provided
	 */
	constructor(initParams: initParamsType) {
		if (!initParams.gasKey) {
			throw new Error("GAS KEY is required to initialize the SDK");
		}

		this.gasKey = initParams.gasKey;
		this.rpcOrNetwork = initParams.rpcOrNetwork;
	}

	/**
	 * Retrieve the gas address for the gas tank based off the gas key
	 * @returns {Promise<string>} resolves with the gas address
	 */
	async getGasAddress(): Promise<string> {
		const { gasAddress } = await this.MakeRequest("get-gas-address", "GET");
		return gasAddress;
	}

	/**
	 * Sends a transaction to the gas tank for sponsorship
	 * @param {string} transaction - serialized transaction
	 * @returns {Promise<string>} resolves with the transaction hash
	 */
	async sponsorTx(transaction: string): Promise<string> {
		const data = {
			transaction,
			rpcOrNetwork: this.rpcOrNetwork
		}

		const { hash } = await this.MakeRequest(
			"sponsor-tx",
			"POST",
			data
		);

		return hash;
	}

	private async MakeRequest(
		path: string,
		requestMethod: string,
		body?: any
	): Promise<{ [key: string]: any }> {
		try {
			const options = {
				method: requestMethod,
				url: `https://aethokit.onrender.com/api/${path}`,
				headers: {
					accept: "application/json",
					"x-gas-key": this.gasKey,
				},
				data: body,
			};

			const { data } = await axios.request(options);

			return data;
		} catch (error) {
			throw new Error((error as Error).message);
		}
	}
}
