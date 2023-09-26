import { AddressLike, TypedDataDomain } from 'ethers'

import { EIP712_TYPES } from './delegatable'

export type ReplayProtection = {
	nonce: string
	queue: string
}

export type Transaction = {
	to: AddressLike
	gasLimit: string
	data: string
}

export type Caveat = {
	enforcer: AddressLike
	terms: string
}

export type Delegation = {
	delegate: AddressLike
	authority: string
	caveats: Caveat[]
}

export type Invocation = {
	transaction: Transaction
	authority: SignedDelegation[]
}

export type Invocations = {
	batch: Invocation[]
	replayProtection: ReplayProtection
}

export type SignedIntent = {
	signature: string
	signerIsContract: boolean
}

export type SignedInvocation = {
	invocations?: Invocations
} & SignedIntent

export type SignedDelegation = {
	delegation?: Delegation
} & SignedIntent

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
