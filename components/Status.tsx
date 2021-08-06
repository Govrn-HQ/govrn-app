import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Status.module.css'

interface IStatusProps {
  statusData: any;
  obd_status: string;
}

const Status: React.FC<IStatusProps> = ({ statusData, obd_status }) => {
  let statusBar_width: string;
  switch(obd_status) {
    case 'Request':
      statusBar_width = 'width_10';
      break;
    case 'Proposal Submitted':
      statusBar_width = 'width_30';
      break;
    case 'Voting':
      statusBar_width = 'width_50';
      break;
    case 'In Progress':
      statusBar_width = 'width_70';
      break;
    case 'Closed':
      statusBar_width = 'width_100';
      break;
    default:
      statusBar_width = 'width_0';
      break;
  }
  return (
    <div className={styles.status}>
      <h3>{statusData.display_title}</h3>
      <p>{statusData.display_description}</p>
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
        <div className={`${styles.statusBar} ${statusBar_width}`}>
        </div>
      </div>
    </div>
  );
}
export default Status;
