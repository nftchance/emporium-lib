import { ContractTransactionResponse, Signer, TypedDataDomain } from 'ethers'

import { PRIMARY_TYPES } from '../lib/constants'
import { PrimaryType, PrimaryTypes, PrimaryTypeStruct } from '../lib/types'
import { Intent } from './intent'

type Contract = {
	deploymentTransaction(): ContractTransactionResponse
	getAddress(): Promise<string>
}

type UtilInfo = {
	domain: TypedDataDomain
	types: PrimaryTypes
} | null

export class Framework {
	info: UtilInfo = null
	signedIntents: Array<unknown> = []

	constructor(public readonly contract: Contract) {}

	async init(
		name: string,
		version: string,
		chainId?: bigint,
		types = PRIMARY_TYPES as PrimaryTypes
	) {
		chainId = this.contract.deploymentTransaction()?.chainId

		if (!chainId) throw new Error('Chain ID not found')

		this.contract.getAddress().then(verifyingContract => {
			this.info = {
				domain: {
					chainId,
					verifyingContract,
					name,
					version
				},
				types
			}
		})

		return this
	}

	build<
		TPrimaryType extends PrimaryType<PrimaryTypes>,
		TIntent extends PrimaryTypeStruct<PrimaryTypes, TPrimaryType>
	>(primaryType: TPrimaryType, intent: TIntent) {
		if (!this.info) throw new Error('Contract info not initialized')

		return new Intent(
			this.info.domain,
			this.info.types[primaryType],
			primaryType,
			intent
		)
	}

	async sign<
		TPrimaryType extends PrimaryType<PrimaryTypes>,
		TIntent extends PrimaryTypeStruct<PrimaryTypes, TPrimaryType>
	>(signer: Signer, primaryType: TPrimaryType, intent: TIntent) {
		const signedIntent = await this.build(primaryType, intent).init(signer)

		this.signedIntents.push(signedIntent)

		return signedIntent
	}
}
