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

	/**
	 * Returns the primary type of the intent message formatted as a
	 * lowercase string to be used in the signed intent body.
	 *
	 * @returns The primary type of the intent message.
	 */
	private _primaryType() {
		// ! Have to use `as` here because Typescript doesn't support infering
		//   the type from a dynamic to literal type.
		return this.primaryType.toLowerCase() as Lowercase<TPrimaryType>
	}

	/**
	 * Initializes the signed intent with a signature.
	 *
	 * @param signature The signature to use for the signed intent.
	 * If not provided, the signer will be used to sign the intent message.
	 * @returns The initialized signed intent.
	 */
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
}
