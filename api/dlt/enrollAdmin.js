const FabricCAService = require("fabric-ca-client");
const { FileSystemWallet, X509WalletMixin } = require("fabric-network");
const fs = require("fs");
const path = require("path");

const ccpPath = path.resolve(__dirname, "connection-org1.json");
const ccpJSON = fs.readFileSync(ccpPath, "utf8");
const ccp = JSON.parse(ccpJSON);

async function main() {
	try {
		// create a new ca client for interacting with the ca
		const caInfo = ccp.certificateAuthorities["ca.org1.example.com"];
		const caTLSCACerts = caInfo.tlsCACerts.pem;
		const ca = new FabricCAService(
			caInfo.url,
			{
				trustedRoots: caTLSCACerts,
				verify: false,
			},
			caInfo.caName
		);

		// create a new file system based wallet for managing identities
		const walletPath = path.join(process.cwd(), "wallet");
		const wallet = new FileSystemWallet(walletPath);
		console.log(`wallet path: ${walletPath}`);

		// check to see ig we've already enrolled the admin user.
		const adminExists = await wallet.exists("admin");
		if (adminExists) {
			console.log(
				'an identity for the admin user "admin" already exits in the wallet'
			);
			return;
		}

		// enrol the admin user and import the new identity into the wallet
		const enrollment = await ca.enroll({
			enrollmentID: "admin",
			enrollmentSecret: "adminpw",
		});
		const identity = X509WalletMixin.createIdentity(
			"Org1MSP",
			enrollment.certificate,
			enrollment.key.toBytes()
		);
		await wallet.import("admin", identity);
		console.log(
			"scuccessfully enrolled admin user 'admin' and imported it into the wallet"
		);
	} catch (error) {
		console.error(`failed to enroll admin user "Admin : ${error}`);
		process.exit(0);
	}
}

main();
