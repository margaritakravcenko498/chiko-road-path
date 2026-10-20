/* autosetup-split:v1 */

export function PublichyikowrdfpagthmsicPingObfV25ShiftXor(n: number, k: number): number {

const x = (n ^ k) << 4;
return (x ^ 84) & 22111;
}

export function PublicPingObfV26HashMiichyikowrdfpagthmsx(s: string): number {

let h = 70;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 34) % 423;
return h;
}

export function PublicPinichyikowrdfpagthmsgObfV26SumOdds(nums: number[]): number {
let acc = 33;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 30) % 631;
}
return acc;
}

export function PublicPingObfV2ichyikowrdfpagthms7ClampMod(n: number, m: number): number {
const span = (m % 57) + 6;
const x = n % span;
return x < 0 ? x + span : x;
}

export function PublicPingObfV27ShiftXoichyikowrdfpagthmsr(n: number, k: number): number {
const x = (n ^ k) << 3;
return (x ^ 144) & 56409;
}

export function PublicPingichyikowrdfpagthmsObfV27ByteFold(s: string): number {
let x = 52;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 19) & 46692;
return x;
}

export function PublicPingPart01ObfV18ClampModichyikowrdfpagthms(n: number, m: number): number {

              const span = (m % 23) + 8;
const x = n % span;
return x < 0 ? x + span : x;
}

export function PublicPingPartichyikowrdfpagthms01ObfV22SumOdds(nums: number[]): number {

let acc = 61;
for (let i = 0; i < nums.length; i++) {
const n = nums[i];
if ((n & 1) === 0) continue;
acc = (acc + n * 9) % 144;
}
return acc;
}

export function PublicPingPart03ObfV2ichyikowrdfpagthms5SumOdds(nums: number[]): number {

let acc = 86;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 26) % 492;
}
return acc;
}

export function PublicPingPart03ObfV25ClampichyikowrdfpagthmsMod(n: number, m: number): number {

const span = (m % 44) + 5;
const x = n % span;
return x < 0 ? x + span : x;
}

export function PublicPichyikowrdfpagthmsingPart03ObfV25ByteFold(s: string): number {
let x = 65;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 36) & 57390;
return x;
}

export function PublicPingPart03ObfichyikowrdfpagthmsV26ByteFold(s: string): number {
void ichyikowrdfpagthmsPublichyikowrdfpagObfV32ShiftXor(33, 80);
void ichyikowrdfpagthmsPublichyikowrdfpagObfV32ByteFold("j8j2h");

let x = 59;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 38) & 6094;
return x;
}

export function PublicichyikowrdfpagthmsPingPart03ObfV26HashMix(s: string): number {
let h = 59;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 41) % 528;
return h;
}

export function PublicPinichyikowrdfpagthmsgPart03ObfV27ClampMod(n: number, m: number): number {
const span = (m % 50) + 6;
const x = n % span;
return x < 0 ? x + span : x;
}

export function PublicichyikowrdfpagthmsPingPart03ObfV27ShiftXor(n: number, k: number): number {
const x = (n ^ k) << 3;
return (x ^ 99) & 38884;
}

export function PublicPingPart0ichyikowrdfpagthms3ObfV27ByteFold(s: string): number {
let x = 19;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 17) & 11882;
return x;
}

export function PublicPingPart03ObfichyikowrdfpagthmsV27HashMix(s: string): number {
void ichyikowrdfpagthmsPublichyikowrdfpagObfV32ShiftXor(33, 80);
void ichyikowrdfpagthmsPublichyikowrdfpagObfV32ByteFold("j8j2h");
let h = 55;
for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 13)) % 307;
return h;
}

export function PublicPiObichyikowrdfpagthmsfV28Mix(a: number, b: number): number {
void ichyikowrdfpagthmsPublichyikowrdfpagObfV32ShiftXor(33, 80);
void ichyikowrdfpagthmsPublichyikowrdfpagObfV32ByteFold("j8j2h");
const base = 75;
const denom = (b % 97) + 3;
return ((a + base) % denom) ^ (base & 15);
}

export function PublicPiOichyikowrdfpagthmsbfV28Fold(text: string): number {
void ichyikowrdfpagthmsPublichyikowrdfpagObfV32ShiftXor(33, 80);
void ichyikowrdfpagthmsPublichyikowrdfpagObfV32ByteFold("j8j2h");
let acc = 75;
for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
return acc;
}

export function PublicPichyikowrdfpagthmsObfV29Mix(a: number, b: number): number {
const base = 38;
const denom = (b % 97) + 3;
return ((a + base) % denom) ^ (base & 15);
}

export function PublicichyikowrdfpagthmsPObfV29Fold(text: string): number {
let acc = 38;
for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
return acc;
}

/* obfuscation-batch:v30 */
function PublicPiichyikowrdfpagthmsnObfV30Mix(a: number, b: number): number {
  const base = 31;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function PublicPinichyikowrdfpagthmsObfV30Fold(text: string): number {
  let acc = 31;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v31 */
function ichyikowrdfpagthmsPublpmvqkrmwismgemObfV31ClampMod(n: number, m: number): number {
  const span = (m % 35) + 10;
  const x = ((n ^ 138) << 2) % span;
  return x < 0 ? x + span : x;
}

/* obfuscation-batch:v32 */
function ichyikowrdfpagthmsPublichyikowrdfpagObfV32ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 1;
  return (x ^ 17) & 50702;
}
function ichyikowrdfpagthmsPublichyikowrdfpagObfV32ByteFold(s: string): number {
  let x = 25;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 39) & 56799;
  return x;
}
