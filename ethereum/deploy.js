const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("../ethereum/build/CampignFactory.json");

const provider = new HDWalletProvider(
    "page toward scatter accuse mimic capable exercise mesh wage brush depart slim",
    "https://rinkeby.infura.io/v3/b86a30a72fd64869b45d48c4322244ac"
)

const web3 = new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(
        JSON.parse(compiledFactory.interface)
    )
        .deploy({ data: '0x' + compiledFactory.bytecode })
        .send({ gas: "1000000", from: accounts[0] });

    console.log("Contract deployed to", result.options.address);
}

deploy();