export default `
    type NetworkStatus {
        isConnected: Boolean!
    }
    
    type Mutation {
		updateNetworkStatus(isConnected: Boolean!): NetworkStatus!
	}

	type Query {
		networkStatus: NetworkStatus!
		Template: Template
	}

	type Template {
		items: [String!]
	}
`;
