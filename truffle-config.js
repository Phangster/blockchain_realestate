const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {

    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },

    develop: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }

  }
};
