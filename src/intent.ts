import {
	Signer,
	TypedDataDomain,
	TypedDataEncoder,
	TypedDataField,
	verifyMessage
} from 'ethers'

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
	encoder: TypedDataEncoder
	signedMessage: TSignedIntent | null = null

	constructor(
		public readonly signer: Signer,
		public readonly domain: TypedDataDomain,
		public readonly types: TPrimaryTypes,
		public readonly primaryType: TPrimaryType,
		public readonly message: TIntent
	) {
		this.encoder = new TypedDataEncoder(
			this.types as unknown as Record<string, Array<TypedDataField>>
		)
	}

	private _primaryType() {
		return this.primaryType.toLowerCase() as Lowercase<TPrimaryType>
	}

	async init() {
		if (this.signedMessage) return this

		const signature = await this.signer.signTypedData(
			this.domain,
			// ! Hacky way to get around using abitype with Ethers.
			this.types as unknown as Record<string, Array<TypedDataField>>,
			this.message
		)

		this.signedMessage = {
			[this._primaryType()]: this.message,
			signature,
			signerIsContract: false
		} as TSignedIntent

		return this
	}

	address() {
		if (!this.signedMessage) throw new Error('Signed message not found')

		return verifyMessage(this.hash(), this.signedMessage.signature)
	}

	verify(address: string) {
		if (!this.signedMessage) throw new Error('Signed message not found')

		return this.address() === address
	}

	hash() {
		return this.encoder.encode(this.message)
	}
}
