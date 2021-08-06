import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Pledge.module.css'

interface IPledgeProps {
  connect: Function;
  pledge: Function;
  data: any;
  connected: boolean;
}

const Pledge: React.FC<IPledgeProps> = ({ connect, pledge, data, connected }) => {
  return (
    <div className={styles.pledge}>
      <div className={styles.imgDiv}>
        <div className={styles.img}>
          <Image src='/web3devs.svg' width={170} height={170} alt='web3 developers' />
        </div>
        <span className={styles.gtc}>{data.community_badge}</span>
        <span className={styles.gvrn}>{data.topic_badge}</span> 
      </div>
      <div className={styles.descDiv}>
        <h2>{data.display_name}</h2>
        <p className={styles.description}>{data.description}</p>
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
        <button onClick={connected ? () => pledge() : () => connect()} className={styles.pledgeBtn}>Pledge to be a Voting Member</button>
        <button className={styles.applyBtn}>Apply to be an Outcome Leader</button>
      </div>
    </div>
  );
}
export default Pledge;
