// md5-nanoid.ts
import crypto from 'crypto';

const ALPHABET =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * 生成基于 md5 的短 ID
 * @param input 任意字符串
 * @param size 输出长度（默认 10）
 * @returns 短 ID（Base62 编码）
 */
export function md5Nanoid(input: string, size: number = 10): string {
  // 1. 生成 md5
  const md5hex = crypto.createHash('md5').update(input).digest('hex');

  // 2. 转换为 BigInt
  let num = BigInt('0x' + md5hex);

  // 3. Base62 编码
  const base = BigInt(ALPHABET.length);
  let out = '';
  while (num > 0n) {
    out = ALPHABET[Number(num % base)] + out;
    num /= base;
  }

  // 4. 长度对齐
  if (out.length < size) out = ALPHABET[0].repeat(size - out.length) + out;
  return out.slice(-size); // 取末尾固定长度
}
