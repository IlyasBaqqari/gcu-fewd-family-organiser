/**
 * This module will generate a public and private keypair and save to current directory
 * 
 * Make sure to save the private key elsewhere after generated!
 */
const crypto = require('crypto');
const fs = require('fs');

function genKeyPair() {

    // Generates an object where the keys are stored in properties `privateKey` and `publicKey`
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // bits - standard for RSA keys
        publicKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1" 
            format: 'pem' // Most common formatting choice
        },
        privateKeyEncoding: {
            type: 'pkcs1', // "Public Key Cryptography Standards 1"
            format: 'pem' // Most common formatting choice
        }
    });

    // Create the .env file content
    const envContent = `RSA_PUBLIC_KEY="${keyPair.publicKey.replace(/\n/g, '\\n')}"\nRSA_PRIVATE_KEY="${keyPair.privateKey.replace(/\n/g, '\\n')}"`;

    // Write to .env file
    fs.writeFileSync(__dirname + '/.env', envContent);

    console.log('Keys generated and saved to .env file');

}

// Generate the keypair
genKeyPair();