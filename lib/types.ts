import {
	DelegationStruct,
	InvocationStruct
} from '../typechain-types/contracts/Echo'

type PrimaryTypeStructs = {
	Delegation: DelegationStruct
	Invocations: InvocationStruct
}

export type PrimaryTypeToStruct<
	TPrimaryTypes,
	TPrimaryTypeStructs extends PrimaryTypeStructs = PrimaryTypeStructs
> = {
	[K in keyof TPrimaryTypes]: K extends keyof TPrimaryTypeStructs
		? TPrimaryTypeStructs[K]
		: never
}
