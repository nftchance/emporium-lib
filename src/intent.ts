import {
	AddressLike,
	Signer,
	TypedDataDomain,
	TypedDataEncoder,
	TypedDataField,
	verifyTypedData
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
	signer: Signer | null = null
	signedMessage: TSignedIntent | null = null

	constructor(
		public readonly domain: TypedDataDomain,
		public readonly types: TPrimaryTypes,
		public readonly primaryType: TPrimaryType,
		public readonly message: TIntent
	) {
		console.log(this.types)

		this.encoder = new TypedDataEncoder(
			this.types as unknown as Record<string, Array<TypedDataField>>
		)
	}

	private _primaryType() {
		return this.primaryType.toLowerCase() as Lowercase<TPrimaryType>
	}

	async init(signer: Signer | null) {
		if (this.signedMessage) return this

		this.signer = signer

		if (!this.signer) throw new Error('Signer not initialized')

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

	address(signature?: string) {
		if (signature === undefined) signature = this.signedMessage?.signature

		if (signature === undefined)
			throw new Error('Signature not initialized')

		return verifyTypedData(
			this.domain,
			this.types as unknown as Record<string, Array<TypedDataField>>,
			this.message,
			signature
		)
	}

	verify(address: AddressLike | `0x${string}`) {
		return this.address() === address
	}

	hash(message?: TIntent) {
		if (message === undefined) message = this.message

		if (message === undefined) throw new Error('Message not initialized')

		return TypedDataEncoder.hash(
			this.domain,
			this.types as unknown as Record<string, Array<TypedDataField>>,
			message
		)
	}
}
