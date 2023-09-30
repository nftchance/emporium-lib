import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { ethers } from 'hardhat'

import { expect } from 'chai'

import { deploy, name, version } from '../lib/functions/deploy'
import { InvocationsStruct } from '../typechain-types/contracts/Echo'

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

	it('pass: getInovcationsTypedDataHash(Invocations memory invocations)', async function () {
		const { util, contract, owner, notOwner } = await loadFixture(deploy)

		const delegation = await util.sign(
			'Delegation',
			{
				delegate: await notOwner.getAddress(),
				authority: ethers.ZeroHash,
				caveats: []
			},
			owner
		)

		const signedDelegation = delegation.signedMessage

		if (!signedDelegation) throw new Error('Signed delegation is null')

		const invocation: InvocationsStruct = {
			replayProtection: {
				nonce: '0x01',
				queue: '0x00'
			},
			batch: [
				{
					authority: [signedDelegation],
					transaction: {
						to: await contract.getAddress(),
						gasLimit: 21000000000000,
						data: (await contract.echo.populateTransaction()).data
					}
				}
			]
		}

		expect(await contract.getInvocationsTypedDataHash(invocation))
	})

	it('pass: sign a delegation', async function () {
		throw new Error('Not implemented')
	})

	it('pass: sign an invocation', async function () {
		throw new Error('Not implemented')
	})

	// TODO: Add a test to make sure that we can add new EIP712 type.
})
