const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampignFactory.json");
const compiledCampaign = require("../ethereum/build/Campign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth
        .Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: "0x" + compiledFactory.bytecode })
        .send({ from: accounts[0], gas: "1000000" })

    await factory.methods.createCampign("100").send({
        from: accounts[0],
        gas: "1000000"
    })

    const addressed = await factory.methods
        .getDeployedCamapigns()
        .call()
    campaignAddress = addressed[0]
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress //address of the deployed campign contract ,,, because it's deployed from createCampign
    )
})

describe("Campaigns", () => {
    it('deploys a facotry and a cmapign', () => {
        assert.ok(factory.options.address)
        assert.ok(factory.options.address)
    })

    it('marks caller as campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    })

    it("allows people to contribute money and marks them as approvers", async () => {
        await campaign.methods.contribute().send({
            value: "200",
            from: accounts[1]
        })

        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor)
    })

    it("requires a minimum contribution", async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            })
            assert(false);
        } catch (err) {
            assert(err)
        }
    })
    it("allows a manger to make a payement request", async () => {
        await campaign.methods
            .createRequest('Buy batteries', '100', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            })
        const request = await campaign.methods.requests(0).call();
        assert("Buy batteries", request.description);
    });

    it('processes request', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        })
        await campaign.methods
            .createRequest('A', web3.utils.toWei("5", "ether"), accounts[1])
            .send({ from: accounts[0], gas: "1000000" });
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: "1000000"
        })

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, "ether");
        balance = parseFloat(balance) //convert string to float number
        console.log(balance);
        assert(balance > 104)
    })
})
