import styles from "./Besu.module.css";
import Image from 'next/image';
import besu from '../../../public/besu.png';

export default function Besu() {
  return(
    <div className={styles.container}>
      <div className='flex flex-col items-center pt-4 bg-[#1c589d] max-h-full w-full mb-5'>
          <div className='transition hover:rotate-180 transition-duration:100ms ease-in-out scale-75'>
            <Image
                src={besu}
                alt=""
                width={300}
                height={200}
            />
          </div>
          <h2 className="text-3xl font-bold mb-5 text-[#ada6c1]">
            Besu Transfer
          </h2>
      </div>
    </div>
  )
}