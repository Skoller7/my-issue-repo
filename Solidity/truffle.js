var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "explain old dose cruise cost visa shove rude message valid own ask";
/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
 module.exports = {
    networks: {
  development: {
    host: "localhost",
    port: 7545,
    network_id: "*" // Match any network id
  },
  rinkby: {
    provider: function() {
      return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/e1f507ef8d814286a1f1e2ea39cfe576')
      },
      network_id: '4', // 0xcbf9889d922f5c6096067e838dd7a52a9a52c91b datacontractcreator
    }
  }
};
