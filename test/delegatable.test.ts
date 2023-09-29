import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'

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

	it('pass: sign a delegation', async function () {
		throw new Error('Not implemented')
	})

	it('pass: sign an invocation', async function () {
		throw new Error('Not implemented')
	})

	// TODO: Add a test to make sure that we can add new EIP712 type.
})
