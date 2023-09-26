import {
	recoverAddress,
	Signer,
	TypedDataDomain,
	TypedDataEncoder,
	TypedDataField
} from 'ethers'

import { EIP712_TYPES } from './delegatable'
import {
	Delegation,
	Invocations,
	SignedDelegation,
	SignedInvocation
} from './types'

export class SignedIntent<TIntent extends Delegation | Invocations> {
	encoder: TypedDataEncoder
	signedMessage: SignedDelegation | SignedInvocation | null = null

	constructor(
		public readonly signer: Signer,
		public readonly domain: TypedDataDomain,
		public readonly primaryType: string,
		public readonly message: TIntent extends Delegation
			? Delegation
			: Invocations,
		public readonly types: Record<
			string,
			Array<TypedDataField>
		> = EIP712_TYPES
	) {
		this.encoder = new TypedDataEncoder(this.types)

		this.signer = signer
		this.domain = domain
		this.primaryType = primaryType
		this.types = types
		this.message = message
	}

	async init(signature: string | undefined = undefined) {
		const base = {
			signature: signature
				? signature
				: await this.signer.signTypedData(
						this.domain,
						this.types,
						this.message
				  ),
			signerIsContract: false
		}

		if (this.primaryType === 'Delegation') {
			this.signedMessage = {
				delegation: this.message,
				...base
			} as SignedDelegation
		} else {
			this.signedMessage = {
				invocations: this.message,
				...base
			} as SignedInvocation
		}

		return this
	}

	hash() {
		if (!this.signedMessage) throw new Error('Signature not initialized')

		return this.encoder.hash(this.signedMessage)
	}

	address() {
		if (!this.signedMessage) throw new Error('Signature not initialized')

		const digest = this.encoder.hashStruct(this.primaryType, this.message)

		return recoverAddress(digest, this.signedMessage.signature)
	}
}
