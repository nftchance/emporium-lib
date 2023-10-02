import { ContractTransactionResponse, Signer, TypedDataDomain } from 'ethers'

import { PRIMARY_TYPES } from '../lib/constants'
import { PrimaryType, PrimaryTypes, PrimaryTypeToStruct } from '../lib/types'
import { Intent } from './intent'

export class DelegatableUtil<
	TContract extends {
		deploymentTransaction(): ContractTransactionResponse
		getAddress(): Promise<string>
	}
> {
	info: {
		domain: TypedDataDomain
		types: PrimaryTypes
	} | null = null

	signedIntents: Array<unknown> = []

	constructor(public readonly contract: TContract) {}

	async init(
		name: string,
		version: string,
		types = PRIMARY_TYPES as PrimaryTypes
	) {
		this.contract.getAddress().then(address => {
			this.info = {
				domain: {
					chainId: this.contract.deploymentTransaction()?.chainId,
					verifyingContract: address,
					name,
					version
				},
				types
			}
		})

		return this
	}

	async sign(
		signer: Signer,
		primaryType: PrimaryType<PrimaryTypes>,
		intent: PrimaryTypeToStruct<PrimaryTypes, keyof PrimaryTypes>
	) {
		if (!this.info) throw new Error('Contract info not initialized')

		const signedIntent = await new Intent(
			signer,
			this.info.domain,
			this.info.types[primaryType],
			primaryType,
			intent
		).init()

		this.signedIntents.push(signedIntent)

		return signedIntent
	}
}
