import React, { useEffect, useState } from "react";
import styles from "./Goerli.module.css";
import Image from 'next/image';
import { useSelector, useDispatch } from "react-redux";
import { ethers } from 'ethers';
import goerli from '../../../public/eth.png';
import { griefinglock_abi } from "@/config/abi/GriefingLock";
import { griefinglock_bytecode } from "@/config/bytecode/GriefingLock";
import { principallock_abi } from "@/config/abi/PrincipalLock";
import { principallock_bytecode } from "@/config/bytecode/PrincipalLock";
import contracts from '../../config/constants/contracts'
import { selectSigner } from "../../redux/selectors";
import { selectUserAddress, selectGnosisUserAddress } from "../../redux/selectors/user";
import { setGoerliPrincipalLock } from '../../redux/reducers/user';

const GOERLI_CHAIN = 5

export default function Goerli() {
  const [griefingLockDeployed, setGriefingLockDeployed] = useState<boolean>(false);
  const signer = useSelector(selectSigner);
  const userAddress = useSelector(selectUserAddress);
  const gnosisUserAddress = useSelector(selectGnosisUserAddress);
  let glockContract: ethers.Contract;
  const [glockContractS, setGlockContractS] = useState<ethers.Contract>();
  const dispatch = useDispatch()

  const handleGriefingLock = async () => {
    console.log(signer)
    console.log(gnosisUserAddress)
    console.log(JSON.parse(localStorage.getItem('gnosisUserAddress')));
    console.log(JSON.parse(localStorage.getItem('goerliUserAddress')));
    if (contracts.GRIEFING_LOCK[GOERLI_CHAIN] === '') {
      console.log("deploying griefing contract")
      const glockContractFactory = new ethers.ContractFactory(
        griefinglock_abi, griefinglock_bytecode, signer);
      let args: any[] = []
      args[0] = gnosisUserAddress     // quick swap recipient address
      args[1] = 200             // time gap
      glockContract = await glockContractFactory.deploy(...args);
      await glockContract.deployed();
      console.log(glockContract.address)   //tested and working
            //0x86679C11F03c249fe43b6b5c817128eC087BdBD1
      setGlockContractS(glockContract)
    } else {
      console.log("griefing contract is deployed")
      glockContract = new ethers.Contract(contracts.GRIEFING_LOCK[GOERLI_CHAIN], 
        griefinglock_abi, signer)
      console.log(glockContract.address)
      setGlockContractS(glockContract)
    }
    setGriefingLockDeployed(true);      
  };

  const handlePrincipalLock = async () => {
    console.log(signer)
    console.log(userAddress)
    console.log(glockContractS)

    let exchangeAmount = 2
    if (contracts.PRINCIPAL_LOCK[GOERLI_CHAIN] === '') {
      console.log("deploying principal contract")
      const plockContract = await glockContractS!.deployPrincipalLock({value:exchangeAmount})
      const res = await plockContract.wait()
      let principalLockAddress = res.events[1]?.args.principalAddress;
      console.log(plockContract) 
      console.log(principalLockAddress)
    } else {
      console.log("principal contract is deployed")
      const plockContract = new ethers.Contract(contracts.PRINCIPAL_LOCK[GOERLI_CHAIN], principallock_abi, signer)
      console.log(plockContract.address)
      //await plockContract.funding(exchangeAmount);
    }
    dispatch(setGoerliPrincipalLock(true));
  };

  useEffect(() => {
    const setChain = async () => {
      if (signer != null) {
        console.log(signer.provider)
        const chainId = await signer.provider.getNetwork()
        console.log("chainId", chainId)
        if (chainId != GOERLI_CHAIN) {
          try {
            const { ethereum } = window;
            await ethereum.request({
                method:'wallet_switchEthereumChain',
                params: [{chainId: "0x5"}]
            });
            console.log(`switched to chainid : 0x5 succesfully`);
          } catch(err) {
            console.log(`error occured while switching chain to chainId 5, err: ${err}`);
          }
        }
      }
    }
    setChain(); //switch the blockchain
  }, []);

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
            onClick={handlePrincipalLock}>            
            Deploy Principal Lock
          </button>
      </div>
    </div>
  )
}