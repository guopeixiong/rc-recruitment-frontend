import JSEncrypt from '@/utils/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApBBF/rwwoZQOKEUFQnWqsX7/LHH4mjDoLIuZOGf5BFllBOoyNdYo8pbTqoTpdn4+LwgE0AL+TFI9PKV+vToyh4eHDwKmNliQBta/4QIA2bUZRu8Hj6xA45gBxdGXzrXqZVhnn7YV692uVcGZEsEWMIK3I79AA1wOrf+TwFMyaJaanu0sDGM7BTl4qXVFbVd3zxWilzZY2A5j84MivTPwpWj315SY2gSobxuY09Clu+Ixahw+VQtgrrq5arAowWRuhWqbDqA4JvWj4O0cMhp5uzcSHKXxjTH7OARUo0VlvRnLP/SJGfbYIZn3loXw+rvdtHsE4iBxCh9B/h3vzlw+JQIDAQAB'

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}