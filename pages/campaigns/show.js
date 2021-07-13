import React, { Component } from 'react';
import { Button, Card, Grid, GridRow } from 'semantic-ui-react';
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3"
import ContributeForm from "../../components/ContributeForm"
import { Link } from "../../routes"


class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();

        return {
            address: props.query.address,
            minimunContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }
    renderCards() {
        const {
            balance,
            manager,
            minimunContribution,
            requestsCount,
            approversCount
        } = this.props
        const items = [
            {
                header: manager,
                meta: "Address of Manager",
                describtion: "The manager created this campaign and can create requests to withdraw money",
                style: { overflowWrap: "break-word" }
            },
            {
                header: minimunContribution,
                meta: "Mininmum Contribution (wei)",
                description: "You must contribute at least this muck wei to become an approver"
            },
            {
                header: requestsCount,
                meta: "Number of Requests",
                description: "A request tries to withdraw money from the contract.Requests must approved by approvers"
            },
            {
                header: approversCount,
                meta: "Number of Approvers",
                description: "Number of people who have already donated to this campaign"
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: "Campaign Balance (ether)",
                description: "The balance is how much money the campaign has left to spend"
            }
        ]
        return <Card.Group items={items} />
    }

    render() {
        return (
            <Layout>
                <h3>Campaign  Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>

                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address} />
                        </Grid.Column>
                    </Grid.Row>
                    <GridRow>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`} >
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </GridRow>
                </Grid>
            </Layout>
        )
    }
}

export default CampaignShow;