import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Header.module.css'
//import Web3ModalProvider from './hello.ts'
import { useState } from 'react'

import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider' 

const Header = () => {
  //const web3modalprovider = new Web3ModalProvider();
  const [connect, setConnect] = useState(false);
  async function connection() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "6eaaa7629e21410ea44bbda3388097fd"
        } 
      } 
    };
    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: false, // optional
      providerOptions, // required
    });
    const provider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = await web3Provider.getSigner().getAddress();
    console.log(signer);
    setConnect(!connect);
  }
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href='/'>
          <a><Image src='/govrn-logo.svg' width={125} height={50} alt='govrn logo' /></a>
        </Link>  
      </div>
      <nav>
        <Link href='/'><a className={styles.linkText}>🔮 Discover</a></Link>
        <Link href='/'><a className={styles.linkText}>🎳 Bowling Alley</a></Link>
      </nav>
      <div className={connect ? 'hide' : styles.connect}>
        <button onClick={connection}>Connect Wallet</button>
      </div>
      <div className={connect ? styles.greeting : 'hide'}>
        <Image src='/govrn-circle.png' width={35} height={35} alt='govrn circle' />
        <p>Hi, there!</p>
      </div>
    </header>
  );
}
export default Header;
