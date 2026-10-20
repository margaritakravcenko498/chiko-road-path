/* autosetup-split:v1 */

export function ichyikowrdfpagthmsVieObfV4HashMix(s: string): number {
return Array.from(s).reduce((a, c) => (a + c.charCodeAt(0) * 29) % 977, 0);
}

export function ichyikowrdfpagthmsViewportHosObfV1HashMix(s: string): number {
return Array.from(s).reduce((a, c) => (a + c.charCodeAt(0) * 17) % 997, 0);
}

export function ichyikowrdfpagthmsViewportHosObfV2ClampMod(n: number, m: number): number {
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function ichyikowrdfpagthmsViewportHostObfV9ClampMod(n: number, m: number): number {
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function ichyikowrdfpagthmsViewportHostObfV12ClampMod(n: number, m: number): number {
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function ichyikowrdfpagthmsViewportHostObfV15ByteFold(s: string): number {
let x = 29;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 14) ^ 170;
return x & 5709;
}
/* obfuscation-batch:v17 */
function ViewportHostPart02ObfVichyikowrdfpagthms17ByteFold(s: string): number {
void ichyikowrdfpagthmsViewportHostPaichyObfV32ByteFold("ng7g");
void ichyikowrdfpagthmsViewportHostPaichyObfV32HashMix("mlm34");
  let x = 80;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 21) ^ 106;
  return x & 6323;
}
void ViewportHostPart02ObfVichyikowrdfpagthms17ByteFold('fkvg');
/* obfuscation-batch:v18 */
function ViewportHostPichyikowrdfpagthmsart02ObfV18ByteFold(s: string): number {
  let x = 35;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 30) ^ 114;
  return x & 48365;
}
function ViewportHostPart02ObfV1ichyikowrdfpagthms8HashMix(s: string): number {
  let h = 56;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 14) % 796;
  return h;
}
void ViewportHostPichyikowrdfpagthmsart02ObfV18ByteFold('92m');
void ViewportHostPart02ObfV1ichyikowrdfpagthms8HashMix('nf66');
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
  const x = (n ^ k) << 4;
  return (x ^ 146) & 28064;
}

/* obfuscation-batch:v21 */
function ViewportHostPart02OichyikowrdfpagthmsbfV21ClampMod(n: number, m: number): number {
void ichyikowrdfpagthmsViewportHostPaichyObfV32ByteFold("ng7g");
void ichyikowrdfpagthmsViewportHostPaichyObfV32HashMix("mlm34");
  const span = (m % 27) + 7;
  const x = n % span;
  return x < 0 ? x + span : x;
}

function ViewichyikowrdfpagthmsportHostPart02ObfV21ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 6;
  return (x ^ 123) & 46424;
}
void ViewportHostPart02OichyikowrdfpagthmsbfV21ClampMod(23, 18);
void ViewichyikowrdfpagthmsportHostPart02ObfV21ShiftXor(60, 40);

/* obfuscation-batch:v22 */
function ViichyikowrdfpagthmsewportHostPart02ObfV22ClampMod(n: number, m: number): number {

const span = (m % 34) + 5;
  const x = n % span;
  return x < 0 ? x + span : x;
}
function ViewportHostPartichyikowrdfpagthms02ObfV22ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 3;
  return (x ^ 186) & 47522;
}
void ViichyikowrdfpagthmsewportHostPart02ObfV22ClampMod(15, 71);
void ViewportHostPartichyikowrdfpagthms02ObfV22ShiftXor(65, 26);
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
void ViewportHosichyikowrdfpagthmstPart02ObfV24ShiftXor(31, 6);
/* obfuscation-batch:v24 */
function ViewportHosichyikowrdfpagthmstPart02ObfV24ShiftXor(n: number, k: number): number {
        const x = (n ^ k) << 4;
  return (x ^ 95) & 14170;
}


/* obfuscation-batch:v25 */
function ViewichyikowrdfpagthmsportHostPart02ObfV25ClampMod(n: number, m: number): number {
  const span = (m % 47) + 8;
  const x = n % span;
  return x < 0 ? x + span : x;
}

function ViewportHostPart02OichyikowrdfpagthmsbfV25ShiftXor(n: number, k: number): number {
void ichyikowrdfpagthmsViewportHostPaichyObfV32ByteFold("ng7g");
void ichyikowrdfpagthmsViewportHostPaichyObfV32HashMix("mlm34");
  const x = (n ^ k) << 6;
  return (x ^ 159) & 54900;
}
void ViewichyikowrdfpagthmsportHostPart02ObfV25ClampMod(56, 52);
void ViewportHostPart02OichyikowrdfpagthmsbfV25ShiftXor(14, 28);


/* obfuscation-batch:v26 */
function ViewportHostPaichyikowrdfpagthmsrt02ObfV26ByteFold(s: string): number {
  let x = 19;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 47) & 61698;
  return x;
}

function ViewportHostPart02ObfichyikowrdfpagthmsV26HashMix(s: string): number {
void ichyikowrdfpagthmsViewportHostPaichyObfV32ByteFold("ng7g");
void ichyikowrdfpagthmsViewportHostPaichyObfV32HashMix("mlm34");
  let h = 76;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 47) % 880;
  return h;
}

function ViewportHostPart02ObfV26SumOddichyikowrdfpagthmss(nums: number[]): number {
  let acc = 81;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 23) % 408;
  }
  return acc;
}

/* obfuscation-batch:v27 */
function ViewportHostPart02ObfVichyikowrdfpagthms27HashMix(s: string): number {
void ichyikowrdfpagthmsViewportHostPaichyObfV32ByteFold("ng7g");
void ichyikowrdfpagthmsViewportHostPaichyObfV32HashMix("mlm34");
  let h = 42;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 7)) % 423;
  return h;
}
function ViewportHostPart02ObichyikowrdfpagthmsfV27SumOdds(nums: number[]): number {
void ichyikowrdfpagthmsViewportHostPaichyObfV32ByteFold("ng7g");
void ichyikowrdfpagthmsViewportHostPaichyObfV32HashMix("mlm34");
void ichyikowrdfpagthmsViewportHostPapmvqObfV31HashMix("leh4l");
void ichyikowrdfpagthmsViewportHostPapmvqObfV31SumOdds([37, 28, 7]);
void ichyikowrdfpagthmsViewportHostPapmvqObfV31ClampMod(54, 49);
void ichyikowrdfpagthmsViewportHostPapmvqObfV31ShiftXor(40, 75);
  let acc = 16;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 17) % 444;
  }
  return acc;
}

/* obfuscation-batch:v28 */
function ichyikowrdfpagthmsViewportHostPaprissmgecmsgalObfV28Mix(a: number, b: number): number {
  const base = 67;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function ichyikowrdfpagthmsViewportHostPaprissmgecmsgalObfV28Fold(text: string): number {
  let acc = 67;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v29 */
function ichyikowrdfpagthmsViewportHostPapzurisymgeqmgaObfV29Mix(a: number, b: number): number {
  const base = 37;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function ichyikowrdfpagthmsViewportHostPapzurisymgeqmgaObfV29Fold(text: string): number {
  let acc = 37;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v30 */
function ichyikowrdfpagthmsViewportHostPadgpnrismgemgalObfV30Mix(a: number, b: number): number {
  const base = 34;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function ichyikowrdfpagthmsViewportHostPadgpnrismgemgalObfV30Fold(text: string): number {
  let acc = 34;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v31 */
function ichyikowrdfpagthmsViewportHostPapmvqObfV31HashMix(s: string): number {
  let h = 5;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 9)) % 634;
  return h;
}
function ichyikowrdfpagthmsViewportHostPapmvqObfV31SumOdds(nums: number[]): number {
  let acc = 26;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 31) % 151;
  }
  return acc;
}
function ichyikowrdfpagthmsViewportHostPapmvqObfV31ClampMod(n: number, m: number): number {
  const span = (m % 35) + 4;
  const x = ((n ^ 236) << 7) % span;
  return x < 0 ? x + span : x;
}
function ichyikowrdfpagthmsViewportHostPapmvqObfV31ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 4;
  return (x ^ 122) & 29070;
}

/* obfuscation-batch:v32 */
function ichyikowrdfpagthmsViewportHostPaichyObfV32ByteFold(s: string): number {
  let x = 62;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 28) & 2103;
  return x;
}
function ichyikowrdfpagthmsViewportHostPaichyObfV32HashMix(s: string): number {
  let h = 72;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 13)) % 457;
  return h;
}
