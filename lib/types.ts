import { TypedDataToPrimitiveTypes } from 'abitype'

import { PRIMARY_TYPES } from './constants'

export type PrimaryTypes<
	TPrimaryTypes extends typeof PRIMARY_TYPES = typeof PRIMARY_TYPES
> = typeof PRIMARY_TYPES extends TPrimaryTypes ? typeof PRIMARY_TYPES : never

export type PrimaryType<TPrimaryTypes = PrimaryTypes> =
	keyof TPrimaryTypes extends string ? keyof TPrimaryTypes : never

export type PrimaryTypeStructs = {
	[K in keyof PrimaryTypes]: TypedDataToPrimitiveTypes<PrimaryTypes[K]>
}

export type PrimaryTypeToStruct<
	TPrimaryTypes extends PrimaryTypes,
	TPrimaryType extends PrimaryType<TPrimaryTypes>
> = {
	[K in TPrimaryType]: K extends keyof PrimaryTypeStructs
		? K extends keyof PrimaryTypeStructs[K]
			? PrimaryTypeStructs[K][K]
			: PrimaryTypeStructs[K]
		: never
}[TPrimaryType] extends infer T
	? { [K in keyof T]: T[K] }
	: never

    
