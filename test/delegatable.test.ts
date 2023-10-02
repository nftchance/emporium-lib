import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { ethers } from 'hardhat'

import { expect } from 'chai'

import { deploy, name, version } from '../lib/functions/deploy'

describe('Delegatable', function () {
	it('pass: instantiate a DelegatableUtil class instance', async function () {
		const { chainId, address, util } = await loadFixture(deploy)

		expect(util).to.not.be.null.and.not.be.undefined
		expect(util.signedIntents).to.be.empty
		expect(util.info).to.not.be.null

		expect(util.info?.domain).to.eql({
			chainId: chainId,
			verifyingContract: address,
			name,
			version
		})
	})

	it('pass: getDelegationTypedDataHash(Delegation memory delegation)', async function () {
		const { contract, owner } = await loadFixture(deploy)

		const typedDataHash = await contract.getDelegationTypedDataHash({
			delegate: await owner.getAddress(),
			authority: ethers.ZeroHash,
			caveats: []
		})

		// TODO: Don't hardcode this value.
		expect(typedDataHash).to.eq(
			'0xe3a9f25379d3e45d3ce21212588b262c0d73e0a3848ba7787a17707786bdc1bc'
		)
	})

	it('pass: getInvocationsTypedDataHash(Invocations memory invocations)', async function () {
		const { util, owner } = await loadFixture(deploy)

		const signedDelegation = await util.sign(owner, 'Delegation', {
			delegate: await owner.getAddress(),
			authority: ethers.ZeroHash as `0x${string}`,
			caveats: []
		})

		signedDelegation

		// if (signedDelegation.signedMessage === null)
		// 	expect.fail('Signed delegation is null')

		//     signedDelegation.signedMessage.signature

		// const invocation = {
		// 	authority: [signedDelegation.signedMessage],
		// 	transaction: {
		// 		to: await contract.getAddress(),
		// 		gasLimit: 21000000000000,
		// 		data: (await contract.echo.populateTransaction()).data
		// 	}
		// }

		// const typedDataHash = await contract.getInvocationsTypedDataHash({
		// 	replayProtection: {
		// 		nonce: '0x01',
		// 		queue: '0x00'
		// 	},
		// 	batch: [invocation]
		// })

		// expect(typedDataHash).to.eq(
		// 	'0xd08e94024222c7c56fa238e76069cabe225eb76c202d031c3fb72028001ab631'
		// )
	})

	it('pass: sign a delegation', async function () {
		throw new Error('Not implemented')
	})

	it('pass: sign an invocation', async function () {
		throw new Error('Not implemented')
	})

	// TODO: Add a test to make sure that we can add new EIP712 type.
})
