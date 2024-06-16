require("@nomiclabs/hardhat-waffle");
/** @type import('hardhat/config').HardhatUserConfig */

const INFURA_API_KEY = vars.get("TEST_INFURA_API_KEY");

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [vars.get("TEST_ACCOUNT_PRIVATE_KEY")],
    },
  },
};
