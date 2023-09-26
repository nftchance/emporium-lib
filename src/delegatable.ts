import { ContractTransactionResponse, Signer } from 'ethers'

import { SignedIntent } from './intent'
import { Delegation, Invocations, TypedIntent } from './types'

export const EIP712_TYPES = {
	Invocation: [
		{ name: 'transaction', type: 'Transaction' },
		{ name: 'authority', type: 'SignedDelegation[]' }
	],
	Invocations: [
		{ name: 'batch', type: 'Invocation[]' },
		{ name: 'replayProtection', type: 'ReplayProtection' }
	],
	SignedInvocation: [
		{ name: 'invocations', type: 'Invocations' },
		{ name: 'signature', type: 'bytes' },
		{ name: 'signerIsContract', type: 'bool' }
	],
	Transaction: [
		{ name: 'to', type: 'address' },
		{ name: 'gasLimit', type: 'uint256' },
		{ name: 'data', type: 'bytes' }
	],
	ReplayProtection: [
		{ name: 'nonce', type: 'uint' },
		{ name: 'queue', type: 'uint' }
	],
	Delegation: [
		{ name: 'delegate', type: 'address' },
		{ name: 'authority', type: 'bytes32' },
		{ name: 'caveats', type: 'Caveat[]' }
	],
	Caveat: [
		{ name: 'enforcer', type: 'address' },
		{ name: 'terms', type: 'bytes' }
	],
	SignedDelegation: [
		{ name: 'delegation', type: 'Delegation' },
		{ name: 'signature', type: 'bytes' },
		{ name: 'signerIsContract', type: 'bool' }
	]
}

export class DelegatableUtil<
	TContract extends {
		deploymentTransaction(): ContractTransactionResponse
		getAddress(): Promise<string>
	}
> {
	contract: TContract | null = null
	info: TypedIntent | null = null

	signedIntents: Array<SignedIntent<Delegation | Invocations>> = []

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

	async signIntent<TIntent, TPrimaryTypes extends keyof typeof EIP712_TYPES>(
		primaryType: TPrimaryTypes,
		intent: TIntent extends Delegation | Invocations ? TIntent : never,
		signer: Signer
	) {
		if (!this.info) throw new Error('Contract info not initialized')

		this.signedIntents.push(
			await new SignedIntent(
				signer,
				this.info.domain,
				primaryType,
				intent,
				this.info.types
			).init()
		)

		return this
	}

	// * There may be more functions here in the future, but for now, this is all we need.
	//
	// * If you would like to extend this class, please do so in a seperate file, and
	//   submit a pull request to the main repo.
}
