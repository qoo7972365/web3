// === 語言安全保護 ===
if (!window.langData) {
	alert("語言包未載入，請檢查 lang.js 是否正確引入！");
	throw new Error("lang.js 未載入");
  }
  let currentLang = window.currentLang || 'zh';
  function getLangPack() {
	return window.langData[currentLang] || window.langData.zh;
  }
  
  // === ethers 設定 ===
  const abi = [
	"function currentRoundId() public view returns (uint256)",
	"function rounds(uint256) public view returns (uint256 totalAmount, uint256 totalTickets, bool drawn)",
	"function getRoundPlayers(uint256 roundId) external view returns (address[] memory)",
	"event Winner(uint256 roundId, address first, address second, address third, uint256 amount1, uint256 amount2, uint256 amount3)"
  ];
  const contractAddress = "0x79bF1a51d6d929336eF3d3419DacC77Fdf5D08c7";
  const rpc = "https://arb1.arbitrum.io/rpc";
  const provider = new ethers.JsonRpcProvider(rpc);
  const contract = new ethers.Contract(contractAddress, abi, provider);
  
  // === 狀態 ===
  let loadedRounds = [];
  let minLoadedRoundId = null;
  let globalCurrentRoundId = null;
  let isLoadingRounds = false;
  
  // === 工具 ===
  function saveLoadedRounds() {
	localStorage.setItem("loadedRounds", JSON.stringify(loadedRounds));
	localStorage.setItem("minLoadedRoundId", minLoadedRoundId);
  }
  function loadLoadedRounds() {
	const data = localStorage.getItem("loadedRounds");
	loadedRounds = data ? JSON.parse(data) : [];
	minLoadedRoundId = localStorage.getItem("minLoadedRoundId");
	minLoadedRoundId = minLoadedRoundId ? parseInt(minLoadedRoundId, 10) : null;
  }
  function addLoadedRounds(newIds) {
	for (let id of newIds) if (!loadedRounds.includes(id)) loadedRounds.push(id);
	if (newIds.length > 0) minLoadedRoundId = Math.min(...loadedRounds, ...newIds);
	saveLoadedRounds();
  }
  function clearLoadedRounds() {
	loadedRounds = [];
	minLoadedRoundId = null;
	saveLoadedRounds();
  }
  // 時間格式化
  function roundIdToDate(roundId) {
	const ts = Number(roundId) * 3600 + 16 * 3600;
	const dt = new Date(ts * 1000);
	return currentLang === 'en'
	  ? `${dt.getFullYear()}/${String(dt.getMonth() + 1).padStart(2, "0")}/${String(dt.getDate()).padStart(2, "0")} ${String(dt.getHours()).padStart(2, "0")}:00`
	  : `${dt.getFullYear()}年${String(dt.getMonth() + 1).padStart(2, "0")}月${String(dt.getDate()).padStart(2, "0")}日 ${String(dt.getHours()).padStart(2, "0")}時`;
  }
  function getOpenTimestamp(roundId) {
	return Number(roundId) * 3600 + 63 * 60 - 8 * 3600;
  }
  function formatCountdown(secs) {
	if (secs < 0) return getLangPack().countdown || (currentLang === 'en' ? 'Drawn' : '已開獎');
	const h = Math.floor(secs / 3600);
	const m = Math.floor((secs % 3600) / 60);
	const s = secs % 60;
	return currentLang === 'en'
	  ? (h > 0 ? h + "h" : "") + (m > 0 ? m + "m" : "") + s + "s"
	  : `${h > 0 ? h + "小時" : ""}${m > 0 ? m + "分" : ""}${s}秒`;
  }
  // 查詢 Winner
  async function getWinnerInfo(roundId) {
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
  // round 區塊
  async function fetchRoundBlock(rid, highlightId, maxRoundId) {
	const d = getLangPack();
	try {
	  const [round, players, winnerInfo] = await Promise.all([
		contract.rounds(rid),
		contract.getRoundPlayers(rid),
		getWinnerInfo(rid)
	  ]);
	  const totalAmount = ethers.formatEther(round.totalAmount);
	  const totalTickets = round.totalTickets.toString();
	  let roundTitle = highlightId && rid === highlightId
		? `<span style='color:#e72;'>${d.queryRound}</span>`
		: (rid === maxRoundId ? d.currentRound : '');
	  let openTimeHtml = "";
	  if (rid === maxRoundId) {
		const openTs = getOpenTimestamp(rid);
		let left = Math.floor(openTs - Date.now() / 1000);
		const countdownId = "countdown_" + rid;
		openTimeHtml = `
		  <div class="opentime-label">
			${d.drawTime}：${new Date(openTs * 1000).toLocaleString(currentLang === 'en' ? "en-US" : "zh-TW", {hour12:false})}<br>
			<span class="countdown" id="${countdownId}">${formatCountdown(left)}</span>
		  </div>
		`;
	  }
	  return {
		html: `
		<div class="round-block">
		  <div class="roundid-label">${d.roundLabel}：${rid} ${roundTitle}</div>
		  <div class="datetime-label">${d.betTime}：${roundIdToDate(rid)} ${d.to} ${roundIdToDate(rid+1)}</div>
		  ${openTimeHtml}
		  <div class="subitem"><b>${d.pool}</b>${totalAmount} ETH</div>
		  <div class="subitem"><b>${d.playerCount}</b>${totalTickets}</div>
		  <div class="subitem"><b>${d.betAddr}</b>
			<ul>
			  ${players.length === 0 ? `<li>${d.noBet}</li>` : players.map(x=>`<li>${x}</li>`).join("")}
			</ul>
		  </div>
		  <div class="subitem"><b>${d.winnerRecord}</b>
			${winnerInfo ? `
			  <div class="winner-block">
				<b>${d.firstPrize}</b>${winnerInfo.first}<br>${d.prize}${ethers.formatEther(winnerInfo.amount1)} ETH<br>
				<b>${d.secondPrize}</b>${winnerInfo.second}<br>${d.prize}${ethers.formatEther(winnerInfo.amount2)} ETH<br>
				<b>${d.thirdPrize}</b>${winnerInfo.third}<br>${d.prize}${ethers.formatEther(winnerInfo.amount3)} ETH
			  </div>
			` : `<span style="color:#aaa;">${d.notDrawn}</span>`}
		  </div>
		</div>
		`,
		rid: rid
	  }
	} catch (e) {
	  return null;
	}
  }
  // 批次查詢
  async function fetchNValidRounds(startFrom, n = 3, highlightId = null, append = false, currentRoundId = null) {
	let html = append ? document.getElementById("result").innerHTML : `<div class="rounds-row">`;
	let count = 0;
	let rid = startFrom;
	let fetchedIds = [];
	let _currentRoundId = currentRoundId !== null ? currentRoundId : startFrom;
	while (count < n && rid > 0) {
	  if (loadedRounds.includes(rid)) { rid--; continue; }
	  const block = await fetchRoundBlock(rid, highlightId, _currentRoundId);
	  if (block) { html += block.html; fetchedIds.push(rid); count++; }
	  rid--;
	}
	if (!append) html += "</div>";
	document.getElementById("result").innerHTML = html;
	addLoadedRounds(fetchedIds);
	return {last: rid, loaded: fetchedIds};
  }
  // 查詢最新三局
  async function queryLatestRounds(init = false) {
	const d = getLangPack();
	try {
	  const nowRoundId = await contract.currentRoundId();
	  globalCurrentRoundId = Number(nowRoundId);
	  const {last} = await fetchNValidRounds(globalCurrentRoundId, 3, null, false, globalCurrentRoundId);
	  minLoadedRoundId = last + 1;
	  saveLoadedRounds();
	  if (init) document.getElementById("result").setAttribute('data-loaded', '1');
	} catch(e) {
	  document.getElementById("result").innerHTML = `<div class='error'>${d.errQuery || '查詢失敗：'}${e.message || e}</div>`;
	}
  }
  // 查詢更多
  async function queryMoreRounds() {
	if (isLoadingRounds || !minLoadedRoundId) return;
	isLoadingRounds = true;
	try {
	  const {last, loaded} = await fetchNValidRounds(minLoadedRoundId - 1, 3, null, true, globalCurrentRoundId);
	  if (loaded.length > 0) {
		minLoadedRoundId = last + 1;
		saveLoadedRounds();
	  }
	} finally {
	  isLoadingRounds = false;
	}
  }
  // scroll 事件防抖
  let scrollTimeout = null;
  window.addEventListener("scroll", function() {
	if (scrollTimeout) return;
	scrollTimeout = setTimeout(async function() {
	  scrollTimeout = null;
	  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
		if (document.getElementById("result").getAttribute('data-loaded') === '1') {
		  await queryMoreRounds();
		}
	  }
	}, 200);
  });
  // 查詢指定局
  window.onSearch = async function onSearch() {
	const val = document.getElementById("searchId").value.trim();
	if (!val || isNaN(val)) return;
	clearLoadedRounds();
	minLoadedRoundId = Number(val);
	await fetchNValidRounds(Number(val), 3, Number(val), false);
	document.getElementById("result").setAttribute('data-loaded', '1');
  };
  // 回到最新局
  window.resetAuto = async function resetAuto() {
	document.getElementById("searchId").value = "";
	clearLoadedRounds();
	await queryLatestRounds();
  };
  
  // 支援語言切換即時重渲染
  window.onLangChanged = function() {
	currentLang = window.currentLang || 'zh';
	setLangUI();
	clearLoadedRounds();
	queryLatestRounds();
  };
  
  // 首次載入
  window.addEventListener('DOMContentLoaded', () => {
	setLangUI();
	loadLoadedRounds();
	clearLoadedRounds();
	queryLatestRounds(true);
  });
  