import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/Header.module.css'

interface IHeaderProps {
  connect: Function;
  connected: boolean;
}

const Header: React.FC<IHeaderProps> = ({ connect, connected }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href='/'>
          <a><Image src='/govrn-logo.svg' width={125} height={50} alt='govrn logo' /></a>
        </Link>  
      </div>
      <nav>
        <Link href='/'><a className={styles.linkText}>🔮 Discover</a></Link>
        <Link href='/'><a className={styles.linkText}>🎳 Bowling Alley</a></Link>
      </nav>
      <div className={connected ? 'hide' : styles.connect}>
        <button onClick={() => connect()}>Connect Wallet</button>
      </div>
      <div className={connected ? styles.greeting : 'hide'}>
        <Image src='/govrn-circle.png' width={35} height={35} alt='govrn circle' />
        <p>Hi, there!</p>
      </div>
    </header>
  );
}
export default Header;
