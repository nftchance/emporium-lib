import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { ethers, network } from 'hardhat'

import { DelegatableUtil } from '../src/delegatable'
import { expect } from 'chai'

const [name, version] = ['Echo', '0.1.0']

describe('Delegatable', function () {
	async function getChainId() {
		return await network.provider.send('eth_chainId').then(BigInt)
	}

	async function deploy() {
		const chainId = await getChainId()

		const [owner, notOwner] = await ethers.getSigners()

		const contract = await (
			await ethers.getContractFactory('Echo')
		).deploy(name, version)

		const address = await contract.getAddress()

		const util = await new DelegatableUtil().init(contract, name, version)

		return { chainId, contract, address, util, owner, notOwner }
	}

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
