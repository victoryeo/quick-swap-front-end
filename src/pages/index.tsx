import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useConnectWallet } from '@web3-onboard/react'
import { ethers } from 'ethers'
import { useDispatch, useSelector } from "react-redux"; 
import styles from '../styles/Home.module.css';
import { ButtonEx } from "../components/ButtonEx/ButtonEx";
import { setUserAddress } from '../redux/reducers/user';
import { rootActions } from "../redux/reducers";
import Tabs from "../components/Navigator/Tabs"
import Layout from "../components/Navigator/Layout"
import { selectGnosisPlock, selectGoerliPlock } from "../redux/selectors/user";

interface Account {
  address: string;
  balance: Record<string, string>;
}

export default function Home() {
  const dispatch = useDispatch()
  const gnosisPlock = useSelector(selectGnosisPlock);
  const goerliPlock = useSelector(selectGoerliPlock);

  const [account, setAccount] = useState<Account | null>(null);
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  
  useEffect(() => {
    console.log("account", wallet?.accounts[0])
    if (wallet?.provider) {
      const signer = ethersProvider.getSigner()
      console.log("signer", signer)
      dispatch(setUserAddress(wallet.accounts[0].address))
      dispatch(rootActions.setWeb3Provider(ethersProvider))
      dispatch(rootActions.setReduxSigner(signer))
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
    if (goerliPlock == true && gnosisPlock == true) {
      alert("Swap starts")
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