import { ethers, network } from 'hardhat'

import { DelegatableUtil } from '../../src/delegatable'
import { getChainId } from './chain'

export const [name, version] = ['Echo', '0.1.0']

export async function deploy() {
	const chainId = await getChainId(network)

	const [owner, notOwner] = await ethers.getSigners()

	const contract = await (
		await ethers.getContractFactory('Echo')
	).deploy(name, version)

	const address = await contract.getAddress()

	const util = await new DelegatableUtil().init(contract, name, version)

	return { chainId, contract, address, util, owner, notOwner }
}