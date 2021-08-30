import ReactMarkdown from "react-markdown";
import { ethers } from "ethers";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Pledge.module.css";

interface IPledgeProps {
  actions: any;
  data: any;
  graphData: any;
  stateVars: any;
}

const Pledge: React.FC<IPledgeProps> = ({
  actions,
  data,
  graphData,
  stateVars,
}) => {
  let yourDonation = "0",
    yourVotes = 0,
    shares = 0;
  const id =
    data.contract_id.toLowerCase() +
    "-member-" +
    stateVars.address.toLowerCase();
  const moloches = graphData["moloches"][0];
  const members = moloches["members"];
  const totalShares = moloches["totalShares"];
  const totalDonated = moloches["totalLoot"];
  let tokenBalances = moloches["tokenBalances"][0]["tokenBalance"];
  const totalDonors = moloches["members"].length;
  let tokenBalanceRead = parseFloat(
    ethers.utils.formatEther(tokenBalances)
  ).toFixed(2);

  members.forEach((member: any) => {
    let compareId = member["id"];
    if (compareId === id) {
      shares = member["shares"];
      yourVotes = member["loot"];
    }
  });

  if (yourVotes > 0) {
    tokenBalances = parseFloat(
      ethers.utils.formatEther(tokenBalances)
    ).toPrecision(12);
    const interim =
      (shares + yourVotes) / (parseInt(totalShares) + parseInt(totalDonated));
    yourDonation = (interim * tokenBalances).toFixed(2);
  }

  return (
    <div className={styles.pledge}>
      <div className={styles.imgDiv}>
        <p>{data.obd_status.toUpperCase()} FOR OBD</p>
        <div className={styles.img}>
          <Image
            src={data.image[0].url}
            width={170}
            height={170}
            alt="web3 developers"
          />
        </div>
        <span className={styles.gtc}>{data.community_badge}</span>
        <span className={styles.gvrn}>{data.topic_badge}</span>
      </div>
      <div className={styles.descDiv}>
        <h2>{data.display_name}</h2>
        <ReactMarkdown className={styles.description}>
          {data.description}
        </ReactMarkdown>
        <div className={styles.donation}>
          <div>
            <p>
              <b>Total Donated:</b> ${tokenBalanceRead}
            </p>
            <p>
              <b>Total Donors:</b> {totalDonors}
            </p>
          </div>
          <div>
            <p>
              <b>Your Donation:</b> ${yourDonation}
            </p>
            <p>
              <b>Your Votes:</b> {yourVotes}
            </p>
          </div>
        </div>
        <div className={`${styles.actionForm} ${styles.float_left}`}>
          <h6>Invest in Outcome</h6>
          <p>
            Invest in the outcome and receive voting shares at a 10/1 ratio.
          </p>
          <input
            type="number"
            placeholder="Amount (DAI)"
            onChange={(e) => actions.setAmount(e.target.value)}
            disabled={!stateVars.connected}
          />
          <button onClick={actions.donate} disabled={!stateVars.connected}>
            Donate
          </button>
        </div>
        <div className={`${styles.actionForm} ${styles.float_right}`}>
          <h6>Withdraw Investment</h6>
          <p>
            Trade back your voting shares for your original investment minus
            existing distributions.
          </p>
          <input
            type="number"
            placeholder="Shares"
            onChange={(e) => actions.setShares(e.target.value)}
            disabled={!stateVars.connected}
          />
          <button onClick={actions.withdraw} disabled={!stateVars.connected}>
            Ragequit
          </button>
        </div>
      </div>
    </div>
  );
};
export default Pledge;
