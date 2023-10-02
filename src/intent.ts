import { Signer, TypedDataDomain, TypedDataField } from 'ethers'

import {
	PrimaryType,
	PrimaryTypes,
	PrimaryTypeSigned,
	PrimaryTypeStruct
} from '../lib/types'

export class Intent<
	TPrimaryTypes extends PrimaryTypes[keyof PrimaryTypes],
	TPrimaryType extends PrimaryType<PrimaryTypes>,
	TIntent extends PrimaryTypeStruct<PrimaryTypes, keyof PrimaryTypes>,
	TSignedIntent extends PrimaryTypeSigned<TPrimaryType, TIntent>
> {
	signedMessage: TSignedIntent | null = null

	constructor(
		public readonly signer: Signer,
		public readonly domain: TypedDataDomain,
		public readonly types: TPrimaryTypes,
		public readonly primaryType: TPrimaryType,
		public readonly message: TIntent
	) {}

	private _primaryType() {
		return this.primaryType.toLowerCase() as Lowercase<TPrimaryType>
	}

	async init() {
		if (!this.signedMessage) return this

		const signature = await this.signer.signTypedData(
			this.domain,
			// ! Hacky way to get around using abitype with Ethers.
			this.types as unknown as Record<string, Array<TypedDataField>>,
			this.message
		)

		if (!signature) throw new Error('Signature not found')

		this.signedMessage = {
			[this._primaryType()]: this.message,
			signature,
			signerIsContract: false
		} as TSignedIntent

		return this
	}

	// TODO: Determine the address that signed the message using the base
	//       message and the signed message.
	address() {
		throw new Error('Not implemented')
	}

	// TODO: Verify whether or not an address was the signer of the message.
	verify(address: string) {
		address

		throw new Error('Not implemented')
	}

	// TODO: Return the hash of the intent message which is used for signing,
	//       verifying, quick look-up and comparison.
	hash() {
		throw new Error('Not implemented')
	}
}
