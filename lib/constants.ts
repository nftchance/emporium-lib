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
