import ReactMarkdown from 'react-markdown'
import { ethers, BigNumber } from 'ethers'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Pledge.module.css'

interface IPledgeProps {
  actions: any;
  data: any;
  graphData: any;
  stateVars: any;
}

const Pledge: React.FC<IPledgeProps> = ({ actions, data, graphData, stateVars }) => {
  let yourDonation, yourVotes;
  yourDonation = yourVotes = 0;
  const id = data.contract_id.toLowerCase()+'-member-'+'0xf3cd37071a7c1e69e0036d077982d12794f85742';
  const moloches = graphData['moloches'][0];
  const members = moloches['members'];
  const totalDonated = moloches['totalLoot'];
  const totalDonors = moloches['members'].length;

  members.forEach((member: any) => {
    let compareId = member['id'];
    if (compareId === id) {
      yourDonation = ethers.utils.formatEther(member['tokenTribute']);
      yourVotes = member['loot'];
    }
  });

  return (
    <div className={styles.pledge}>
      <div className={styles.imgDiv}>
        <p>{data.obd_status.toUpperCase()} FOR OBD</p>
        <div className={styles.img}>
          <Image src='/web3devs.svg' width={170} height={170} alt='web3 developers' />
        </div>
        <span className={styles.gtc}>{data.community_badge}</span>
        <span className={styles.gvrn}>{data.topic_badge}</span> 
      </div>
      <div className={styles.descDiv}>
        <h2>{data.display_name}</h2>
        <ReactMarkdown className={styles.description}>{data.description}</ReactMarkdown>
        <div className={styles.donation}>
          <div>
            <p><b>Total Donated:</b> ${totalDonated}</p>
            <p><b>Total Donors:</b> {totalDonors}</p>
          </div>
          <div>
            <p><b>Your Donation:</b> ${yourDonation}</p>
            <p><b>Your Votes:</b> {yourVotes}</p>
          </div>
        </div>
        <div className={`${styles.actionForm} ${styles.float_left}`}>
          <h6>Invest in Outcome</h6>
          <p>Invest in the outcome and receive voting shares at a 10/1 ratio.</p>
          <input type="number" placeholder="Amount (DAI)" onChange={(e) => actions.setAmount(e.target.value)} disabled={!stateVars.connected}/>
          <button onClick={actions.donate} disabled={!stateVars.connected}>Donate</button>
        </div>
        <div className={`${styles.actionForm} ${styles.float_right}`}>
          <h6>Withdraw Investment</h6>
          <p>Trade back your voting shares for your original investment minus existing distributions.</p>
          <input type="number" placeholder="Shares" onChange={(e) => actions.setShares(e.target.value)} disabled={!stateVars.connected}/>
          <button disabled={!stateVars.connected}>Ragequit</button> 
        </div>
      </div>
    </div>
  );
}
export default Pledge;
