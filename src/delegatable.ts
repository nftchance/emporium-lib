import { ContractTransactionResponse, Signer } from 'ethers'

import { EIP712_TYPES } from '../lib/constants'
import { Delegation, Intent } from './intent'
import {
	Invocations,
	SignedDelegation,
	SignedInvocation,
	TypedIntent
} from './types'

type IntentContract = {
	deploymentTransaction(): ContractTransactionResponse
	getAddress(): Promise<string>
}
type IntentPrimaryTypes = keyof typeof EIP712_TYPES
type IntentTypes = Delegation | Invocations
type SignedIntentTypes =
	| Intent<Delegation, SignedDelegation>
	| Intent<Invocations, SignedInvocation>

export class DelegatableUtil<TContract extends IntentContract> {
	contract: TContract | null = null
	info: TypedIntent | null = null

	signedIntents: Array<SignedIntentTypes> = []

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

	async sign<TIntent extends IntentTypes>(
		primaryType: IntentPrimaryTypes,
		intent: TIntent extends Delegation
			? Delegation
			: TIntent extends Invocations
			? Invocations
			: never,
		signer: Signer
	) {
		if (!this.info) throw new Error('Contract info not initialized')

		const signedIntent = await new Intent(
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
