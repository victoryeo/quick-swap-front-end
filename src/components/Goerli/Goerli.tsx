import styles from "./Goerli.module.css";
import Image from 'next/image';
import goerli from '../../../public/eth.png';

export default function Goerli() {
  return(
    <div className={styles.container}>
      <div className='flex flex-col items-center pt-4 bg-[#1c589d] max-h-full w-full mb-5'>
          <div className='transition hover:rotate-180 transition-duration:100ms ease-in-out scale-75'>
            <Image
                src={goerli}
                alt=""
                width={180}
                height={150}
            />
          </div>
          <h2 className="text-3xl font-bold mb-5 text-[#ada6c1]">
            Goerli Transfer
          </h2>
      </div>
    </div>
  )
}