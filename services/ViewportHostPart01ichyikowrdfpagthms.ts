// autosetup-split-begin
import { ViewportHostPart01ichyikowrdfpagthmsObfV27ByteFold, ichyikowrdfpagthmsViewportHostPart01ObfV31SumOdds, ichyikowrdfpagthmsViewportHostPart01ObfV31ClampMod, ichyikowrdfpagthmsViewportHostPart01ObfV31ShiftXor } from './ViewportHostPart01ichyikowrdfpagthmsPart01';
// autosetup-split-end

export function ichyikowrdfpagthmsViewportHostObfV15SumOdds(nums: number[]): number {
  let acc = 4;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 9) % 173;
  }
  return acc;
}

export function ichyikowrdfpagthmsViewportHostObfV14ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 2;
  return (x ^ 41) & 29117;
}

export function ichyikowrdfpagthmsViewportHostObfV11ClampMod(n: number, m: number): number {
  const span = (m % 27) + 6;
  const x = n % span;
  return x < 0 ? x + span : x;
}

export function ichyikowrdfpagthmsViewportHostObfV7SumOdds(nums: number[]): number {
  let acc = 11;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 5) % 211;
  }
  return acc;
}

export function ichyikowrdfpagthmsViewportHostObfV8HashMix(s: string): number {
  let h = 13;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 7)) % 307;
  return h;
}

export function ichyikowrdfpagthmsViewportHostObfV6ClampMod(n: number, m: number): number {
  const span = (m % 19) + 8;
  const x = n % span;
  return x < 0 ? x + span : x;
}

/* obfuscation-batch:v27 */

void ViewportHostPart01ichyikowrdfpagthmsObfV27ByteFold('k8');

/* obfuscation-batch:v28 */
function ichyikowrdfpagthmsViewportHostPart01prissmgecmObfV28Mix(a: number, b: number): number {
  const base = 51;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function ichyikowrdfpagthmsViewportHostPart01prissmgecmObfV28Fold(text: string): number {
  let acc = 51;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v29 */
function ichyikowrdfpagthmsViewportHostPart01pzurisymgeObfV29Mix(a: number, b: number): number {
  const base = 22;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function ichyikowrdfpagthmsViewportHostPart01pzurisymgeObfV29Fold(text: string): number {
  let acc = 22;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v30 */
function ichyikowrdfpagthmsViewportHostPart01dgpnrismgeObfV30Mix(a: number, b: number): number {
  const base = 24;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function ichyikowrdfpagthmsViewportHostPart01dgpnrismgeObfV30Fold(text: string): number {
  let acc = 24;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v31 */
void ichyikowrdfpagthmsViewportHostPart01ObfV31SumOdds([30, 25, 24]);
void ichyikowrdfpagthmsViewportHostPart01ObfV31ClampMod(67, 42);
void ichyikowrdfpagthmsViewportHostPart01ObfV31ShiftXor(29, 60);

/* obfuscation-batch:v32 */
function ichyikowrdfpagthmsViewportHostPart01ObfV32ClampMod(n: number, m: number): number {
  const span = (m % 27) + 9;
  const x = ((n ^ 1) << 5) % span;
  return x < 0 ? x + span : x;
}
function ichyikowrdfpagthmsViewportHostPart01ObfV32ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 3;
  return (x ^ 9) & 47061;
}
function ichyikowrdfpagthmsViewportHostPart01ObfV32ByteFold(s: string): number {
  let x = 31;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 34) & 42266;
  return x;
}
function ichyikowrdfpagthmsViewportHostPart01ObfV32HashMix(s: string): number {
  let h = 81;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 26)) % 722;
  return h;
}
void ichyikowrdfpagthmsViewportHostPart01ObfV32ClampMod(47, 54);
void ichyikowrdfpagthmsViewportHostPart01ObfV32ShiftXor(9, 40);
void ichyikowrdfpagthmsViewportHostPart01ObfV32ByteFold("f0d");
void ichyikowrdfpagthmsViewportHostPart01ObfV32HashMix("fk");
