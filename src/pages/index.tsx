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

const GOERLI_CHAIN = 5
const GNOSIS_CHAIN = 100
const CHIADO_CHAIN = 10200

export default function Home() {
  const dispatch = useDispatch()
  const signer = useSelector(selectSigner);
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
      signer.provider.getNetwork().then((response: any)=>{
        console.log(response.chainId)
        if (response.chainId === GOERLI_CHAIN) {
          dispatch(setGoerliUserAddress(wallet.accounts[0].address))
          localStorage.setItem('goerliUserAddress', JSON.stringify(wallet.accounts[0].address));
          let opts = {
            type: "goerli",
            address: JSON.stringify(wallet.accounts[0].address),
          }
          // store the goerli user address in backend
          fetch("http://localhost:9090/address/", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(opts)
          }).then((res: any) =>{
            console.log(res)
            if (res.status >= 200 && res.status <= 299) {
              res.json().then((resjson:any)=>console.log(resjson))
            } else {
              // Handle errors
              console.log(res.status, res.statusText);
            }
          })
        }
        if (response.chainId === CHIADO_CHAIN) {
          dispatch(setGnosisUserAddress(wallet.accounts[0].address))
          localStorage.setItem('gnosisUserAddress', JSON.stringify(wallet.accounts[0].address));
          let opts = {
            type: "gnosis",
            address: JSON.stringify(wallet.accounts[0].address),
          }
          // store the chiado user address in backend
          fetch("http://localhost:9090/address/", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(opts)
          }).then((res: any) =>{
            console.log(res)
            if (res.status >= 200 && res.status <= 299) {
              res.json().then((resjson:any)=>console.log(resjson))
            } else {
              // Handle errors
              console.log(res.status, res.statusText);
            }
          })
        }
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
    if (1) {
      alert("Swap starts")
      console.log("signer", signer)
      console.log(wallet!.accounts[0].address)
      const { chainId } = await signer.provider.getNetwork()
      console.log("chainId", chainId)
      if (chainId === GOERLI_CHAIN) {
        if (goerliPlock) {
          console.log("withdraw from goerli")
          const plockContractGoerli = new ethers.Contract(contracts.PRINCIPAL_LOCK[GOERLI_CHAIN], principallock_abi, signer)
          //const plockContractGoerliUser = plockContractGoerli.connect(wallet!.accounts[0].address)
          await plockContractGoerli.withdraw();
          alert("withdrawal completed")
        } else {
          alert("Principal lock not deployed")
        }
      } else {
        if (gnosisPlock) {
          console.log("withdraw from gnosis")
          const plockContractGnosis = new ethers.Contract(contracts.PRINCIPAL_LOCK[CHIADO_CHAIN], principallock_abi, signer)
          //const plockContractGnosisUser = plockContractGnosis.connect(wallet!.accounts[0].address)
          await plockContractGnosis.withdraw();
          alert("withdrawal completed")
        } else {
          alert("Principal lock not deployed")
        }
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