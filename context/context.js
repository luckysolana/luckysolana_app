import { createContext, useContext , useMemo,useEffect,useState} from "react";
import{BN} from "@project-serum/anchor"
import { SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";


import{
  getLotteryAddress,
  getMasterAddress,
  getProgram,
  getTicketAddress,
  getTotalPrize,
  getTransactionStatus,
} from "../utils/program";

import{
  TICKET_PRICE,
  ADMIN_PUBLIC_KEY1,
  ADMIN_PUBLIC_KEY2,
} from "../utils/constants";


import { confirmTx, mockWallet } from "../utils/helper";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [masterAddress, setMasterAddress] = useState();
  const[initialized, setInitialized] = useState(false)
  const [lotteryId, setLotteryId] = useState()
  const[lotteryPot, setLotteryPot] = useState()
  const[lottery, setLottery] = useState()
  const[lotteryAddress, setLotteryAddress] = useState()
  const[userWinningId, setUserWinningId] = useState(false)
  const[lotteryHistory, setLotteryHistory] = useState([])
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [txLink, setTxLink] = useState("");

  //Get Provvider
  const {connection} = useConnection()
  const wallet = useAnchorWallet()
  const program = useMemo(()=>{
    if(connection){
      return getProgram(connection, wallet ?? mockWallet())
    }
  },[connection,wallet])

 useEffect(()=>{
    updateState()
  },[program])

  useEffect(()=>{
    if(!lottery) return
    getPot();
    getHistory()
  },[lottery])
  
  const updateState = async () => {
    if(!program) return;

    try{
      if(!masterAddress){
        //get the master address
        const masterAddress = await getMasterAddress()
        //how do we save this master address
        setMasterAddress(masterAddress)
      }

      const master = await program.account.master.fetch(
        masterAddress ??(await getMasterAddress())
      )
      
      setTxLink("")
      setInitialized(true)
      setLotteryId(master.lastId)
      const lotteryAddress = await getLotteryAddress(master.lastId);
      setLotteryAddress(lotteryAddress)
      
      const lottery = await program.account.lottery.fetch(lotteryAddress)
      setLottery(lottery)
      
      //get user ticket for the current lottery
      if(!wallet?.publicKey) return;

      const userTickets = await program.account.ticket.all()

      //check whether any of the user tickets win
      const userWin = userTickets.some(
        (t)=>t.account.id === lottery.winnerId
      );
      if(userWin){
        // console.log("user win")
        setUserWinningId(lottery.winnerId)
      } else{
        setUserWinningId(null)
      }

    }catch(err){
      console.log(err.message)
    }
  }

  const getPot = async () => {
    const pot = getTotalPrize(lottery);
    setLotteryPot(pot)
  }

  const getHistory = async () => {
    
    if(!lotteryId) return

    const history = []

    for(const i in new Array(lotteryId).fill(null)){
      const id = lotteryId - parseInt(i)
      if(!id) break

      const lotteryAddress = await getLotteryAddress(id)
      const lottery = await program.account.lottery.fetch(lotteryAddress)
      const winnerId = lottery.winnerId;

      if(!winnerId) continue;

      const ticketAddress = await getTicketAddress(lotteryAddress, winnerId)
      
      const ticket = await program.account.ticket.fetch(ticketAddress)

      history.push({
        lotteryId: id,
        winnerId,
        winnerAddress : ticket.authority,
        prize: getTotalPrize(lottery),
      })

    }
    setLotteryHistory(history)
  }

  //call solana program instruction

  const initMaster = async () =>{
    try{
      const txHash = await program.methods
      .initMaster()
      .accounts({
        master : masterAddress,
        payer : wallet.publicKey,
        systemProgram : SystemProgram.programId,
      })
      .rpc()
      await confirmTx(txHash, connection)

      updateState()
      toast.success("Initialized Master!!")
    }catch(err){
      // console.log(err.message)
      toast.error(err.message)
    }
  }

  const createLottery = async () =>{
    
    //This was failiing on master creation, hence trying this approach
    if(!lotteryId && lotteryId != 0) return
    
    try{
      const lotteryAddress = await getLotteryAddress(lotteryId +1)//public key
      const txHash = await program.methods
      .createLottery(new BN(TICKET_PRICE))
      .accounts({
        lottery : lotteryAddress,
        master : masterAddress,
        authority : wallet.publicKey,
        systemProgram : SystemProgram.programId,
      })
      .rpc()
      await confirmTx(txHash, connection);
      updateState()
      toast.success("Created Lottery!!")
    }catch(err) {
      // console.log(err.message)
      toast.error(err.message)
    }
  }

  const buyTicket = async () =>{

    try{
      const txHash = await program.methods
      .buyTicket(lotteryId, 1)
      .accounts({
        lottery : lotteryAddress,
        ticket : await getTicketAddress(
          lotteryAddress,
          lottery.lastTicketId +1
        ),
        buyer : wallet.publicKey,
        systemProgram : SystemProgram.programId,
      })
      .rpc()
      await confirmTx(txHash, connection);
      updateState()
      toast.success("Bought Ticket!!")
    }catch(err) {
      if (err.message.includes("found no record of a prior credit"))
        toast.error("You do not have sufficient balance to buy this ticket!")
      else if (err.message.includes("Transaction was not confirmed")) {

        var txStr = err.message.substring(
          err.message.indexOf("signature ") + 10,
          err.message.lastIndexOf(" using")
        );

        var txLinkStr = "https://explorer.solana.com/tx/" + txStr
        setTxLink(txLinkStr);
        // toast.error(err.message)
        toast.error("Transaction could not be confirmed. Please check the status and try again!")

      } else {
        toast.error("Unable to buy ticket due to network congestion! Please try again!")

      }
    }
  }

  const pickWinner = async () =>{
    try{
      const txHash = await program.methods
      .pickWinner(lotteryId)
      .accounts({
        lottery : lotteryAddress,
        authority : wallet.publicKey,
      
      })
      .rpc();
      await confirmTx(txHash, connection);

      updateState();
      toast.success("Picked Winner!!")
    }catch(err) {
      toast.error(err.message)
    }
  }

  const testCall = async () =>{
    // try{
    //   const txHash = await program.methods
    //   .testCall(lotteryId, userWinningId)
    //   .accounts({
    //     authority : wallet.publicKey,
    //     systemprogram : SystemProgram.programId,
    //   })
    //   .rpc();
    //   await confirmTx(txHash, connection);

    //   updateState();
    //   toast.success("Tested a new call!!")
    // }catch(err) {
    //   toast.error(err.message)
    // }
  }

  const claimPrize = async () =>{

    setError("");
    setSuccess("");

    // console.log("Claiming prize now!!!")
    try{
      const txHash = await program.methods
      .claimPrize(lotteryId, userWinningId)
      .accounts({
        lottery : lotteryAddress,
        ticket : await getTicketAddress(lotteryAddress, userWinningId),
        authority : wallet.publicKey,
        systemProgram : SystemProgram.programId,
        owner: new PublicKey(ADMIN_PUBLIC_KEY1),
      })
      .rpc();
      await confirmTx(txHash, connection);

      updateState();
      toast.success("Claimed Prize!!")
      
    }catch(err) {
      if (err.message.includes("Error Number: 2001"))
          toast.error("You are not the Winner, hence can not claim this prize!")
      else
          toast.error(err.message)  
    }
  }

  return (
    <AppContext.Provider
      value={{
        // Put functions/variables you want to bring out of context to App in here
        connected: wallet?.publicKey ? true:false,
        isMasterInitialized: initialized,
        lotteryId,
        lotteryPot,
        isLotteryOwner: wallet && (wallet.publicKey.equals(new PublicKey(ADMIN_PUBLIC_KEY1)) || wallet.publicKey.equals(new PublicKey(ADMIN_PUBLIC_KEY2))),
        isUserWinner: wallet && (lotteryHistory?.length && wallet.publicKey.equals(lotteryHistory[0].winnerAddress)),
        isLotteryAuthority: wallet && lottery && wallet.publicKey.equals(lottery.authority),
        isFinished: lottery && lottery.winnerId,
        canClaim: lottery && !lottery.claimed && userWinningId,
        lotteryHistory,
        initMaster,
        createLottery,
        buyTicket,
        pickWinner,
        claimPrize,
        testCall,
        error,
        success,
        txLink
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
