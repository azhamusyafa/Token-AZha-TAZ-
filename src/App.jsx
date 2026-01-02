import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { TOKEN_ADDRESS, SALE_ADDRESS, TOKEN_ABI, SALE_ABI } from "./config";

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [hasClaimed, setHasClaimed] = useState(false);
  const [ethAmount, setEthAmount] = useState("");
  const [status, setStatus] = useState("");
  const [particlesReady, setParticlesReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setParticlesReady(true));
  }, []);

  async function connectWallet() {
    if (!window.ethereum) {
      setStatus("Install Metamask");
      return;
    }
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
  }

  async function getBalance() {
    if (!account) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
    const bal = await token.balanceOf(account);
    setBalance(ethers.formatEther(bal));
  }

  async function checkClaimed() {
    if (!account) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const sale = new ethers.Contract(SALE_ADDRESS, SALE_ABI, provider);
    const claimed = await sale.hasClaimed(account);
    setHasClaimed(claimed);
  }

  async function claimAirdrop() {
    try {
      setStatus("Claiming...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const sale = new ethers.Contract(SALE_ADDRESS, SALE_ABI, signer);
      const tx = await sale.claimAirdrop();
      await tx.wait();
      setStatus("Airdrop claimed!");
      getBalance();
      checkClaimed();
    } catch (err) {
      setStatus(err.message);
    }
  }

  async function buyToken() {
    try {
      if (!ethAmount) return;
      setStatus("Buying...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const sale = new ethers.Contract(SALE_ADDRESS, SALE_ABI, signer);
      const tx = await sale.buyToken({ value: ethers.parseEther(ethAmount) });
      await tx.wait();
      setStatus("Purchase success!");
      setEthAmount("");
      getBalance();
    } catch (err) {
      setStatus(err.message);
    }
  }

  useEffect(() => {
    if (account) {
      getBalance();
      checkClaimed();
    }
  }, [account]);

  const particleOptions = {
    particles: {
      number: { value: 80 },
      color: { value: "#00ff88" },
      links: {
        enable: true,
        color: "#00ff88",
        opacity: 0.3
      },
      move: {
        enable: true,
        speed: 1
      },
      size: { value: { min: 1, max: 3 } },
      opacity: { value: 0.5 }
    }
  };

  return (
    <div style={styles.container}>
      {particlesReady && <Particles id="particles" options={particleOptions} style={styles.particles} />}
      
      <nav style={styles.nav}>
        <div style={styles.logo}>Token AZha (TAZ)</div>
        {!account ? (
          <button style={styles.connectBtn} onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <div style={styles.walletInfo}>
            {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        )}
      </nav>

      <main style={styles.main}>
        {!account ? (
          <div style={styles.hero}>
            <h1 style={styles.title}>Welcome to TAZ</h1>
            <p style={styles.subtitle}>Token AZha - The future of decentralized finance</p>
            <button style={styles.heroBtn} onClick={connectWallet}>Launch App</button>
          </div>
        ) : (
          <div style={styles.dashboard}>
            <div style={styles.balanceCard}>
              <span style={styles.balanceLabel}>Your Balance</span>
              <span style={styles.balanceValue}>{parseFloat(balance).toLocaleString()} TAZ</span>
            </div>

            <div style={styles.cardContainer}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Airdrop</h3>
                <p style={styles.cardDesc}>Claim 100 TAZ for free</p>
                {hasClaimed ? (
                  <div style={styles.claimed}>Already Claimed</div>
                ) : (
                  <button style={styles.actionBtn} onClick={claimAirdrop}>Claim Now</button>
                )}
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Swap</h3>
                <p style={styles.cardDesc}>1 ETH = 1,000 TAZ</p>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="ETH amount"
                  value={ethAmount}
                  onChange={(e) => setEthAmount(e.target.value)}
                />
                <button style={styles.actionBtn} onClick={buyToken}>Buy TAZ</button>
              </div>
            </div>

            {status && <div style={styles.status}>{status}</div>}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a0a 0%, #0d1f0d 50%, #0a0a0a 100%)",
    color: "#fff",
    fontFamily: "'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden"
  },
  particles: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    position: "relative",
    zIndex: 10
  },
  logo: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#00ff88",
    textShadow: "0 0 20px #00ff88"
  },
  connectBtn: {
    background: "linear-gradient(90deg, #00ff88, #00cc6a)",
    border: "none",
    padding: "12px 24px",
    borderRadius: "12px",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 0 20px rgba(0, 255, 136, 0.4)"
  },
  walletInfo: {
    background: "rgba(0, 255, 136, 0.1)",
    border: "1px solid #00ff88",
    padding: "12px 20px",
    borderRadius: "12px",
    color: "#00ff88"
  },
  main: {
    position: "relative",
    zIndex: 10,
    padding: "40px"
  },
  hero: {
    textAlign: "center",
    marginTop: "120px"
  },
  title: {
    fontSize: "64px",
    marginBottom: "20px",
    background: "linear-gradient(90deg, #00ff88, #00ffcc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "glow 2s ease-in-out infinite alternate"
  },
  subtitle: {
    fontSize: "20px",
    color: "#888",
    marginBottom: "40px"
  },
  heroBtn: {
    background: "linear-gradient(90deg, #00ff88, #00cc6a)",
    border: "none",
    padding: "16px 48px",
    borderRadius: "16px",
    color: "#000",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 0 30px rgba(0, 255, 136, 0.5)"
  },
  dashboard: {
    maxWidth: "800px",
    margin: "0 auto"
  },
  balanceCard: {
    background: "rgba(0, 255, 136, 0.05)",
    border: "1px solid rgba(0, 255, 136, 0.2)",
    borderRadius: "20px",
    padding: "30px",
    textAlign: "center",
    marginBottom: "30px",
    backdropFilter: "blur(10px)"
  },
  balanceLabel: {
    display: "block",
    color: "#888",
    marginBottom: "10px"
  },
  balanceValue: {
    display: "block",
    fontSize: "48px",
    fontWeight: "bold",
    color: "#00ff88",
    textShadow: "0 0 30px rgba(0, 255, 136, 0.5)"
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  },
  card: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(0, 255, 136, 0.1)",
    borderRadius: "20px",
    padding: "30px",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease"
  },
  cardTitle: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#00ff88"
  },
  cardDesc: {
    color: "#888",
    marginBottom: "20px"
  },
  actionBtn: {
    width: "100%",
    background: "linear-gradient(90deg, #00ff88, #00cc6a)",
    border: "none",
    padding: "14px",
    borderRadius: "12px",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)"
  },
  claimed: {
    background: "rgba(0, 255, 136, 0.1)",
    padding: "14px",
    borderRadius: "12px",
    textAlign: "center",
    color: "#00ff88"
  },
  input: {
    width: "100%",
    background: "rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(0, 255, 136, 0.2)",
    padding: "14px",
    borderRadius: "12px",
    color: "#fff",
    marginBottom: "15px",
    outline: "none",
    boxSizing: "border-box"
  },
  status: {
    marginTop: "20px",
    padding: "15px",
    background: "rgba(0, 255, 136, 0.1)",
    borderRadius: "12px",
    textAlign: "center",
    color: "#00ff88"
  }
};

export default App;