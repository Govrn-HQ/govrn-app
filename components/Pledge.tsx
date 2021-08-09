import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Pledge.module.css'

interface IPledgeProps {
  setAmount: Function;
  setShares: Function;
  donateAction: Function;
  data: any;
}

const Pledge: React.FC<IPledgeProps> = ({ setAmount, setShares, donateAction, data }) => {
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
            <p><b>Total Donated:</b> $</p>
            <p><b>Total Donors:</b></p>
          </div>
          <div>
            <p><b>Your Donation:</b> $</p>
            <p><b>Your Votes:</b></p>
          </div>
        </div>
        <div className={`${styles.actionForm} ${styles.float_left}`}>
          <h6>Invest in Outcome</h6>
          <p>Invest in the outcome and receive voting shares at a 10/1 ratio.</p>
          <input type="number" placeholder="Amount (DAI)" onChange={(e) => setAmount(e.target.value)} />
          <button onClick={donateAction}>Donate</button>
        </div>
        <div className={`${styles.actionForm} ${styles.float_right}`}>
          <h6>Withdraw Investment</h6>
          <p>Trade back your voting shares for your original investment minus existing distributions.</p>
          <input type="number" placeholder="Shares" onChange={(e) => setShares(e.target.value)} />
          <button>Ragequit</button> 
        </div>
      </div>
    </div>
  );
}
export default Pledge;
