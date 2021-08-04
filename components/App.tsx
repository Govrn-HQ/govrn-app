import React from 'react'
import { ethers } from 'ethers'
import MolochArtifact from '../contracts/Moloch.json'
import contractAddress from '../contracts/contract-address.json'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Header from './Header'
import Pledge from './Pledge'
import Status from './Status'
import Footer from './Footer'

interface IAppState {
  provider: any;
  web3Provider: any;
  connected: boolean;
  address: string;
  chainId: number;
}

const INITIAL_STATE: IAppState = {
  provider: null,
  web3Provider: null,
  connected: false,
  address: '',
  chainId: 1
};

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "6eaaa7629e21410ea44bbda3388097fd"
    }
  }
};

class App extends React.Component<any, any> {
  // @ts-ignore
  public web3Modal: Web3Modal;
  public state: IAppState;
  public moloch: any;

  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };

    this.moloch = null;

    if (typeof window !== 'undefined') {
      this.web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: false,
        providerOptions
      });
    }
  }

  public async connectWallet() {
    const provider = await this.web3Modal.connect();
    await this.subscribeProvider(provider);
    const web3Provider: any = new ethers.providers.Web3Provider(provider);
    const address = await web3Provider.getSigner().getAddress();
    const { chainId } = await web3Provider.getNetwork();

    await this.setState({
      provider,
      web3Provider,
      connected: true,
      address,
      chainId
    });

    this.initContract();
  }

  public async subscribeProvider(provider: any) {
    if (!provider.on) {
      return;
    }
    provider.on("connect", (info: { chainId: string }) => {
      console.log(info);
    });
    provider.on("accountsChanged", async (accounts: string[]) => {
      await this.setState({ address: accounts[0] });
      console.log(this.state.address);
    });
    provider.on("chainChanged", async (chainId: string) => {
      await this.setState({ chainId: parseInt(chainId, 16) });
      console.log(this.state.chainId);
    });
    provider.on("disconnect", (error: { code: number; message: string }) => {
      console.log(error);
    });
  }

  private initContract() {
    if (!this.state.connected) {
      return;
    }

    this.moloch = new ethers.Contract(
      contractAddress.Moloch,
      MolochArtifact.abi,
      this.state.web3Provider.getSigner(0)
    );
  }

  public async pledgeVotingMember() {
    if (this.moloch == null) {
      return;
    }

    await this.moloch.submitProposal(
      this.state.address, 
      0,
      10,
      100,
      '0x6b175474e89094c44da98b954eedeac495271d0f',
      0, 
      '0x6b175474e89094c44da98b954eedeac495271d0f', 
      'all hail moloch'
    );
  }
 
  render() {
    const { connected } = this.state;
    return (
      <>
        <Header connect={() => this.connectWallet()} connected={connected} />
        <Pledge connect={() => this.connectWallet()} pledge={() => this.pledgeVotingMember()} data={this.props.data} connected={connected} />
        <Status />
        <Footer />
      </>
    );
  }
}
export default App;
