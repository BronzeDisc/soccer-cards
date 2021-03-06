require("dotenv").config();
const { ethers } = require("ethers");
const hh = require("hardhat");
const SoccerContract = require("../artifacts/contracts/Soccer.sol/Soccer.json");

async function main() {
  const SoccerContract = await hh.ethers.getContractFactory("Soccer");

  const soccerContract = await SoccerContract.deploy();
  await soccerContract.deployed();
  console.log("Soccer Contract deployed to:", soccerContract.address);

  // const provider = new ethers.providers.getDefaultProvider(process.env.mumbai);
  // const signer = new ethers.Wallet(process.env.account, provider);

  // const soccerContract = new ethers.Contract(
  //   "0x5f4709Ae93ccda191fc7d7DE7dC4BBedAeF4aF30",
  //   SoccerContract.abi,
  //   signer
  // );

  // console.log(await soccerContract);

  const value = ethers.utils.parseUnits("0.0000001", "ether");
  console.log(value);
  //   { value: value, from: signer }

  const tx1 = await soccerContract.mint(
    "https://gateway.pinata.cloud/ipfs/QmaAKjJKhwUgwBnNfyyEFn2uFnYrHFjQfyrfufczKpJ6gk/hernanes.json",
    4,
    Number(value)
  );

  // console.log(tx1);

  const tx2 = await soccerContract.mint(
    "https://gateway.pinata.cloud/ipfs/QmaAKjJKhwUgwBnNfyyEFn2uFnYrHFjQfyrfufczKpJ6gk/luciano.json",
    3,
    Number(value)
  );
  // console.log(tx2);

  // const tx3 = await soccerContract.mint(
  //   "https://gateway.pinata.cloud/ipfs/QmaAKjJKhwUgwBnNfyyEFn2uFnYrHFjQfyrfufczKpJ6gk/reinaldo.json",
  //   3,
  //   Number(value)
  // );
  // console.log(tx3);
  console.log(`done`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
