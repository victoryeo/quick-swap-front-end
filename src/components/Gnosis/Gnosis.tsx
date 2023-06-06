import styles from "./Gnosis.module.css";
import Image from 'next/image';
import gnosis from '../../../public/gnosis.png';

export default function Gnosis() {
  const handleGriefingLock = () => {

  };

  const handlePrincipalLock = () => {

  };
  return(
    <div className={styles.container}>
      <div className='flex flex-col items-center pt-4 bg-[#1c589d] max-h-full w-full mb-5'>
          <div className='transition hover:rotate-180 transition-duration:100ms ease-in-out scale-75'>
            <Image
                src={gnosis}
                alt=""
                width={300}
                height={200}
            />
          </div>
          <h2 className="text-3xl font-bold mb-5 text-[#ada6c1]">
            Gnosis Contract
          </h2>
          <button className={styles.griefinglock} onClick={handleGriefingLock}>
            Deploy Griefing Lock
          </button>
      </div>
      <div>
          <button className={styles.principallock} onClick={handlePrincipalLock}>
            Deploy Principal Lock
          </button>
      </div>
    </div>
  )
}