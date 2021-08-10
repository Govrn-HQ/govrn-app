import React from 'react'
import { ethers } from 'ethers'
import MolochArtifact from '../contracts/Moloch.json'
import WXDAIArtifact from '../contracts/WXDAI.json'
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
  public amount: number;
  public shares: number;
  public gasLimit: object;

  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };

    this.amount = 0;
    this.shares = 0;
    this.moloch = null;
    this.gasLimit = {gasLimit: 677577};

    if (typeof window !== 'undefined') {
      this.web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
        providerOptions
      });
    }
  }

  public componentDidMount() {
    if (this.web3Modal.cachedProvider) {
      this.connectWallet();
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
      const account = accounts[0];
      if (typeof account !== 'undefined') {
        await this.setState({ address: account });
        console.log(this.state.address);
      } else {
        this.web3Modal.clearCachedProvider();
        this.setState({ ...INITIAL_STATE });
      }
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

    const wxdai = new ethers.Contract(
      '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
      WXDAIArtifact,
      this.state.web3Provider.getSigner(0)
    )

    const balance = await wxdai.balanceOf(this.state.address);

    console.log ('myfinal ' + balance);

    wxdai.approve(contractAddress.Moloch, 1);

    /*try {
      const data = await this.moloch.submitProposal(
        this.state.address, 
        5,
        10,
        0,
        '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
        0,
        '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d', 
        'Submit Proposal For OBD 2',
        this.gasLimit
      );
      data.wait();
      console.log(data);
    } catch (err) {
      console.log('Error: ', err);
    }*/
  }

  /*public async withdraw() {
    if (this.moloch == null) {
      return;
    }

    await this.moloch.rageQuit();
  }*/

  public setAmount(a: string) {
    const num = parseInt(a, 10);

    if (isNaN(num) || num <= 0) {
      return;
    }

    this.amount = num;
    console.log(this.amount);
  }

  public setShares(s: string) {
    const num = parseInt(s, 10);

    if (isNaN(num) || num <= 0) {
      return;
    }

    this.shares = num;
    console.log(this.shares);
  }
 
  render() {
    const { data, statusData } = this.props;
    const { connected } = this.state;
    const donateAction = connected ? () => this.pledgeVotingMember() : () => this.connectWallet();
    const actions = {
      //connect: this.connectWallet,
      //pledge: this.pledge
      
    }
    return (
      <>
        <Header connect={() => this.connectWallet()} connected={connected} />
        <Pledge setAmount={(a: string) => this.setAmount(a)} setShares={(s: string) => this.setShares(s)} donateAction={() => donateAction()} data={data} />
        <Status statusData={statusData} obd_status={data.obd_status}/>
        <Footer />
      </>
    );
  }
}
export default App;
