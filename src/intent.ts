import {
	Signer,
	TypedDataDomain,
	TypedDataEncoder,
	TypedDataField
} from 'ethers'

import { EIP712_TYPES } from '../lib/constants'

/**
 * The base executable body of a signed intent message.
 *
 * @template TPrimaryType The type of the primary type of the intent message.
 * @template TIntent The type of the intent message.
 */
export type BaseSignedIntent<
	TPrimaryType extends string,
	TIntent = Record<string, unknown>
> = {
	[x in Lowercase<TPrimaryType>]: TIntent
} & {
	signature: string
	signerIsContract: boolean
}

/**
 * A class representing an Intent that can be signed and executed
 * by an Ethereum account with discrete permission conditions.
 *
 * @class Intent
 * @template TPrimaryType The type of the primary type of the intent message.
 * @template TIntent The type of the intent message.
 * @template TSignedIntent The type of the signed intent message.
 */
export class Intent<
	TPrimaryType extends string = string,
	TIntent extends Record<string, unknown> = Record<string, unknown>,
	TSignedIntent extends BaseSignedIntent<
		TPrimaryType,
		TIntent
	> = BaseSignedIntent<TPrimaryType, TIntent>
> {
	encoder: TypedDataEncoder
	signedMessage: TSignedIntent | null = null

	/**
	 * Creates a new instance of the `SignedIntent` class.
	 *
	 * @param signer The signer used to sign the intent message.
	 * @param domain The domain of the intent message.
	 * @param primaryType The primary type of the intent message.
	 * @param message The intent message.
	 * @param types The types used to encode the intent message.
	 */
	constructor(
		public readonly signer: Signer,
		public readonly domain: TypedDataDomain,
		public readonly primaryType: TPrimaryType,
		public readonly message: TIntent,
		public readonly types: Record<
			string,
			Array<TypedDataField>
		> = EIP712_TYPES
	) {
		this.encoder = new TypedDataEncoder(this.types)
	}

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
	async init(signature: string | undefined = undefined) {
		if (signature === undefined)
			signature = await this.signer.signTypedData(
				...[this.domain, this.types, this.message]
			)

		if (this.signedMessage === null)
			this.signedMessage = {
				[this._primaryType()]: this.message,
				signature,
				signerIsContract: false
			} as TSignedIntent
		else this.signedMessage.signature = signature

		return this
	}
}
