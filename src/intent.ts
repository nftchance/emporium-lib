import { Signer, TypedDataDomain } from 'ethers'

import { TypedDataToPrimitiveTypes } from 'abitype'

import { PrimaryType, PrimaryTypes } from '../lib/types'

/**
 * The base executable body of a signed intent message.
 *
 * @template TPrimaryType The type of the primary type of the intent message.
 * @template TIntent The type of the intent message.
 */
export type BaseSignedIntent<
	TPrimaryType extends string,
	TIntent extends Record<string, unknown>
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
 * @template TPrimaryTypes All of the available primary types of the intent message.
 * @template TPrimaryType Key of the primary type of the intent message.
 * @template TIntent The type of the intent message.
 * @template TSignedIntent The type of the signed intent message.
 */
export class Intent<
	TPrimaryTypes extends PrimaryTypes[keyof PrimaryTypes],
	TPrimaryType extends PrimaryType<PrimaryTypes>,
	TIntent extends TypedDataToPrimitiveTypes<TPrimaryTypes>[TPrimaryType],
	TSignedIntent extends BaseSignedIntent<TPrimaryType, TIntent>
> {
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
		// if (signature === undefined)
		// 	signature = await this.signer.signTypedData(
		// 		this.domain,
		// 		this.types,
		// 		this.message
		// 	)
		// if (this.signedMessage === null)
		// 	this.signedMessage = {
		// 		[this._primaryType()]: this.message,
		// 		signature,
		// 		signerIsContract: false
		// 	} as TSignedIntent
		return this
	}
}
