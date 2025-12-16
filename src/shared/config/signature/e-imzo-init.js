import { EIMZOClient as client } from './e-imzo-client.js'

const CAPIWS = window.CAPIWS

export default class EIMZO {
  _loadedKey = null

  get loadedKey() {
    return this._loadedKey
  }

  set loadedKey(value) {
    this._loadedKey = value
  }

  async checkVersion() {
    return new Promise((resolve, reject) => {
      client.checkVersion(
        function (major, minor) {
          resolve({ major, minor })
        },
        function (error, message) {
          reject(error, message)
        }
      )
    })
  }

  async installApiKeys() {
    return new Promise((resolve, reject) => {
      client.installApiKeys(resolve, reject)
    })
  }

  async listAllUserKeys() {
    return new Promise((resolve, reject) => {
      client.listAllUserKeys(
        function (cert, index) {
          return 'cert-' + cert.serialNumber + '-' + index
        },
        function (index, cert) {
          return cert
        },
        function (items, firstId) {
          resolve(items, firstId)
        },
        function (error, reason) {
          reject(error, reason)
        }
      )
    })
  }

  async loadKey(cert) {
    return new Promise((resolve, reject) => {
      client.loadKey(
        cert,
        (id) => {
          this._loadedKey = cert
          resolve({ cert, id })
        },
        reject
      )
    })
  }

  async isCKCPLuggedIn() {
    return new Promise((resolve, reject) => {
      client.isCKCPLuggedIn((data) => {
        resolve(data)
      }, reject)
    })
  }

  async getCertificateChain(loadKeyId) {
    return new Promise((resolve, reject) => {
      CAPIWS.callFunction(
        {
          plugin: 'x509',
          name: 'get_certificate_chain',
          arguments: [loadKeyId],
        },
        (event, data) => {
          if (data.success) {
            resolve(data.certificates)
          } else {
            reject('Failed')
          }
        },
        reject
      )
    })
  }

  async getMainCertificate(loadKeyId) {
    let result = await this.getCertificateChain(loadKeyId)

    if (Array.isArray(result) && result.length > 0) {
      return result[0]
    }
    return null
  }

  async getCertInfo(cert) {
    return new Promise((resolve, reject) => {
      CAPIWS.callFunction(
        { name: 'get_certificate_info', arguments: [cert] },
        (event, data) => {
          if (data.success) {
            resolve(data.certificate_info)
          } else {
            reject('Failed')
          }
        },
        reject
      )
    })
  }

  async signPkcs7(cert, content) {
    let loadKeyResult = await this.loadKey(cert)

    return new Promise((resolve, reject) => {
      CAPIWS.callFunction(
        {
          name: 'create_pkcs7',
          plugin: 'pkcs7',
          arguments: [window.Base64.encode(content), loadKeyResult.id, 'no'],
        },
        (event, data) => {
          if (data.success) {
            resolve(data)
          } else {
            reject('Failed')
          }
        },
        reject
      )
    })
  }

  async createPkcs7(id, content, timestamper) {
    return new Promise((resolve, reject) => {
      client.createPkcs7(
        id,
        content,
        timestamper,
        (/* string */ pkcs7) => {
          resolve(pkcs7)
        },
        reject
      )
    })
  }

  async getTimestampToken(signature) {
    return new Promise((resolve, reject) => {
      CAPIWS.callFunction(
        {
          name: 'get_timestamp_token_request_for_signature',
          arguments: [signature],
        },
        function (event, data) {
          if (data.success) {
            resolve(data.timestamp_request_64)
          } else {
            reject('Failed')
          }
        },
        reject
      )
    })
  }

  addApiKey(domain, key) {
    if (!this.apiKeys.includes(domain)) {
      this.apiKeys.push(domain, key)
    }
  }

  async install() {
    await this.checkVersion()
    await this.installApiKeys()
  }
}
