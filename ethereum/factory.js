import web3 from "./web3"
import CampaignFactory from "./build/CampignFactory.json"

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    "0xE4fE81CC0903eA2Fa089251462b490D401461492"
);

export default instance