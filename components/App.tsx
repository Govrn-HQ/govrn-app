import React from 'react'
import { ethers, BigNumber } from 'ethers'
import MolochArtifact from '../contracts/Moloch.json'
import DAIArtifact from '../contracts/DAI.json'
import WXDAIArtifact from '../contracts/WXDAI.json'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import toast, { Toaster } from 'react-hot-toast'
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
  tokenBalance: number;
}

const INITIAL_STATE: IAppState = {
  provider: null,
  web3Provider: null,
  connected: false,
  address: '',
  chainId: 1,
  tokenBalance: 0
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
  private site: string = '';
  private tokenAddress: string = '';
  private artifact: any = null;

  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };

    this.moloch = null;
    this.amount = 0;
    this.shares = 0;

    if (this.props.data.chain === '1') {
      this.site = 'https://etherscan.io/tx/';
      this.tokenAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
      this.artifact = DAIArtifact;
    } else if (this.props.data.chain === '100') {
      this.site = 'https://blockscout.com/xdai/mainnet/tx/';
      this.tokenAddress = '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d';
      this.artifact = WXDAIArtifact;
    }

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
      this.props.data.contract_id.toLowerCase(),
      MolochArtifact.abi,
      this.state.web3Provider.getSigner(0)
    );
  }

  public async donate() {
    if (this.moloch == null || this.amount === 0) {
      toast.error('Error: amount must be greater than 0', {
        duration: 2000,
        position: 'top-right',
      });
      return;
    }

    const amountBN = ethers.utils.parseEther(this.amount.toString()); 
    const approved = await this.approve(amountBN);

    if (!approved) {
      return;
    }

    try {
      const membership = await this.moloch.submitProposal(
        this.state.address, 
        0,
        Math.floor(this.amount / 10),
        amountBN,
        this.tokenAddress,
        0,
        this.tokenAddress, 
        'Pledge To OBD',
        {gasLimit: 1000000}
      );
      toast.success(<a target="_blank" rel="noreferrer" href={`${this.site}${membership.hash}`}>Success! Transaction ID: {membership.hash}</a>, {
        duration: 3500,
        position: 'top-right',
      });
    } catch (err) {
      toast.error('Error: ' + err.message, {
        duration: 2000,
        position: 'top-right',
      });
    }
  }

  public async approve(abn: BigNumber) {
    if (this.state.chainId.toString() !== this.props.data.chain) {
      toast.error('Error: please switch to the correct network', {
        duration: 2000,
        position: 'top-right',
      });
      return false;
    }

    const token = new ethers.Contract(
      this.tokenAddress,
      this.artifact,
      this.state.web3Provider.getSigner(0)
    )

    const balance = await token.balanceOf(this.state.address);
    console.log(ethers.utils.formatEther(balance));

    if (abn.gt(balance)) {
      toast.error('Error: balance is too low', {
        duration: 2000,
        position: 'top-right',
      });
      return false;
    }
    
    const allowance = await token.allowance(this.state.address, this.props.data.contract_id.toLowerCase());
    console.log(ethers.utils.formatEther(allowance));

    if (abn.gt(allowance)) {
      try {
        const approve = await token.approve(this.props.data.contract_id.toLowerCase(), abn);
        toast.success(<a target="_blank" rel="noreferrer" href={`${this.site}${approve.hash}`}>Success! Transaction ID: {approve.hash}</a>, {
        duration: 3500,
        position: 'top-right',
        });
      } catch (err) {
        toast.error('Error: ' + err.message, {
          duration: 2000,
          position: 'top-right',
        });
      }
    }

    return true;
  }

  public async withdraw() {
    if (this.moloch == null || this.shares === 0) {
      toast.error('Error: shares must be greater than 0', {
        duration: 2000,
        position: 'top-right',
      });
      return;
    }
    
    let memberShares = 0, loot = 0;
    const id = this.props.data.contract_id.toLowerCase()+'-member-'+this.state.address.toLowerCase();
    const moloches = this.props.graphData['moloches'][0];
    const members = moloches['members'];

    members.forEach((member: any) => {
      let compareId = member['id'];
      if (compareId === id) {
        memberShares = member['shares'];
        loot = member['loot'];
      }
    });

    if (this.shares > loot) {
      toast.error('Error: not enough loot shares', {
        duration: 2000,
        position: 'top-right',
      });
      return;
    }

    try {
      const ragequit = await this.moloch.ragequit(memberShares, this.shares);
      toast.success(<a target="_blank" rel="noreferrer" href={`${this.site}${ragequit.hash}`}>Success! Transaction ID: {ragequit.hash}</a>, {
        duration: 3500,
        position: 'top-right',
      });
    } catch (err) {
      toast.error('Error: ' + err.message, {
        duration: 2000,
        position: 'top-right',
      });
    }
  }

  public setAmount(a: string) {
    const num = parseInt(a, 10);

    if (isNaN(num) || num <= 0) {
      this.amount = 0;
      return;
    }

    this.amount = num;
  }

  public setShares(s: string) {
    const num = parseInt(s, 10);

    if (isNaN(num) || num <= 0) {
      this.shares = 0;
      return;
    }

    this.shares = num;
  }

  render() {
    const { data, statusData, graphData } = this.props;
    const { connected, address } = this.state;
    const actions = {
      donate: () => this.donate(),
      withdraw: () => this.withdraw(),
      setAmount: (a: string) => this.setAmount(a),
      setShares: (s: string) => this.setShares(s)
    }
    const stateVars = {
      address,
      connected
    }
    return (
      <>
        <Header connect={() => this.connectWallet()} connected={connected} />
        <Pledge
          actions={actions}
          data={data}
          graphData={graphData}
          stateVars={stateVars} 
        />
        <Toaster
          toastOptions={{
            success: {
              className:'toast',
              style: {
                background: '#E02097',
                color: 'white',
                fontWeight: 600,
                fontSize: '15px',
                padding: '15px',
                wordBreak: 'break-word',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#E02097',
              },
            },
            error: {
              style: {
                background: '#ED4337',
                color: 'white',
                fontWeight: 600,
                padding: '15px',
                wordBreak: 'break-word',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#ED4337',
              },
            },
          }}
        />
        <Status statusData={statusData} obd_status={data.obd_status}/>
        <Footer />
      </>
    );
  }
}
export default App;
