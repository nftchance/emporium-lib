import { ContractTransactionResponse, Signer, TypedDataDomain } from 'ethers'

import { TypedDataToPrimitiveTypes } from 'abitype'

import { PRIMARY_TYPES } from '../lib/constants'

type PrimaryTypes<
	TPrimaryTypes extends typeof PRIMARY_TYPES = typeof PRIMARY_TYPES
> = typeof PRIMARY_TYPES extends TPrimaryTypes ? typeof PRIMARY_TYPES : never

type PrimaryType<TPrimaryTypes extends PrimaryTypes> =
	keyof TPrimaryTypes extends string ? keyof TPrimaryTypes : never

type PrimaryTypeStructs = {
	[K in keyof PrimaryTypes]: TypedDataToPrimitiveTypes<PrimaryTypes[K]>
}

type PrimaryTypeToStruct<
	TPrimaryTypes extends PrimaryTypes,
	TPrimaryType extends PrimaryType<TPrimaryTypes>
> = {
	[K in TPrimaryType]: K extends keyof PrimaryTypeStructs
		? K extends keyof PrimaryTypeStructs[K]
			? PrimaryTypeStructs[K][K]
			: never
		: never
}[TPrimaryType]

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
		version = '0.0.0',
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
		signer
		primaryType
		intent

		throw new Error('Not implemented')

		// if (!this.info) throw new Error('Contract info not initialized')
		// const signedIntent = await new Intent(
		// 	signer,
		// 	this.info.domain,
		// 	this.info.types[primaryType],
		// 	primaryType,
		// 	intent
		// ).init()
		// this.signedIntents.push(signedIntent)
		// return signedIntent
	}
}
