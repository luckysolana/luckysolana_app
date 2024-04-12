import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from 'next/image';

import style from "../styles/Header.module.css";

import Head from 'next/head'


const Header = () => {
  return (    
    <div className={style.wrapper}>
      <Head>
        <title>Raffles - LuckySolana</title>
      </Head>
      <div className={style.title}>
      <a href="https://www.luckysolana.com" >
        <Image
          src="/images/logo.png" // Route of the image file
          height={50} // Desired size with correct aspect ratio
          width={144} // Desired size with correct aspect ratio
          alt="Raffle"
        />
        </a>
      </div>

      <div className={style.icons}>
      <a href="https://twitter.com/LuckySolanaSPL" target="_blank">
        <Image
          src="/images/x-logo.png" // Route of the image file
          height={50} // Desired size with correct aspect ratio
          width={80} // Desired size with correct aspect ratio
          alt="X"
        />
        </a>
        <a href="https://t.me/LuckySolanaSPL"  target="_blank">
        <Image
          src="/images/telegram-logo.svg" // Route of the image file
          height={40} // Desired size with correct aspect ratio
          width={40} // Desired size with correct aspect ratio
          alt="X"
        />
        </a>
        <a href="https://www.dextools.io/app/en/solana/pair-explorer/2sbjQcrdCJaJ3qBzBBMVB1npaSfRw3miHwdMoYS3S57f" target="_blank">
        <Image
          src="/images/dextools-logo.svg" // Route of the image file
          height={40} // Desired size with correct aspect ratio
          width={80} // Desired size with correct aspect ratio
          alt="X"
        />
        </a>
        <a href="https://raydium.io/swap/?inputCurrency=sol&outputCurrency=9qHoyZBj8Q478pXgGnpP1PTUVwEZixqFcxeQxq1Ugv85&fixed=in" target="_blank">
        <Image
          src="/images/raydiumlogo.svg" // Route of the image file
          height={40} // Desired size with correct aspect ratio
          width={60} // Desired size with correct aspect ratio
          alt="X"
        />
        </a>
        <a href="https://birdeye.so/token/9qHoyZBj8Q478pXgGnpP1PTUVwEZixqFcxeQxq1Ugv85?chain=solana" target="_blank">
        <Image
          src="/images/birdeye-logo.avif" // Route of the image file
          height={50} // Desired size with correct aspect ratio
          width={60} // Desired size with correct aspect ratio
          alt="X"
        />
        </a>
        <a href="https://dexscreener.com/solana/2sbjqcrdcjaj3qbzbbmvb1npasfrw3mihwdmoys3s57f" target="_blank">
        <Image
          src="/images/dexscreener-logo.avif" // Route of the image file
          height={50} // Desired size with correct aspect ratio
          width={60} // Desired size with correct aspect ratio
          alt="X"
        />
        </a>                
      </div>
      
      <WalletMultiButton/>
    </div>
  );
};

export default Header;
