import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Status.module.css'

const Status = () => {
  return (
    <div className={styles.status}>
      <h3>Request for Outcome-Based Donation</h3>
      <p>This Outcome Based-Donation is in it's initial fundraising form. This means we need to crowdfund around this outcome to show it's a priority. As more money is pledged, it incentivizes experts and leaders to submit metrics or proposals to be used.<br/>Note: All donations are pledges and you <b>will be able to reclaim your pledge</b> until a metric has been voted and determined (e.g. Rage-quitable)</p>
      <div className={styles.statusMsg}>
        <div>
          <span>1</span>
          <h4>Request for<br/>Outcome-Based Donation</h4>
        </div>
        <div>
          <span>2</span>
          <h4>Proposals Submitted</h4>
        </div>
        <div>
          <span>3</span>
          <h4>Voting</h4>
        </div>
        <div>
          <span>4</span>
          <h4>In Progress</h4>
        </div>
        <div>
          <span>5</span>
          <h4>Closed</h4>
        </div>
      </div>
      <div className={styles.statusBarWrap}>
        <div className={styles.statusBar}>
        </div>
      </div>
    </div>
  );
}
export default Status;
