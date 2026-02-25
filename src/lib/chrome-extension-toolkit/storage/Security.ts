/* eslint-disable max-classes-per-file */
const { crypto } = globalThis;

/** the number of times the key_algo will be run on the password */
const ITERATIONS = 470_000;
/** the algorithm used to derive the password key from the password */
const KEY_ALGO = 'PBKDF2';
/** the algorithm used to derive the cipher key from the password key */
const HASH_ALGO = 'SHA-256';
/** the algorithm used to encrypt the data */
const CIPHER_MODE = 'AES-GCM';

/** the size of the cipher key */
const CIPHER_SIZE = 256;

/**
 * A class that provides encryption and decryption methods for use when storing data in the Stores provided by this library.
 */
export class Security {
    private encoder = new TextEncoder();
    private decoder = new TextDecoder();

    private cachedPasswordKey?: CryptoKey;

    public static MISSING_PASSWORD_ERROR_MESSAGE =
        'You must set the EXTENSION_STORAGE_PASSWORD environment variable to use encrypted storage.';

    /**
     * @returns the password key, either from the cache or by generating a new one from the password environment variable
     */
    private async getPasswordKey(): Promise<CryptoKey> {
        if (this.cachedPasswordKey) return this.cachedPasswordKey;

        if (!process.env.EXTENSION_STORAGE_PASSWORD) {
            throw new Error(Security.MISSING_PASSWORD_ERROR_MESSAGE);
        }

        const passwordBuffer = this.encoder.encode(process.env.EXTENSION_STORAGE_PASSWORD);
        this.cachedPasswordKey = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            { name: KEY_ALGO },
            false, // Not exportable
            ['deriveKey']
        );
        return this.cachedPasswordKey;
    }

    /**
     *  Derives a cipher key from the password key and salt
     * @param salt the salt to use when deriving the cipher key
     * @param passKey the password key to use when deriving the cipher key
     * @param KeyUsage the key usage for the cipher key (encrypt or decrypt)
     * @returns the cipher key which can be used to encrypt or decrypt data
     */
    private async deriveCipherKey(salt: Uint8Array, passKey: CryptoKey, KeyUsage: KeyUsage[]): Promise<CryptoKey> {
        return crypto.subtle.deriveKey(
            {
                name: KEY_ALGO,
                hash: HASH_ALGO,
                salt,
                iterations: ITERATIONS,
            },
            passKey,
            {
                name: CIPHER_MODE,
                length: CIPHER_SIZE,
            },
            false,
            KeyUsage
        );
    }

    /**
     * @returns a random salt buffer for use in encryption
     */
    private deriveSalt(): Uint8Array {
        return crypto.getRandomValues(new Uint8Array(BoxBuffer.SALT_SIZE));
    }

    /**
     * @returns a random IV buffer for use in encryption
     */
    private deriveIv(): Uint8Array {
        return crypto.getRandomValues(new Uint8Array(BoxBuffer.IV_SIZE));
    }

    /**
     * Decrypts a value that has been encrypted using the encrypt method
     * @param value the encrypted value to decrypt
     * @returns the decrypted value
     */
    async decrypt(value: any) {
        if (!value) return value;
        if (!isString(value)) return value;

        const passKey = await this.getPasswordKey();

        // read in the string into a boxBuffer, and separate the salt, iv and encrypted data from it
        const boxBuffer = BoxBuffer.fromBase64String(value);
        const salt = boxBuffer.getSalt();
        const iv = boxBuffer.getIv();
        const encryptedData = boxBuffer.getEncryptedData();

        // generate the decryption key
        const decryptionKey = await this.deriveCipherKey(salt, passKey, ['decrypt']);

        // decrypt the data using the decryption key
        const decryptedDataBuffer = await crypto.subtle.decrypt(
            {
                name: CIPHER_MODE,
                iv,
            },
            decryptionKey,
            encryptedData
        );

        // parse the decrypted data into a JSON object and return it
        return decryptedDataBuffer.byteLength === 0 ? undefined : JSON.parse(this.decoder.decode(decryptedDataBuffer));
    }

    /**
     * Encrypts a value using the password key derived from the EXTENSION_STORAGE_PASSWORD environment variable
     * @param value the value to encrypt
     * @returns the encrypted value as a base64 string
     */
    async encrypt(value: any): Promise<string> {
        let valueString = JSON.stringify(value);

        const passKey = await this.getPasswordKey();

        const salt = this.deriveSalt();
        const iv = this.deriveIv();

        const encryptionKey = await this.deriveCipherKey(salt, passKey, ['encrypt']);

        const encryptedData = new Uint8Array(
            await crypto.subtle.encrypt(
                {
                    name: CIPHER_MODE,
                    iv,
                },
                encryptionKey,
                this.encoder.encode(valueString)
            )
        );

        // create a boxBuffer to store the salt, iv and encrypted data together in a single buffer
        const bufferSize = BoxBuffer.PREFIX_SIZE + encryptedData.byteLength;

        const boxBuffer = new BoxBuffer(new Uint8Array(bufferSize));
        boxBuffer.setSalt(salt);
        boxBuffer.setIv(iv);
        boxBuffer.setEncryptedData(encryptedData);

        // return the boxBuffer as a base64 string (to make it easier to store)
        return boxBuffer.toBase64String();
    }
}

/**
 * A class representation of a buffer box in memory of the form:
 * [salt][iv][encrypted data]
 */
class BoxBuffer {
    private buffer: Uint8Array;
    static SALT_SIZE = 16;
    static IV_SIZE = 32;

    static get PREFIX_SIZE() {
        return BoxBuffer.SALT_SIZE + BoxBuffer.IV_SIZE;
    }

    constructor(buffer: Uint8Array) {
        this.buffer = buffer;
    }

    setSalt(salt: Uint8Array) {
        this.buffer.set(salt, 0);
    }

    setIv(iv: Uint8Array) {
        this.buffer.set(iv, BoxBuffer.SALT_SIZE);
    }

    setEncryptedData(encryptedData: Uint8Array) {
        this.buffer.set(encryptedData, BoxBuffer.PREFIX_SIZE);
    }

    getSalt(): Uint8Array {
        return this.buffer.slice(0, BoxBuffer.SALT_SIZE);
    }

    getIv(): Uint8Array {
        return this.buffer.slice(BoxBuffer.SALT_SIZE, BoxBuffer.PREFIX_SIZE);
    }

    getEncryptedData(): Uint8Array {
        return this.buffer.slice(BoxBuffer.PREFIX_SIZE);
    }

    toBase64String() {
        return globalThis.btoa(String.fromCharCode.apply(null, this.buffer as any));
    }

    static fromBase64String(base64String: string): BoxBuffer {
        const rawBuffer = Uint8Array.from(globalThis.atob(base64String), c => c.charCodeAt(0));
        return new BoxBuffer(rawBuffer);
    }
}

function isString(value: any): value is string {
    return typeof value === 'string' || value instanceof String;
}
