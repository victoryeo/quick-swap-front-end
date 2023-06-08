import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useConnectWallet } from '@web3-onboard/react'
import { ethers } from 'ethers'
import { useDispatch, useSelector } from "react-redux"; 
import styles from '../styles/Home.module.css';
import { ButtonEx } from "../components/ButtonEx/ButtonEx";
import { setUserAddress, setGnosisUserAddress, setGoerliUserAddress } from '../redux/reducers/user';
import { rootActions } from "../redux/reducers";
import Tabs from "../components/Navigator/Tabs"
import Layout from "../components/Navigator/Layout"
import { selectGnosisPlock, selectGoerliPlock } from "../redux/selectors/user";
import { principallock_abi } from "@/config/abi/PrincipalLock";
import { selectSigner } from "../redux/selectors";
import contracts from '../config/constants/contracts'

interface Account {
  address: string;
  balance: Record<string, string>;
}

export default function Home() {
  const dispatch = useDispatch()
  const signer = useSelector(selectSigner);
  const gnosisPlock = useSelector(selectGnosisPlock);
  const goerliPlock = useSelector(selectGoerliPlock);

  const [account, setAccount] = useState<Account | null>(null);
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  
  useEffect(() => {
    const setChain = async () => {
      const { chainId } = await signer.provider.getNetwork()
      if (chainId === 5) {
        dispatch(setGoerliUserAddress(wallet?.accounts[0].address))
      }
      if (chainId === 100) {
        dispatch(setGnosisUserAddress(wallet?.accounts[0].address))
      }
    }
    console.log("account", wallet?.accounts[0])
    if (wallet?.provider) {
      const signer = ethersProvider.getSigner()
      console.log("signer", signer)
      dispatch(setUserAddress(wallet.accounts[0].address))
      dispatch(rootActions.setWeb3Provider(ethersProvider))
      dispatch(rootActions.setReduxSigner(signer))
      setChain();
      setAccount({
        address: wallet.accounts[0].address,
        balance: wallet.accounts[0].balance
      })
    } else {
      dispatch(setUserAddress(""))
      setAccount({
        address: "",
        balance: null
      })
    }
  }, [wallet])

  const handleSwap = async () => {
    console.log(goerliPlock, gnosisPlock)
    if (goerliPlock && gnosisPlock) {
      alert("Swap starts")
      console.log("signer", signer)
      console.log(wallet!.accounts[0].address)
      const { chainId } = await signer.provider.getNetwork()
      console.log("chainId", chainId)
      if (chainId === 5) {
        console.log("withdraw from goerli")
        const plockContractGoerli = new ethers.Contract(contracts.PRINCIPAL_LOCK[5], principallock_abi, signer)
        //const plockContractGoerliUser = plockContractGoerli.connect(wallet!.accounts[0].address)
        await plockContractGoerli.withdraw();
      } else {
        console.log("withdraw from gnosis")
        const plockContractGnosis = new ethers.Contract(contracts.PRINCIPAL_LOCK[100], principallock_abi, signer)
        //const plockContractGnosisUser = plockContractGnosis.connect(wallet!.accounts[0].address)
        await plockContractGnosis.withdraw();
      }
    } else {
      alert("You must deploy griefing and principal lock on both chains before swapping assets")    
    }
  }

  // create an ethers provider
  let ethersProvider: any

  if (wallet) {
    ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
  }

  if (wallet?.provider) {
    return (
      <div className={styles.container}>
        <Head>
          <title>Quick Swap</title>
        </Head>
        <div className={styles.connectWallet}>
          <div className={styles.wallet}>
            {account?.address}
            &nbsp;
            <ButtonEx
              onClick={() => {
                disconnect({ label: wallet.label });
              }}
              title="Disconnect"
              id="WalletDisconnect"
              bsPrefix={styles.walletBtnDisconnect}
            ></ButtonEx>
          </div>
        </div>
        <Layout>
          <Tabs />
        </Layout>
        <ButtonEx
          onClick={handleSwap}
          title="Swap"
          id="WalletSwap"
          bsPrefix={styles.walletBtnSwap}
        ></ButtonEx>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Quick Swap</title>
      </Head>
      <div className={styles.connectWallet}>
      <div className={styles.wallet}>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <ButtonEx
          disabled={connecting}
          onClick={async () => {
            await connect();
          }}
          title="Connect"
          id="WalletConnect"
          bsPrefix={styles.walletBtnConnect}
        ></ButtonEx>
        </div>
      </div>
      <Layout>
        <Tabs />
      </Layout>
    </div>
  )
}