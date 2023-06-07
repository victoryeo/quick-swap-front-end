import React, { useEffect, useState } from "react";
import styles from "./Goerli.module.css";
import Image from 'next/image';
import { useSelector } from "react-redux";
import { ethers } from 'ethers';
import goerli from '../../../public/eth.png';
import { griefinglock_abi } from "@/config/abi/GriefingLock";
import { griefinglock_bytecode } from "@/config/bytecode/GriefingLock";
import { selectSigner } from "../../redux/selectors";
import { selectUserAddress } from "../../redux/selectors/user";

export default function Goerli() {
  const [griefingLockDeployed, setGriefingLockDeployed] = useState<boolean>(false);
  const signer = useSelector(selectSigner);
  const userAddress = useSelector(selectUserAddress);

  const handleGriefingLock = async () => {
    console.log(signer)
    console.log(userAddress)
    const glockContractFactory = new ethers.ContractFactory(
      griefinglock_abi, griefinglock_bytecode, signer);
    let args: any[] = []
    args[0] = userAddress     // quick swap recipient address
    args[1] = 200             // time gap
    const contract = await glockContractFactory.deploy(...args);
    await contract.deployed();
    console.log(contract.address)   //tested and working
          //0x86679C11F03c249fe43b6b5c817128eC087BdBD1
    setGriefingLockDeployed(true);      
  };

  const handlePrincipalLock = () => {

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