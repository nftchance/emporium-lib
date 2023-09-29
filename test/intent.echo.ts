import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'

import { expect } from 'chai'

import { deploy } from '../lib/functions/deploy'

describe('Delegatable', function () {
	it('pass: call echo', async function () {
		const { contract, notOwner } = await loadFixture(deploy)

		expect(await contract.connect(notOwner).echo())
			.to.emit(contract, 'Echo')
			.withArgs(notOwner.address)
	})
})
