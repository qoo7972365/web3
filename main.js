// ethers 連線與合約 ABI
const abi = [
	"function currentRoundId() public view returns (uint256)",
	"function rounds(uint256) public view returns (uint256 totalAmount, uint256 totalTickets, bool drawn)",
	"function getRoundPlayers(uint256 roundId) external view returns (address[] memory)",
	"event Winner(uint256 roundId, address first, address second, address third, uint256 amount1, uint256 amount2, uint256 amount3)"
  ];
  const contractAddress = "0x79bF1a51d6d929336eF3d3419DacC77Fdf5D08c7";
  const rpc = "https://arb1.arbitrum.io/rpc";
  let countdownTimers = [];
  let loadedRounds = []; // 已加載成功的局號
  let minLoadedRoundId = null; // 已加載最小局號
  
  // 儲存到localStorage
  function saveLoadedRounds() {
	localStorage.setItem("loadedRounds", JSON.stringify(loadedRounds));
	localStorage.setItem("minLoadedRoundId", minLoadedRoundId);
  }
  // 讀取localStorage
  function loadLoadedRounds() {
	const data = localStorage.getItem("loadedRounds");
	loadedRounds = data ? JSON.parse(data) : [];
	minLoadedRoundId = localStorage.getItem("minLoadedRoundId");
	minLoadedRoundId = minLoadedRoundId ? parseInt(minLoadedRoundId, 10) : null;
  }
  // 追加查詢到的局號
  function addLoadedRounds(newIds) {
	for (let id of newIds) {
	  if (!loadedRounds.includes(id)) loadedRounds.push(id);
	}
	if (newIds.length > 0) {
	  const minId = Math.min(...loadedRounds, ...newIds);
	  minLoadedRoundId = minId;
	}
	saveLoadedRounds();
  }
  // 清空
  function clearLoadedRounds() {
	loadedRounds = [];
	minLoadedRoundId = null;
	saveLoadedRounds();
  }
  
  // 合約地址點擊複製
  function copyContractAddr(elem) {
	const addr = elem.innerText.trim();
	navigator.clipboard.writeText(addr).then(() => {
	  elem.classList.add("copied");
	  setTimeout(() => {
		elem.classList.remove("copied");
	  }, 950);
	});
  }
  
  // 時間格式處理
  function roundIdToDate(roundId) {
	const ts = Number(roundId) * 3600 + 16 * 3600;
	const dt = new Date(ts * 1000);
	return `${dt.getFullYear()}年${String(dt.getMonth() + 1).padStart(2, "0")}月${String(dt.getDate()).padStart(2, "0")}日 ${String(dt.getHours()).padStart(2, "0")}時`;
  }
  function getOpenTimestamp(roundId) {
	return Number(roundId) * 3600 + 63 * 60 - 8 * 3600;
  }
  function formatCountdown(secs) {
	if (secs < 0) return "已開獎";
	const h = Math.floor(secs / 3600);
	const m = Math.floor((secs % 3600) / 60);
	const s = secs % 60;
	return `${h > 0 ? h + "小時" : ""}${m > 0 ? m + "分" : ""}${s}秒`;
  }
  
  // 查詢開獎事件
  async function getWinnerInfo(contract, roundId) {
	try {
	  const logs = await contract.queryFilter("Winner", 'earliest', 'latest');
	  if (!logs || logs.length === 0) return null;
	  const evt = logs.reverse().find(x => x.args.roundId.toString() === String(roundId));
	  if (!evt) return null;
	  return {
		first: evt.args.first,
		second: evt.args.second,
		third: evt.args.third,
		amount1: evt.args.amount1,
		amount2: evt.args.amount2,
		amount3: evt.args.amount3
	  };
	} catch (e) {
	  return null;
	}
  }
  
  // 加載單個 round 資料（成功才記錄）
  async function fetchRoundBlock(contract, rid, highlightId, maxRoundId) {
	try {
	  const [round, players, winnerInfo] = await Promise.all([
		contract.rounds(rid),
		contract.getRoundPlayers(rid),
		getWinnerInfo(contract, rid)
	  ]);
	  const totalAmount = ethers.formatEther(round.totalAmount);
	  const totalTickets = round.totalTickets.toString();
	  let roundTitle = highlightId && rid === highlightId ? "<span style='color:#e72;'>（查詢局）</span>" : (rid === maxRoundId ? "（當前局）" : "");
  
	  let openTimeHtml = "";
	  if (rid === maxRoundId) {
		const openTs = getOpenTimestamp(rid);
		let left = Math.floor(openTs - Date.now() / 1000);
		const countdownId = "countdown_" + rid;
		openTimeHtml = `
		  <div class="opentime-label">
			開獎時間：${new Date(openTs * 1000).toLocaleString("zh-TW", {hour12:false})}<br>
			<span class="countdown" id="${countdownId}">${formatCountdown(left)}</span>
		  </div>
		`;
	  }
  
	  return {
		html: `
		<div class="round-block">
		  <div class="roundid-label">局號：${rid} ${roundTitle}</div>
		  <div class="datetime-label">可下注時間：${roundIdToDate(rid)} 至 ${roundIdToDate(rid+1)} </div>
		  ${openTimeHtml}
		  <div class="subitem"><b>當前獎池(總投注總金額)：</b>${totalAmount} ETH</div>
		  <div class="subitem"><b>投注人數：</b>${totalTickets}</div>
		  <div class="subitem"><b>本局投注地址：</b>
			<ul>
			  ${players.length === 0 ? "<li>尚無投注</li>" : players.map(x=>`<li>${x}</li>`).join("")}
			</ul>
		  </div>
		  <div class="subitem"><b>中獎紀錄：</b>
			${winnerInfo ? `
			  <div class="winner-block">
				<b>第一名：</b>${winnerInfo.first}<br>獎金：${ethers.formatEther(winnerInfo.amount1)} ETH<br>
				<b>第二名：</b>${winnerInfo.second}<br>獎金：${ethers.formatEther(winnerInfo.amount2)} ETH<br>
				<b>第三名：</b>${winnerInfo.third}<br>獎金：${ethers.formatEther(winnerInfo.amount3)} ETH
			  </div>
			` : `<span style="color:#aaa;">尚未開獎或無紀錄</span>`}
		  </div>
		</div>
		`,
		rid: rid
	  }
	} catch {
	  return null; // 查詢失敗
	}
  }
  
  // 一次加載三個有效局，失敗自動往下找
  async function fetchNValidRounds(startFrom, n = 3, highlightId = null, append = false) {
	const provider = new ethers.JsonRpcProvider(rpc);
	const contract = new ethers.Contract(contractAddress, abi, provider);
  
	let html = append ? document.getElementById("result").innerHTML : `<div class="rounds-row">`;
	let count = 0;
	let rid = startFrom;
	let fetchedIds = [];
	let maxRoundId = startFrom;
  
	while (count < n && rid > 0) {
	  if (loadedRounds.includes(rid)) {
		rid--;
		continue;
	  }
	  const block = await fetchRoundBlock(contract, rid, highlightId, maxRoundId);
	  if (block) {
		html += block.html;
		fetchedIds.push(rid);
		count++;
	  }
	  rid--;
	}
	if (!append) html += "</div>";
	document.getElementById("result").innerHTML = html;
	addLoadedRounds(fetchedIds);
	return {last: rid, loaded: fetchedIds};
  }
  
  // 查詢最新三局
  async function queryLatestRounds(init = false) {
	try {
	  const provider = new ethers.JsonRpcProvider(rpc);
	  const contract = new ethers.Contract(contractAddress, abi, provider);
	  const nowRoundId = await contract.currentRoundId();
	  // 初始只查三局（遇到查不到會自動往下找三個有效局）
	  const {last} = await fetchNValidRounds(Number(nowRoundId), 3, null, false);
	  minLoadedRoundId = last + 1;
	  saveLoadedRounds();
	  if (init) document.getElementById("result").setAttribute('data-loaded', '1');
	} catch(e) {
	  document.getElementById("result").innerHTML = `<div class='error'>查詢失敗：${e}</div>`;
	}
  }
  
  // 查詢更多三局
  async function queryMoreRounds() {
	if (!minLoadedRoundId) return;
	const {last, loaded} = await fetchNValidRounds(minLoadedRoundId - 1, 3, null, true);
	if (loaded.length > 0) {
	  minLoadedRoundId = last + 1;
	  saveLoadedRounds();
	}
  }
  
  // 監聽下滑
  window.addEventListener("scroll", async function() {
	if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
	  if (document.getElementById("result").getAttribute('data-loaded') === '1') {
		await queryMoreRounds();
	  }
	}
  });
  
  // 查詢指定局
  async function onSearch() {
	const val = document.getElementById("searchId").value.trim();
	if (!val || isNaN(val)) return;
	clearLoadedRounds();
	minLoadedRoundId = Number(val);
	await fetchNValidRounds(Number(val), 3, Number(val), false);
	document.getElementById("result").setAttribute('data-loaded', '1');
  }
  
  // 回到最新局
  function resetAuto() {
	document.getElementById("searchId").value = "";
	clearLoadedRounds();
	queryLatestRounds();
  }
  
  // 頁面首次載入
  loadLoadedRounds();
  clearLoadedRounds();  // 每次刷新直接清空（建議這樣最保險）
  queryLatestRounds(true);
  