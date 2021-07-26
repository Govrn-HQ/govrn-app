import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        <Link href='#'>
          <a><Image src='/govrn-logo.svg' width={125} height={50} alt='govrn footer logo' /></a>
        </Link>
        <p>Powered by People.</p>
      </div>
      <div className={styles.social}>
        <Link href='/'><a><Image src='/Facebook.svg' width={27} height={27} alt='facebook' /></a></Link>
        <Link href='/'><a><Image src='/Twitter.svg' width={27} height={27} alt='twitter' /></a></Link>
        <Link href='/'><a><Image src='/Youtube.svg' width={27} height={27} alt='youtube' /></a></Link>
      </div>
    </footer>
  );
}
export default Footer;
