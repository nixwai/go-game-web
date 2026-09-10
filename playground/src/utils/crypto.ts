/** 解析 PEM 格式 RSA 公钥为 Web Crypto CryptoKey。 */
export async function importRSAPublicKey(pem: string): Promise<CryptoKey> {
  const base64 = pem
    .replace(/-----[^-]+-----/g, '')
    .replace(/\s/g, '');

  const binaryDer = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

  return crypto.subtle.importKey(
    'spki',
    binaryDer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt'],
  );
}

/** 使用 RSA-OAEP + SHA-256 加密文本并 base64 编码。 */
export async function encryptWithRSA(text: string, key: CryptoKey): Promise<string> {
  const encoded = new TextEncoder().encode(text);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    key,
    encoded,
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}
