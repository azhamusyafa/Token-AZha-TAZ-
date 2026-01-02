const hre = require("hardhat");

async function main() {
    const tokenAddress = "token address here";
    const Sale = await hre.ethers.getContractFactory("TokenSale");
    const sale = await Sale.deploy(tokenAddress);
    console.log("TokenSale deploy to:", await sale.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exit(1);;
});
