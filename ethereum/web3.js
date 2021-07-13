import Web3 from "web3"

let web3

if (typeof window !== 'undefined' && typeof window.web3 !== "undefined") {
    //we are in the browser and metamask is running
    web3 = new Web3();
    web3 = new Web3(window.web3.currentProvider);
} else {
    //We are on the browser  *OR* the user is n't running metamask

    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/b86a30a72fd64869b45d48c4322244ac'
    )
    web3 = new Web3(provider);
}

export default web3;
