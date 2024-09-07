import crypto from 'crypto';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

function generateKey() {
    const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    })

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)

    fs.writeFileSync(path.join(__dirname, '..', 'id_rsa_pub.pem'), publicKey)
    fs.writeFileSync(path.join(__dirname, '..', 'id_rsa_priv.pem'), privateKey)
    
}

generateKey()