export const TOKEN_ADDRESS = "token address here";
export const SALE_ADDRESS = "sale address here";

export const TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
];

export const SALE_ABI = [
  "function claimAirdrop() external",
  "function buyToken() external payable",
  "function hasClaimed(address) view returns (bool)",
  "function airdropAmount() view returns (uint256)",
  "function rate() view returns (uint256)"
];