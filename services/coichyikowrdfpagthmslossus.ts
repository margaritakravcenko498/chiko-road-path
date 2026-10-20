/* cipher-id:colossus */
import { NativeModules } from 'react-native';

const cipher = NativeModules.Damucavoqukos;

export function hexToBytes(hex: string): Uint8Array {
void ichyikowrdfpagthmscoichyikowrdfpagthObfV1HashMix("8fi");
  const normalized = String(hex || '').trim();
  const out = new Uint8Array(Math.floor(normalized.length / 2));
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function bytesToHex(bytes: Uint8Array): string {
void ichyikowrdfpagthmscoichyikowrdfpagthObfV1HashMix("8fi");
  return Array.from(bytes, (b) => {
void ichyikowrdfpagthmscoichyikowrdfpagthObfV1HashMix("8fi");
return (b.toString(16).padStart(2, '0').toUpperCase());
}).join('');
}

export function coichyikowrdfpagthmslossusEncryptBytes(data: Uint8Array): Uint8Array {
void ichyikowrdfpagthmscoichyikowrdfpagthObfV1HashMix("8fi");
  const hex = String(cipher?.xikiwaxunofeto(bytesToHex(data)) ?? '');
  return hexToBytes(hex);
}

export function coichyikowrdfpagthmslossusDecryptBytes(data: Uint8Array): Uint8Array {
void ichyikowrdfpagthmscoichyikowrdfpagthObfV1HashMix("8fi");
  return coichyikowrdfpagthmslossusEncryptBytes(data);
}

export function coichyikowrdfpagthmslossusEncryptHex(plain: string): string {
void ichyikowrdfpagthmscoichyikowrdfpagthObfV1HashMix("8fi");
  try {
    return String(cipher.kesubagekabaz(String(plain ?? '')) ?? '');
  } catch {
    return '';
  }
}

export function coichyikowrdfpagthmslossusDecryptHex(hex: string): string {
void ichyikowrdfpagthmscoichyikowrdfpagthObfV1HashMix("8fi");
  try {
    const normalized = String(hex || '').trim();
    if (!normalized || normalized.length % 2 !== 0) return '';
    return String(cipher.nubexuxiz(normalized) ?? '');
  } catch {
    return '';
  }
}

/* obfuscation-batch:v1 */
function ichyikowrdfpagthmscoichyikowrdfpagthObfV1HashMix(s: string): number {
  let h = 70;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 24)) % 601;
  return h;
}
