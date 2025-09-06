import axios from "axios"

interface initParamsType {
  gasKey: string
}

export default class Aethokit {
	private gasKey: string;

	/**
	 * Initialize the Aethokit SDK
	 * @param {initParamsType} initParams object containing the API key
	 * @throws {Error} if the API key is not provided
	 */
	constructor(initParams: initParamsType) {
		if (!initParams.gasKey) {
			throw new Error("API Key is required to initialize the SDK");
		}

		this.gasKey = initParams.gasKey;
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
	 * @param {Object} transactionData - transaction data object
	 * @param {string} transactionData.transaction - serialized transaction
	 * @param {string} transactionData.rpcOrNetwork - optional, RPC endpoint URL or network to be used for submitting the transaction (defaults to public RPC on devnet network)
	 * @returns {Promise<string>} resolves with the transaction hash
	 */
	async sponsorTx(transactionData: {
		transaction: string;
		rpcOrNetwork?: string;
	}): Promise<string> {
		const { hash } = await this.MakeRequest(
			"sponsor-tx",
			"POST",
			transactionData
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
