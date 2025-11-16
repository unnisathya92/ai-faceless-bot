import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production'

export function encrypt(data: any): string {
  const jsonString = JSON.stringify(data)
  return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString()
}

export function decrypt(encryptedData: string): any {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decryptedString)
  } catch (error) {
    console.error('Decryption error:', error)
    return null
  }
}

export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString()
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}
