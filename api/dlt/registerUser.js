const {
	FileSystemWallet,
	X509WalletMixin,
	Gateway,
} = require("fabric-network");

const path = require("path");
const ccpPath = path.resolve(__dirname, "connection-org1.json");

async function main() {
	try {
		// create a new file system based wallet for managing identity
		const walletPath = path.join(process.cwd(), "wallet");
		const wallet = new FileSystemWallet(walletPath);
		console.log(`wallet path : ${walletPath}`);

		// check to see if we have already enrolled user
		const userExists = await wallet.exists("user1");
		if (userExists) {
			console.log(
				'an identity for user "user1" already exists in the wallet'
			);
			return;
		}

		// check to see if we've already enrolled the admin user
		const adminExists = await wallet.exists("admin");
		if (!adminExists) {
			console.log(
				`an identity for the admin user 'admin" does not exists in the wallet
				run the enrolladmin.js application before retrying`
			);
			return;
		}

		// create a new gateway for connecting to our peer node
		const gateway = new Gateway();
		await gateway.connect(ccpPath, {
			wallet,
			identity: "admin",
			discovery: { enabled: true, asLocalhost: true },
		});

		// get the ca client object from gateway for interacting with the CA
		const ca = gateway.getClient().getCertificateAuthority();
		const adminIdentity = gateway.getCurrentIdentity();

		// register the user and enroll the user and import the new identity into wallet
		const secret = await ca.register(
			{
				affiliation: "org1.department1",
				enrollmentID: "user1",
				role: "client",
			},
			adminIdentity
		);

		const enrollment = await ca.enroll({
			enrollmentID: "user1",
			enrollmentSecret: secret,
		});

		const userIdentity = X509WalletMixin.createIdentity(
			"Org1MSP",
			enrollment.certificate,
			enrollment.key.toBytes()
		);

		await wallet.import("user1", userIdentity);

		console.log(
			`successfully registered and enrolled admin user "user" and imported it into wallet`
		);
	} catch (error) {
		console.log("");
		process.exit(0);
	}
}

main();
