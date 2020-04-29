const { FileSystemWallet, Gateway } = require("fabric-network");
const path = require("path");
const ccpPath = path.resolve(__dirname, "connection-org1.json");

let createRequest = async (data) => {
	try {
		// create a new file system based wallet for managing identities
		const walletPath = path.join(__dirname, "wallet");
		const wallet = new FileSystemWallet(walletPath);
		console.log(`wallet path: ${walletPath}`);

		// check to see if we have already enrolled user
		const userExists = await wallet.exists("user1");
		if (!userExists) {
			console.log(`
            an identity for user "user1" does not exists in wallet
            run registeruser.js app before retrying
            `);
			return;
		}

		// create a new gateway for connecting to our peer node
		const gateway = new Gateway();
		await gateway.connect(ccpPath, {
			wallet,
			identity: "user1",
			discovery: { enabled: true, asLocalhost: true },
		});

		// get the network (channel) our contract is deployed to
		const network = await gateway.getNetwork("mychannel");

		// get the contract from network
		const contract = network.getContract("epass");

		// submit the specified txn
		let result = await contract.submitTransaction(
			"createRequest",
			JSON.stringify(data)
		);
		console.log(result.toString());
		console.log(`txn submitted`);
		await gateway.disconnect();
	} catch (error) {
		console.log();
		process.exit(0);
	}
};

let approveRequest = async (tokenId, approver) => {
	try {
		// create a new file system based wallet for managing identities
		const walletPath = path.join(__dirname, "wallet");
		const wallet = new FileSystemWallet(walletPath);
		console.log(`wallet path: ${walletPath}`);

		// check to see if we have already enrolled user
		const userExists = await wallet.exists("user1");
		if (!userExists) {
			console.log(`
            an identity for user "user1" does not exists in wallet
            run registeruser.js app before retrying
            `);
			return;
		}

		// create a new gateway for connecting to our peer node
		const gateway = new Gateway();
		await gateway.connect(ccpPath, {
			wallet,
			identity: "user1",
			discovery: { enabled: true, asLocalhost: true },
		});

		// get the network (channel) our contract is deployed to
		const network = await gateway.getNetwork("mychannel");

		// get the contract from network
		const contract = network.getContract("epass");

		// submit the specified txn
		let result = await contract.submitTransaction(
			"approveRequest",
			tokenId,
			approver
		);
		console.log(result.toString());
		console.log(`txn submitted`);
		await gateway.disconnect();
	} catch (error) {
		console.log();
		process.exit(0);
	}
};

module.exports = {
	createRequest,
	approveRequest,
};
