import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import style from "../styles/PotCard.module.css";
import { useAppContext } from "../context/context";
import { shortenPk } from "../utils/helper";
import { Toaster } from 'react-hot-toast';
// import {Tooltip} from "@nextui-org/react";
// import { Container, Tooltip } from 'geist/components';

// Temp imports
import { PublicKey } from '@solana/web3.js';
import { useState } from "react"
import { Player, Controls } from '@lottiefiles/react-lottie-player';

const PotCard = () => {
  const {
    connected,
    isMasterInitialized,
    lotteryId,
    lotteryPot,
    isLotteryAuthority,
    isLotteryOwner,
    isFinished,
    isUserWinner,
    canClaim,
    initMaster,
    createLottery,
    buyTicket,
    claimPrize,
    lotteryHistory,
    pickWinner,
    testCall,
    txLink,
  } = useAppContext();
  //console.log(canClaim,"CLAIM STTUS")
  // // Static Functions 
  // const claimPrize = () => {
  //   // setCanClaim(false)
  //   console.log("You're the winner! Claiming your prize now...")
  // }


  if (!isMasterInitialized)
    return (
      <div className={style.wrapper}>

        <div className={style.title}>
          Raffle <span className={style.textAccent}>#{lotteryId}</span>
        </div>
        {connected && isLotteryOwner ? (
          <>
            <div className={style.btn} onClick={initMaster}>
              Initialize master
            </div>
          </>
        ) : (
          // Wallet multibutton goes here
          <WalletMultiButton />
        )}
      </div>
    );



  return (

    <div>

      <div >

        {connected && isFinished && isUserWinner && canClaim && (
          <div className={style.lottie}>
            <Player
              autoplay
              loop
              src="../images/fireworks.json"
              style={{ width: "100%", height: "100%" }}
            >
            </Player>
          </div>

        )}


      </div>



      <div className={style.wrapper}>
        <Toaster />
        <div>
        <a className={style.txLink} target="_blank" href="https://www.reddit.com/user/LuckySolana/" rel="noopener noreferrer">
                        How to play?
                      </a>          

        </div>
        <div>
        <div className={style.title}>
          Raffle <span className={style.textAccent}>#{lotteryId}</span>
        </div>
        <p className={style.ticketPrice}> Ticket price = 0.1 SOL </p>
        </div>
        <div className={style.pot}>Pot 🍯 : {lotteryPot} SOL</div>
        <div className={style.recentWinnerTitle}>🏆 Recent Winner 🏆</div>
        <div className={style.winner}>
          {lotteryHistory?.length &&
            shortenPk(
              lotteryHistory[0].winnerAddress.toBase58()
            )}
          {/* <Tooltip text="The Evil Rabbit Jumped over the Fence"></Tooltip>    */}
        </div>
        {connected ? (
          <>
            {!isFinished ? (
              <div>
                <div className={style.btn} onClick={buyTicket}>
                  Buy Ticket
                </div>
                <div className={style.textCenter}>
                    {txLink && (
                      <a className={style.txLink} target="_blank" href={txLink} rel="noopener noreferrer">
                        Check Transaction Status!
                      </a>
                      )
                    }
                  </div>
              </div>
            ) : (
              
              <div>
              <div className={style.pot}>
                <br></br>
                Raffle draw completed!!!
              </div>
                </div>


            )}



            {isFinished && lotteryHistory?.length && (
              <div>
                {!isUserWinner ? (
                  <div className={style.recentWinnerTitle}>
                    Sorry, better luck next time!
                  </div>
                ) : (
                  <div className={style.title}>
                    <br></br>
                    You won the raffle!!!
                  </div>
                )

                }
              </div>


            )}



            {isLotteryAuthority && !isFinished && (
              <div className={style.btn} onClick={pickWinner}>
                Pick Winner
              </div>
            )}

            {canClaim && isUserWinner && (
              <div className={style.btn} onClick={claimPrize}>
                Claim Prize
              </div>
            )}

            {isLotteryOwner && (
              <div className={style.btn} onClick={createLottery}>
                Create Raffle
              </div>
            )}
            {/* {isLotteryOwner && (
              <div className={style.btn} onClick={testCall}>
                test call
              </div>
            )} */}

          </>
        ) : (
          <WalletMultiButton />
        )}
      </div>
    </div>
  );
};

export default PotCard;