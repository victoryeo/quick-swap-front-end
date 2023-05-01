import { ethers } from 'ethers'
import contracts from '../config/constants/contracts'


const getContract = (abi: any, address: string, signer: ethers.providers.Provider | ethers.Signer) => {
  const contract = new ethers.Contract(address, abi, signer)
  return contract
}