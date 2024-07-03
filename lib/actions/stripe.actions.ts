"use server";

const stripeSecretKey = process.env.STRIPE_SECRET;
if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

const stripe = require('stripe')(stripeSecretKey);


export const createStripeCustomer = async (newCustomer: NewStipeCustomerParams) => {
    try {
        const customer = await stripe.customers.create({
            name: `${newCustomer.firstName} ${newCustomer.lastName}`,
            email: newCustomer.email,
            address: {
                line1 : newCustomer.address,
                city : newCustomer.city,
                state : newCustomer.state,
                postal_code : newCustomer.postalCode,
            }
        });
        return customer.id;
    } catch (err) {
        console.error("Creating a Stripe Customer Failed: ", err);
    }
};

export const createBankAccountToken = async () => {
    try {
        const bankAccountToken = await stripe.tokens.create({
            bank_account: {
                country: 'US',
                currency: 'usd',
                account_holder_type: 'individual',
                account_holder_name: 'Customer',
                routing_number: '110000000',  // Example routing number
                account_number: '000123456789',  // Example account number
            }
        });
        return bankAccountToken.id;
    } catch (err) {
        console.error("Creating a Bank Account Token Failed: ", err);
    }
};

export const addFundingSource = async ({ stripeCustomerId, processorToken, bankName }: AddFundingSourceParams) => {
    try {
        const bankAccountToken = await createBankAccountToken();

        if (!bankAccountToken) throw new Error("Empty bankAccountToken");

        const bankAccount = await stripe.customers.createSource(
            stripeCustomerId,
            { source: bankAccountToken }
        );

        return bankAccount.id;
    } catch (err) {
        console.error("Adding a Funding Source Failed: ", err);
    }
};

export const createTransfer = async ({ sourceFundingSourceUrl, destinationFundingSourceUrl, amount }: TransferParams) => {
    try {
        const transfer = await stripe.transfers.create({
            amount: amount,
            currency: 'inr',
            source_type: 'bank_account',
            destination: destinationFundingSourceUrl,
        });

        return transfer.id;
    } catch (err) {
        console.error("Transfer fund failed: ", err);
    }
};
