import { AddressLike, TypedDataDomain } from 'ethers'

import { EIP712_TYPES } from '../lib/constants'
import { Intent } from './intent'

export type TypedIntent = {
	domain: TypedDataDomain
	types: Record<
		keyof typeof EIP712_TYPES,
		{
			name: string
			type: string
		}[]
	>
}

export type Delegation = {
	delegate: string
	authority: string
	caveats: Array<{
		enforcer: AddressLike
		terms: string
	}>
}

export type Invocation = {
	transaction: {
		to: AddressLike
		gasLimit: string
		data: string
	}
	authority: Array<SignedDelegation>
}

export type Invocations = {
	replayProtection: {
		nonce: string
		queue: string
	}
	batch: Array<Invocation>
}

/**
 * Enables an Ethereum account to delegate execution permissions to another
 * Ethereum account in accordance with the Authority and Caveat terms
 * specified in the Delegation message.
 */
export type SignedDelegation = NonNullable<
	Intent<'Delegation', Delegation>['signedMessage']
>

/**
 * Enables an Ethereum account to invoke a batch of transactions in accordance
 * with the Authority and Caveat terms specified in the Invocations message.
 */
export type SignedInvocations = NonNullable<
	Intent<'Invocations', Invocations>['signedMessage']
>
