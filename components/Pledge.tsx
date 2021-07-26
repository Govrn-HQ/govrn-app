import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Pledge.module.css'

const Pledge = () => {
  return (
    <div className={styles.pledge}>
      <div className={styles.imgDiv}>
        <div className={styles.img}>
          <Image src='/web3devs.svg' width={170} height={170} alt='web3 developers' />
        </div>
        <span className={styles.gtc}>Gitcoin</span>
        <span className={styles.gvrn}>Meta Governance</span> 
      </div>
      <div className={styles.descDiv}>
        <h2>Increase new web3 developers</h2>
        <p className={styles.description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.</p>
        <p className={styles.info}><b>Total Donated:</b> $</p>
        <p className={styles.info}><b>Total Donors:</b></p>
        <button className={styles.pledgeBtn}>Pledge to be a Voting Member</button>
        <button className={styles.applyBtn}>Apply to be an Outcome Leader</button>
      </div>
    </div>
  );
}
export default Pledge;
