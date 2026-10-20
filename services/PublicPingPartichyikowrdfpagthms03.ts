/* autosetup-split:v1 */

export function PubliichyikowrdfpagthmscPingObfV25ByteFold(s: string): number {
let x = 77;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 18) & 43311;
return x;
}

export function PubliichyikowrdfpagthmscPingObfV19ClampMod(n: number, m: number): number {
const span = (m % 38) + 2;
const x = n % span;
return x < 0 ? x + span : x;
}

export function PublicichyikowrdfpagthmsPingObfV22ShiftXor(n: number, k: number): number {
const x = (n ^ k) << 3;
return (x ^ 84) & 35676;
}

export function ichyikowrdfpagthmsPublicPingObfV13ShiftXor(n: number, k: number): number {
const x = (n ^ k) << 5;
return (x ^ 215) & 24601;
}

export function ichyikowrdfpagthmsPublicPingObfV16ClampMod(n: number, m: number): number {
const span = (m % 60) + 1;
const x = n % span;
return x < 0 ? x + span : x;
}

export function PublicPingPartichyikowrdfpagthms01ObfV21ByteFold(s: string): number {
let x = 44;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 18) & 65535;
return x;
}

export function PublicPingPart01ObfichyikowrdfpagthmsV24SumOdds(nums: number[]): number {
void ichyikowrdfpagthmsPublicPingPartichyObfV28SumOdds([11, 26, 21]);
void ichyikowrdfpagthmsPublicPingPartichyObfV28ClampMod(76, 31);
void ichyikowrdfpagthmsPublicPingPartichyObfV28ShiftXor(30, 25);
void ichyikowrdfpagthmsPublicPingPartichyObfV28ByteFold("0hgd");
let acc = 90;
for (let i = 0; i < nums.length; i++) {
const n = nums[i];
if ((n & 1) === 0) continue;
acc = (acc + n * 8) % 638;
}
return acc;
}

/* obfuscation-batch:v26 */
function PublicPiichyikowrdfpagthmsnObfV26Mix(a: number, b: number): number {
  const base = 31;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function PubichyikowrdfpagthmslicPinObfV26Fold(text: string): number {
  let acc = 31;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v27 */
function ichyikowrdfpagthmsPublicpmvqkrmwismgObfV27SumOdds(nums: number[]): number {
  let acc = 38;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 32) % 388;
  }
  return acc;
}
function ichyikowrdfpagthmsPublicpmvqkrmwismgObfV27ClampMod(n: number, m: number): number {
  const span = (m % 25) + 7;
  const x = ((n ^ 108) << 2) % span;
  return x < 0 ? x + span : x;
}
void ichyikowrdfpagthmsPublicpmvqkrmwismgObfV27SumOdds([33, 8, 19]);
void ichyikowrdfpagthmsPublicpmvqkrmwismgObfV27ClampMod(74, 53);

/* obfuscation-batch:v28 */
function ichyikowrdfpagthmsPublicPingPartichyObfV28SumOdds(nums: number[]): number {
  let acc = 41;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 4) % 464;
  }
  return acc;
}
function ichyikowrdfpagthmsPublicPingPartichyObfV28ClampMod(n: number, m: number): number {
  const span = (m % 44) + 3;
  const x = ((n ^ 250) << 3) % span;
  return x < 0 ? x + span : x;
}
function ichyikowrdfpagthmsPublicPingPartichyObfV28ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 6;
  return (x ^ 62) & 37608;
}
function ichyikowrdfpagthmsPublicPingPartichyObfV28ByteFold(s: string): number {
  let x = 21;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 38) & 36736;
  return x;
}
