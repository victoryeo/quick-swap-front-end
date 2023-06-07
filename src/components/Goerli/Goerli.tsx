import React, { useEffect, useState } from "react";
import styles from "./Goerli.module.css";
import Image from 'next/image';
import { useSelector } from "react-redux";
import { ethers } from 'ethers';
import goerli from '../../../public/eth.png';
import { griefinglock_abi } from "@/config/abi/GriefingLock";
import { griefinglock_bytecode } from "@/config/bytecode/GriefingLock";
import { principallock_abi } from "@/config/abi/PrincipalLock";
import { principallock_bytecode } from "@/config/bytecode/PrincipalLock";
import contracts from '../../config/constants/contracts'
import { selectSigner } from "../../redux/selectors";
import { selectUserAddress } from "../../redux/selectors/user";

export default function Goerli() {
  const [griefingLockDeployed, setGriefingLockDeployed] = useState<boolean>(false);
  const signer = useSelector(selectSigner);
  const userAddress = useSelector(selectUserAddress);
  let glockContract: ethers.Contract;

  const handleGriefingLock = async () => {
    console.log(signer)
    console.log(userAddress)
    if (contracts.GRIEFING_LOCK[5] === '') {
      console.log("deploying griefing contract")
      const glockContractFactory = new ethers.ContractFactory(
        griefinglock_abi, griefinglock_bytecode, signer);
      let args: any[] = []
      args[0] = userAddress     // quick swap recipient address
      args[1] = 200             // time gap
      glockContract = await glockContractFactory.deploy(...args);
      await glockContract.deployed();
      console.log(glockContract.address)   //tested and working
            //0x86679C11F03c249fe43b6b5c817128eC087BdBD1
    } else {
      console.log("griefing contract is deployed")
      glockContract = new ethers.Contract(contracts.GRIEFING_LOCK[5], 
        griefinglock_abi, signer)
      console.log(glockContract.address)
    }
    setGriefingLockDeployed(true);      
  };

  const handlePrincipalLock = async () => {
    console.log(signer)
    console.log(userAddress)
    //const plockContractFactory = new ethers.ContractFactory(principallock_abi, principallock_bytecode, signer);
    let exchangeAmount = 2
    await glockContract.deployPrincipalLock({value:exchangeAmount})
  };

  return(
    <div className={styles.container}>
      <div className='flex flex-col items-center pt-4 bg-[#1c589d] max-h-full w-full mb-5'>
          <div className='transition hover:rotate-180 transition-duration:100ms ease-in-out scale-75'>
            <Image
                src={goerli}
                alt=""
                width={180}
                height={150}
            />
          </div>
          <h2 className="text-3xl font-bold mb-5 text-[#ada6c1]">
            Goerli Contract
          </h2>
          <button className={styles.griefinglock} onClick={handleGriefingLock}>
            Deploy Griefing Lock
          </button>
      </div>
      <div>
          <button className={griefingLockDeployed === false ? styles.btnDisabled :styles.principallock}
            disabled={!griefingLockDeployed}
            onClick={handlePrincipalLock}>            Deploy Principal Lock
          </button>
      </div>
    </div>
  )
}