// 完整語言包範例，只需維護這份即可
window.langData = {
	zh: {
	  langName: '中文',
	  btn: '🌏 中文',
	  menu: ['🌏 中文', '🇬🇧 English'],
	  title: 'ArbitrumOne 智能合約聚寶盆 0.001 ETH 一注',
	  desc: `<p>
        智能合約聚寶盆是一個部署在 <b>Arbitrum One</b> 公鏈上的去中心化彩票遊戲平台，專為以太坊生態用戶打造。所有遊戲規則、投注紀錄與開獎流程，全部由智能合約自動化執行，確保每一局都公開透明、無法竄改。玩家無需信任第三方，所有資料都能隨時在區塊鏈上查詢。無論是資深玩家還是新手，都能輕鬆體驗區塊鏈彩票的公平與樂趣。
      </p>
      <p>
        只要使用自己的加密錢包（如 MetaMask 等），選擇 <b>Arbitrum One</b> 網路，向合約地址發送 0.001 ETH，就能自動獲得一張彩票。每小時自動開獎一次，系統隨機抽出三位得獎者，並即時將獎金發送到中獎地址。遊戲流程完全自動，不需人工介入，任何中獎都能及時獲得派彩。
      </p>
      <p style="color:#b22;">
        【重要提醒】<br>
        <b>請確認你的錢包已切換到 Arbitrum One 網路！</b><br>
        雖然以太坊（Ethereum）主網和 Arbitrum One 的地址格式相同，但兩條鏈的資產是獨立分開的。請務必確保你的錢包資產是在 <b>Arbitrum One</b> 上，才能參與本遊戲。如果從以太坊主網直接轉帳到合約地址，資產將不會進入遊戲，且無法自動退回。
      </p>
      <p>
        以下為本平台詳細遊戲規則：
      </p>
      <ol>
        <li>使用智能合約自動化交易，完全公平公開，所有數據鏈上可查，中獎後合約自動執行派彩，不存在中獎不出款的情況。</li>
        <li>遊戲規則簡單，<b>0.001 ETH</b> 為一張彩票，任何地址對合約地址轉帳 0.001 ETH 即得一張彩票。</li>
        <li>每個錢包地址上限一局只能投注 <b>100 張彩票（0.1 ETH）</b>。</li>
        <li>本遊戲部署於 <b>Arbitrum One 公鏈</b>，速度快，手續費極低。</li>
        <li>當局最小遊戲人數為 3 人，若小於 3 人，開獎時則自動按原地址返回下注金額。</li>
        <li>每小時的第三分鐘自動開獎。</li>
        <li>只能使用私有錢包地址，中獎按原地址返還。</li>
        <li>每局開出三位得獎者，第一位獲得獎池 50% 金額，第二位獲得獎池 30% 金額，第三位獲得獎池 20% 金額。</li>
      </ol>
      <p>
        歡迎所有玩家體驗真正的去中心化公平遊戲，現在就用你的錢包地址參與，每一筆投注、開獎與派彩都完全鏈上可查，讓你玩得安心又放心！
      </p>`,
	  labelContract: '合約地址(點擊下方地址複製)',
	  copied: '已複製',
	  autorefresh: '點擊「回最新局」手動刷新最新資料',
	  labelSearch: '查詢指定局號：',
	  searchPh: '請輸入局號',
	  btnSearch: '查詢',
	  btnReset: '回最新局',
	  roundLabel: '局號',
	  queryRound: '（查詢局）',
	  currentRound: '（當前局）',
	  betTime: '可下注時間',
	  to: '至',
	  drawTime: '開獎時間',
	  pool: '當前獎池(總投注總金額)：',
	  playerCount: '投注人數：',
	  betAddr: '本局投注地址：',
	  noBet: '尚無投注',
	  winnerRecord: '中獎紀錄：',
	  firstPrize: '第一名：',
	  secondPrize: '第二名：',
	  thirdPrize: '第三名：',
	  prize: '獎金：',
	  notDrawn: '尚未開獎或無紀錄',
	  errQuery: '查詢失敗：'
	},
	en: {
	  langName: 'English',
	  btn: '🇬🇧 English',
	  menu: ['🌏 中文', '🇬🇧 English'],
	  title: 'ArbitrumOne Blockchain Lottery 0.001 ETH per ticket',
	  desc: `<p>
Smart Contract Cornucopia is a decentralized lottery game platform deployed on the <b>Arbitrum One</b> public chain, designed specifically for Ethereum ecosystem users. All game rules, betting records and lottery processes are automatically executed by smart contracts to ensure that every game is open, transparent and cannot be tampered with. Players do not need to trust a third party, and all information can be queried on the blockchain at any time. Whether you are an experienced player or a novice, you can easily experience the fairness and fun of blockchain lottery.
</p>
<p>
Just use your own crypto wallet (such as MetaMask, etc.), select the <b>Arbitrum One</b> network, send 0.001 ETH to the contract address, and you will automatically get a lottery ticket. The prize draw is automatically held every hour, and the system randomly selects three winners and sends the prize money to the winning address immediately. The game process is completely automatic, no human intervention is required, and any winnings will be paid out in a timely manner.
</p>
<p style="color:#b22;">
【Important Reminder】<br>
<b>Please make sure your wallet has switched to the Arbitrum One network! </b><br>
Although the address format of the Ethereum mainnet and Arbitrum One is the same, the assets of the two chains are independent and separate. Please make sure your wallet assets are on <b>Arbitrum One</b> to participate in this game. If you transfer funds directly from the Ethereum mainnet to the contract address, the assets will not enter the game and cannot be automatically returned. 
</p>
<p>
The following are the detailed game rules of this platform:
</p>
<ol>
<li>Use smart contracts to automate transactions, which is completely fair and open. All data can be checked on the chain. After winning a prize, the contract will automatically execute the payout. There is no situation where the prize is not paid out. </li>
<li>The rules of the game are simple. <b>0.001 ETH</b> is one lottery ticket. Any address that transfers 0.001 ETH to the contract address will get one lottery ticket. </li>
<li>Each wallet address can only place bets on <b>100 lottery tickets (0.1 ETH)</b> per round. </li>
<li>This game is deployed on the <b>Arbitrum One public chain</b>, which has fast speed and extremely low transaction fees. </li>
<li>The minimum number of players is 3. If there are less than 3 players, the betting amount will be automatically returned to the original address when the prize is drawn. </li>
<li>The prize is automatically drawn at the third minute of every hour. </li>
<li>Only private wallet addresses can be used, and winnings will be returned to the original address. </li>
<li>There are three winners in each round. The first place winner receives 50% of the prize pool, the second place winner receives 30% of the prize pool, and the third place winner receives 20% of the prize pool. </li>
</ol>
<p>
All players are welcome to experience the truly decentralized fair game. Use your wallet address to participate now. Every bet, prize draw and payout is completely traceable on the chain, allowing you to play with peace of mind! 
</p>`,
	  labelContract: 'Contract address (click to copy below)',
	  copied: 'Copied!',
	  autorefresh: 'Click "Latest Round" to refresh the latest data',
	  labelSearch: 'Search by round number:',
	  searchPh: 'Enter round number',
	  btnSearch: 'Search',
	  btnReset: 'Latest Round',
	  roundLabel: 'Round',
	  queryRound: '(Queried)',
	  currentRound: '(Current Round)',
	  betTime: 'Bet Time',
	  to: 'to',
	  drawTime: 'Draw Time',
	  pool: 'Prize Pool (Total Bets):',
	  playerCount: 'Players:',
	  betAddr: 'Addresses:',
	  noBet: 'No bet yet',
	  winnerRecord: 'Winner Record:',
	  firstPrize: '1st:',
	  secondPrize: '2nd:',
	  thirdPrize: '3rd:',
	  prize: 'Prize:',
	  notDrawn: 'Not drawn yet or no record',
	  errQuery: 'Query failed:'
	}
  };
  