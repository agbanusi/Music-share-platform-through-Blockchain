const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "/build"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" //Match any network id
    }
  }
};
