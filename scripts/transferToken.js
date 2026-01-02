const hre = require("hardhat");

async function main() {
    const tokenAddress = "token address here";
    const saleAddress = "sale address here";
    const amount = hre.ethers.parseEther("50000");

    const token = await hre.ethers.getContractAt("MyToken", tokenAddress);
    await token.transfer(saleAddress, amount);

    console.log("Transferred", hre.ethers.formatEther(amount), "tokens to TokenSale at", saleAddress);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});