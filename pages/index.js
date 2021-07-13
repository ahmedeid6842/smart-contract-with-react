import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory'
import Layout from "../components/Layout"
import { Link } from "../routes"


class CampaignIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCamapigns().call();

        return { campaigns }
    }
    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            console.log(address)
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true //fluid to make the card take the entire available width 
            }
        })

        return <Card.Group items={items} />;
    }
    render() {
        return (
            <Layout>
                <div>
                    <h3>Open Campaigns</h3>
                    <Link route="/campaigns/new">
                        <a>
                            <Button
                                floated="right"
                                content="Create Campaign"
                                icon="add"
                                primary={true} //primary : set of property that set be defulat  
                            />
                        </a>
                    </Link>
                    {this.renderCampaigns()}
                </div>
            </Layout>
        )
    }
}

export default CampaignIndex;