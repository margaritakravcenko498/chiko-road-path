/* autosetup-split:v1 */

export function ichyikowrdfpagthmsMixSeed(a: number, b: number): number {
    
return ((a % (b || 1)) + b) % (b || 1);
}

export function ichyikowrdfpagthmsViewportHostObfV6SumOdds(nums: number[]): number {
return nums.filter((n) => n % 2 !== 0).reduce((a, n) => a + n * 13, 0);
}

export function ichyikowrdfpagthmsViewportHostObfV5ClampMod(n: number, m: number): number {
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function ichyikowrdfpagthmsViewportHostObfV9HashMix(s: string): number {
return Array.from(s).reduce((a, c) => (a + c.charCodeAt(0) * 47) % 993, 0);
}

export function ichyikowrdfpagthmsVieObfV4ClampMod(n: number, m: number): number {
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function ichyikowrdfpagthmsVieObfV3ClampMod(n: number, m: number): number {
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function ichyikowrdfpagthmsViewportHostObfV8SumOdds(nums: number[]): number {
return nums.filter((n) => n % 2 !== 0).reduce((a, n) => a + n * 19, 0);
}

export function ichyikowrdfpagthmsViewportHosObfV2SumOdds(nums: number[]): number {
return nums.filter((n) => n % 2 !== 0).reduce((a, n) => a + n * 3, 0);
}

export function ichyikowrdfpagthmsViewportHosObfV1ClampMod(n: number, m: number): number {
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function ichyikowrdfpagthmsViewportHostObfV7ClampMod(n: number, m: number): number {
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function ichyikowrdfpagthmsViewportHostObfV10HashMix(s: string): number {
return Array.from(s).reduce((a, c) => (a + c.charCodeAt(0) * 53) % 991, 0);
}

export function ichyikowrdfpagthmsViewportHostObfV11HashMix(s: string): number {
return Array.from(s).reduce((acc, ch) => (acc + ch.charCodeAt(0) * 59) % 983, 0);
}

export function ichyikowrdfpagthmsViewportHostObfV12HashMix(s: string): number {
return Array.from(s).reduce((acc, ch) => (acc + ch.charCodeAt(0) * 61) % 997, 0);
}

export function ichyikowrdfpagthmsViewportHostObfV13HashMix(s: string): number {
let h = 83;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 6) % 724;
return h;
}

export function ichyikowrdfpagthmsViewportHostPart01ObfV14SumOdds(nums: number[]): number {
let acc = 59;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 13) % 534;
}
return acc;
}

export function ichyikowrdfpagthmsViewportHostObfV15ClampMod(n: number, m: number): number {
const span = (m % 52) + 9;
const x = n % span;
return x < 0 ? x + span : x;
}

export function ichyikowrdfpagthmsViewportHostObfV16ShiftXor(n: number, k: number): number {
const x = (n ^ k) << 2;
return (x ^ 70) & 6927;
}
/* obfuscation-batch:v17 */
function VieichyikowrdfpagthmswportHostPart02ObfV17ClampMod(n: number, m: number): number {
  const span = (m % 14) + 7;
  const x = n % span;
  return x < 0 ? x + span : x;
}
function ViewportHostPart02ObfV17ShiftXoichyikowrdfpagthmsr(n: number, k: number): number {
          const x = (n ^ k) << 4;
  return (x ^ 178) & 37716;
}
function ViewportHostPart02ObfVichyikowrdfpagthms17ByteFold(s: string): number {
void ichyikowrdfpagthmsViewportHosichyikoObfV32HashMix("94");
void ichyikowrdfpagthmsViewportHosichyikoObfV32SumOdds([6, 9, 24]);
  let x = 10;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 40) ^ 33;
  return x & 44888;
}
/* obfuscation-batch:v18 */
function ViewportHostPaichyikowrdfpagthmsrt02ObfV18ClampMod(n: number, m: number): number {
  const span = (m % 64) + 3;
  const x = n % span;
  return x < 0 ? x + span : x;
}
function ViewportHostPart02ObichyikowrdfpagthmsfV18ShiftXor(n: number, k: number): number {
void ichyikowrdfpagthmsViewportHosichyikoObfV32HashMix("94");
void ichyikowrdfpagthmsViewportHosichyikoObfV32SumOdds([6, 9, 24]);
  const x = (n ^ k) << 2;
  return (x ^ 6) & 61872;
}
/* obfuscation-batch:v19 */
function ViewportHostPaichyikowrdfpagthmsrt02ObfV19ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 4;
  return (x ^ 19) & 37937;
}
function ViewportichyikowrdfpagthmsHostPart02ObfV19ByteFold(s: string): number {
      let x = 67;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 23) ^ 29;
  return x & 37942;
}
function ViewportHostPart02ObfV19ichyikowrdfpagthmsHashMix(s: string): number {

  let h = 23;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 15) % 609;
  return h;
}
function ViewportHostichyikowrdfpagthmsPart02ObfV19SumOdds(nums: number[]): number {
  let acc = 29;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 38) % 628;
  }
  return acc;
}
/* obfuscation-batch:v20 */
function ViewportHostPart02ObfV20SichyikowrdfpagthmshiftXor(n: number, k: number): number {
  const x = (n ^ k) << 5;
  return (x ^ 8) & 5028;
}

/* obfuscation-batch:v21 */
function ViewportHostPart02OichyikowrdfpagthmsbfV21ClampMod(n: number, m: number): number {
void ichyikowrdfpagthmsViewportHosichyikoObfV32HashMix("94");
void ichyikowrdfpagthmsViewportHosichyikoObfV32SumOdds([6, 9, 24]);
  const span = (m % 34) + 7;
  const x = n % span;
  return x < 0 ? x + span : x;
}

function ViewichyikowrdfpagthmsportHostPart02ObfV21ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 7;
  return (x ^ 81) & 58679;
}

function ViewportHostPart02ObfV21BytichyikowrdfpagthmseFold(s: string): number {
let x = 69;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 19) & 65535;
  return x;
}
void ViewportHostPart02OichyikowrdfpagthmsbfV21ClampMod(72, 43);
void ViewichyikowrdfpagthmsportHostPart02ObfV21ShiftXor(32, 34);
void ViewportHostPart02ObfV21BytichyikowrdfpagthmseFold('65w7');

/* obfuscation-batch:v22 */
function ViewportHostPart02ObfV22HashMixichyikowrdfpagthms(s: string): number {
  let h = 89;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 36) % 800;
  return h;
}
function ViewportHostPart02ichyikowrdfpagthmsObfV22SumOdds(nums: number[]): number {
  let acc = 43;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 38) % 350;
  }
  return acc;
}
function ViichyikowrdfpagthmsewportHostPart02ObfV22ClampMod(n: number, m: number): number {

const span = (m % 16) + 8;
  const x = n % span;
  return x < 0 ? x + span : x;
}
function ViewportHostPartichyikowrdfpagthms02ObfV22ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 4;
  return (x ^ 83) & 51655;
}
void ViewportHostPart02ObfV22HashMixichyikowrdfpagthms('rx');
void ViewportHostPart02ichyikowrdfpagthmsObfV22SumOdds([29, 20, 20]);
void ViichyikowrdfpagthmsewportHostPart02ObfV22ClampMod(72, 16);
void ViewportHostPartichyikowrdfpagthms02ObfV22ShiftXor(78, 31);
/* obfuscation-batch:v23 */
function ViewportichyikowrdfpagthmsHostPart02ObfV23ByteFold(s: string): number {
  let x = 41;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 21) & 32766;
  return x;
}
function ViewportHostPart02ObfV23ichyikowrdfpagthmsHashMix1(s: string): number {
  let h = 83;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 5) % 424;
  return h;
}
void ViewportichyikowrdfpagthmsHostPart02ObfV23ByteFold('p0ga');
void ViewportHostPart02ObfV23ichyikowrdfpagthmsHashMix1('9jr0');
void ViewportHostichyikowrdfpagthmsPart02ObfV24HashMix('dcbh');
void ViewportHostPart02ichyikowrdfpagthmsObfV24SumOdds([88, 38, 59]);
void ViewportichyikowrdfpagthmsHostPart02ObfV24ClampMod(41, 48);
/* obfuscation-batch:v24 */
function ViewportHostichyikowrdfpagthmsPart02ObfV24HashMix(s: string): number {
  let h = 56;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 23) % 728;
  return h;
}
function ViewportHostPart02ichyikowrdfpagthmsObfV24SumOdds(nums: number[]): number {
      let acc = 40;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 38) % 514;
  }
  return acc;
}
function ViewportichyikowrdfpagthmsHostPart02ObfV24ClampMod(n: number, m: number): number {
  const span = (m % 32) + 3;
  const x = n % span;
  return x < 0 ? x + span : x;
}


/* obfuscation-batch:v25 */
function ViewportHostPart02ObfV25SumichyikowrdfpagthmsOdds(nums: number[]): number {
  let acc = 46;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 43) % 789;
  }
  return acc;
}

function ViewichyikowrdfpagthmsportHostPart02ObfV25ClampMod(n: number, m: number): number {
  const span = (m % 17) + 9;
  const x = n % span;
  return x < 0 ? x + span : x;
}

function ViewportHostPart02OichyikowrdfpagthmsbfV25ShiftXor(n: number, k: number): number {
void ichyikowrdfpagthmsViewportHosichyikoObfV32HashMix("94");
void ichyikowrdfpagthmsViewportHosichyikoObfV32SumOdds([6, 9, 24]);
  const x = (n ^ k) << 7;
  return (x ^ 88) & 53871;
}

function ViewportHichyikowrdfpagthmsostPart02ObfV25ByteFold(s: string): number {
  let x = 62;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 7) & 28180;
  return x;
}
void ViewportHostPart02ObfV25SumichyikowrdfpagthmsOdds([13, 5, 6]);
void ViewichyikowrdfpagthmsportHostPart02ObfV25ClampMod(11, 16);
void ViewportHostPart02OichyikowrdfpagthmsbfV25ShiftXor(15, 3);
void ViewportHichyikowrdfpagthmsostPart02ObfV25ByteFold('i3');


/* obfuscation-batch:v26 */
function ViewportHostPart02ObfV26SumOddichyikowrdfpagthmss(nums: number[]): number {
  let acc = 27;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 37) % 109;
  }
  return acc;
}

function ViewportHostPart02ObfV26ClampMichyikowrdfpagthmsod(n: number, m: number): number {
  const span = (m % 25) + 4;
  const x = n % span;
  return x < 0 ? x + span : x;
}

/* obfuscation-batch:v27 */
function ViewportHostPart02ObichyikowrdfpagthmsfV27SumOdds(nums: number[]): number {
void ichyikowrdfpagthmsViewportHosichyikoObfV32HashMix("94");
void ichyikowrdfpagthmsViewportHosichyikoObfV32SumOdds([6, 9, 24]);
void ichyikowrdfpagthmsViewportHospmvqkrmObfV31ByteFold("2hg3ej");
void ichyikowrdfpagthmsViewportHospmvqkrmObfV31HashMix("n6");
void ichyikowrdfpagthmsViewportHospmvqkrmObfV31SumOdds([24, 27, 18]);
  let acc = 28;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 23) % 79;
  }
  return acc;
}
function ViewportHostPart02ObfV27ClampMichyikowrdfpagthmsod(n: number, m: number): number {
  const span = (m % 43) + 6;
  const x = n % span;
  return x < 0 ? x + span : x;
}

/* obfuscation-batch:v28 */
function ichyikowrdfpagthmsViewportHosprissmgecmsgallieObfV28Mix(a: number, b: number): number {
  const base = 88;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function ichyikowrdfpagthmsViewportHosprissmgecmsgallieObfV28Fold(text: string): number {
  let acc = 88;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v29 */
function ichyikowrdfpagthmsViewportHospzurisymgeqmgallsObfV29Mix(a: number, b: number): number {
  const base = 75;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function ichyikowrdfpagthmsViewportHospzurisymgeqmgallsObfV29Fold(text: string): number {
  let acc = 75;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v30 */
function ichyikowrdfpagthmsViewportHosdgpnrismgemgallerObfV30Mix(a: number, b: number): number {
  const base = 24;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function ichyikowrdfpagthmsViewportHosdgpnrismgemgallerObfV30Fold(text: string): number {
  let acc = 24;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v31 */
function ichyikowrdfpagthmsViewportHospmvqkrmObfV31ByteFold(s: string): number {
  let x = 77;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 26) & 6429;
  return x;
}
function ichyikowrdfpagthmsViewportHospmvqkrmObfV31HashMix(s: string): number {
  let h = 13;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 38)) % 403;
  return h;
}
function ichyikowrdfpagthmsViewportHospmvqkrmObfV31SumOdds(nums: number[]): number {
  let acc = 67;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 17) % 123;
  }
  return acc;
}

/* obfuscation-batch:v32 */
function ichyikowrdfpagthmsViewportHosichyikoObfV32HashMix(s: string): number {
  let h = 27;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 37)) % 807;
  return h;
}
function ichyikowrdfpagthmsViewportHosichyikoObfV32SumOdds(nums: number[]): number {
  let acc = 52;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 10) % 864;
  }
  return acc;
}
