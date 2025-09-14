import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

function encrypt(text, passphrase) {
    // Create a key from the passphrase using SHA-256
    const key = crypto.createHash('sha256').update(passphrase).digest();
    
    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher with IV
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt the text
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Combine IV and encrypted data, then encode as base64
    const combined = Buffer.concat([iv, Buffer.from(encrypted, 'hex')]);
    return combined.toString('base64');
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length !== 2) {
        console.error('Usage: node encrypt.js <text-to-encrypt> <passphrase>');
        console.error('Example: node encrypt.js "127.0.0.1" "mypassword"');
        process.exit(1);
    }
    
    const [textToEncrypt, passphrase] = args;
    
    try {
        const encrypted = encrypt(textToEncrypt, passphrase);
        console.log('Encrypted value:');
        console.log(encrypted);
    } catch (error) {
        console.error('Encryption failed:', error);
        process.exit(1);
    }
}

main();