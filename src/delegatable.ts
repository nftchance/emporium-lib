import { ContractTransactionResponse, Signer } from 'ethers'

import { EIP712_TYPES } from '../lib/constants'
import { Intent } from './intent'
import { TypedIntent } from './intent.types'

export class DelegatableUtil<
	TContract extends {
		deploymentTransaction(): ContractTransactionResponse
		getAddress(): Promise<string>
	}
> {
	contract: TContract | null = null
	info: TypedIntent | null = null

	signedIntents: Array<unknown> = []

	async init(
		contract: TContract,
		name: string,
		version = '0.0.0',
		types = EIP712_TYPES
	) {
		if (this.info) return this

		this.contract = contract

		contract.getAddress().then(address => {
			this.info = {
				domain: {
					chainId: contract.deploymentTransaction()?.chainId,
					verifyingContract: address,
					name,
					version
				},
				types
			}
		})

		return this
	}

	async sign<
		TPrimaryType extends string,
		TIntent extends Record<string, unknown>
	>(primaryType: TPrimaryType, intent: TIntent, signer: Signer) {
		if (!this.info) throw new Error('Contract info not initialized')

		const signedIntent = await new Intent<TPrimaryType, TIntent>(
			signer,
			this.info.domain,
			primaryType,
			intent,
			this.info.types
		).init()

		this.signedIntents.push(signedIntent)

		return signedIntent
	}

	// * There may be more functions here in the future, but for now, this is all we need.
	//
	// * If you would like to extend this class, please do so in a seperate file, and
	//   submit a pull request to the main repo.
}
