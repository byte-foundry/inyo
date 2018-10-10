export default `
    type NetworkStatus {
        isConnected: Boolean!
    }
    
    type Mutation {
		updateNetworkStatus(isConnected: Boolean!): NetworkStatus!

		# Stripe-related mutations

		createSubscription(plan: String!, quantity: Int, coupon: String): StripeSubscription!
		updateSubscription($id: ID!, $newPlan: String, $quantity: Int): StripeSubscription!
	}

	type Query {
		networkStatus: NetworkStatus!
	}
`;