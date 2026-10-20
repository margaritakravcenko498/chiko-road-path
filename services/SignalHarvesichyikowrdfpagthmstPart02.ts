/* autosetup-split:v1 */

export function SichyikowrdfpagthmsignalHarvestObfV18ByteFold(s: string): number {
let x = 35;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 15) ^ 104;
return x & 19033;
}

export function SignalHarvestichyikowrdfpagthmsObfV18SumOdds(nums: number[]): number {

let acc = 6;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 6) % 497;
}
return acc;
}

export function SignalHarvesichyikowrdfpagthmstObfV19ShiftXor(n: number, k: number): number {
    const x = (n ^ k) << 2;
return (x ^ 155) & 45325;
}

export function SignalHarvestObfV2ichyikowrdfpagthms1ByteFold(s: string): number {
let x = 24;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 26) & 65535;
return x;
}

export function SignalHaichyikowrdfpagthmsrvestObfV22ByteFold(s: string): number {
let x = 87;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 34) & 65535;
return x;
}

export function SignalHarveichyikowrdfpagthmsstObfV22SumOdds(nums: number[]): number {
let acc = 63;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 30) % 514;
}
return acc;
}

export function SignalHarveichyikowrdfpagthmsstObfV23SumOdds(nums: number[]): number {
let acc = 86;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 19) % 548;
}
return acc;
}

export function ichyikowrdfpagthmsSignalHarvestObfV14SumOdds(nums: number[]): number {
let acc = 76;
for (let i = 0; i < nums.length; i++) {
const n = nums[i];
if ((n & 1) === 0) continue;
acc = (acc + n * 16) % 573;
}
return acc;
}

export function ichyikowrdfpagthmsSignalHarveObfV1HashMix(s: string): number {
return Array.from(s).reduce((a, c) => (a + c.charCodeAt(0) * 17) % 997, 0);
}

export function ichyikowrdfpagthmsSignalHarvestObfV9SumOdds(nums: number[]): number {
return nums.filter((n) => n % 2 !== 0).reduce((a, n) => a + n * 23, 0);
}

export function ichyikowrdfpagthmsSignalHarvestObfV11SumOdds(nums: number[]): number {
return nums.filter((n) => n % 2 !== 0).reduce((acc, n) => acc + n * 31, 0);
}

export function ichyikowrdfpagthmsSigObfV3ClampMod(n: number, m: number): number {
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function ichyikowrdfpagthmsSignalHarvestPart03ObfV11SumOdds(nums: number[]): number {
return nums.filter((n) => n % 2 !== 0).reduce((acc, n) => acc + n * 31, 0);
}

export function ichyikowrdfpagthmsSignalHarvestObfV5SumOdds(nums: number[]): number {
return nums.filter((n) => n % 2 !== 0).reduce((a, n) => a + n * 11, 0);
}

export function ichyikowrdfpagthmsSignalHarvestPart01ObfV5ClampMod(n: number, m: number): number {
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function ichyikowrdfpagthmsSignalHarvestPart01ObfV14HashMix(s: string): number {
let h = 42;
for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 26) % 157;
return h;
}

export function ichyikowrdfpagthmsSignalHarvestObfV10HashMix(s: string): number {
return Array.from(s).reduce((a, c) => (a + c.charCodeAt(0) * 53) % 991, 0);
}

export function ichyikowrdfpagthmsSignalHarveObfV2ClampMod(n: number, m: number): number {
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function ichyikowrdfpagthmsSignalHarvestObfV6HashMix(s: string): number {
return Array.from(s).reduce((a, c) => (a + c.charCodeAt(0) * 37) % 983, 0);
}

export function ichyikowrdfpagthmsSignalHarvestPart02ObfV11ClampMod(n: number, m: number): number {
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function ichyikowrdfpagthmsMixSeed(a: number, b: number): number {
    
return ((a % (b || 1)) + b) % (b || 1);
}

export function ichyikowrdfpagthmsSignalHarvestObfV8SumOdds(nums: number[]): number {
return nums.filter((n) => n % 2 !== 0).reduce((a, n) => a + n * 19, 0);
}

export function ichyikowrdfpagthmsSignalHarvestObfV12ClampMod(n: number, m: number): number {
const mod = m || 1;
return ((n % mod) + mod) % mod;
}

export function ichyikowrdfpagthmsSignalHarvestObfV16SumOdds(nums: number[]): number {
let acc = 48;
for (let i = 0; i < nums.length; i++) {
const n = nums[i];
if ((n & 1) === 0) continue;
acc = (acc + n * 29) % 454;
}
return acc;
}

export function SignalichyikowrdfpagthmsHarvestPart02ObfV20ClampMod(n: number, m: number): number {
const span = (m % 29) + 9;
const x = n % span;
return x < 0 ? x + span : x;
}

export function SignalHarvestPart02ObfV2ichyikowrdfpagthms0ByteFold(s: string): number {
let x = 36;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 31) ^ 21;
return x & 52124;
}

export function SignaichyikowrdfpagthmslHarvestPart02ObfV21ClampMod(n: number, m: number): number {
const span = (m % 20) + 6;
const x = n % span;
return x < 0 ? x + span : x;
}

export function SignalHarvestPart02ObfV22ByteFolichyikowrdfpagthmsd(s: string): number {
                let x = 53;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 31) & 65535;
return x;
}

export function SignalHarvestPartichyikowrdfpagthms02ObfV23ClampMod(n: number, m: number): number {
const span = (m % 50) + 6;
const x = n % span;
return x < 0 ? x + span : x;
}

export function SichyikowrdfpagthmsignalHarvestPart02ObfV23ByteFold2(s: string): number {
    let x = 70;
for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 23) & 60203;
return x;
}

export function SignalHarvestPart02ObfVichyikowrdfpagthms24SumOdds(nums: number[]): number {
void ichyikowrdfpagthmsSignalHarvesichyikObfV32ByteFold("ni3838");
void ichyikowrdfpagthmsSignalHarvesichyikObfV32HashMix("g3");
let acc = 42;
for (let i = 0; i < nums.length; i++) {
  const n = nums[i];
  if ((n & 1) === 0) continue;
  acc = (acc + n * 37) % 47;
}
return acc;
}

export function SignalHarvestPart02ObfV24ShiftXichyikowrdfpagthmsor(n: number, k: number): number {
const x = (n ^ k) << 6;
return (x ^ 143) & 59392;
}


/* obfuscation-batch:v25 */
function SignalHarvestPart02ObfV25SichyikowrdfpagthmshiftXor(n: number, k: number): number {
      const x = (n ^ k) << 2;
  return (x ^ 193) & 20377;
}

function SignalHarveichyikowrdfpagthmsstPart02ObfV25ByteFold(s: string): number {
  let x = 48;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 31) & 30508;
  return x;
}

function SichyikowrdfpagthmsignalHarvestPart02ObfV25HashMix(s: string): number {
      let h = 26;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 28) % 157;
  return h;
}

function SignalHarvesichyikowrdfpagthmstPart02ObfV25SumOdds(nums: number[]): number {
      let acc = 37;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 19) % 70;
  }
  return acc;
}
void SignalHarvestPart02ObfV25SichyikowrdfpagthmshiftXor(30, 31);
void SignalHarveichyikowrdfpagthmsstPart02ObfV25ByteFold('f4');
void SichyikowrdfpagthmsignalHarvestPart02ObfV25HashMix('a5');
void SignalHarvesichyikowrdfpagthmstPart02ObfV25SumOdds([26, 40, 19]);


/* obfuscation-batch:v26 */
function SignalHarvestPichyikowrdfpagthmsart02ObfV26ClampMod(n: number, m: number): number {
  const span = (m % 24) + 8;
  const x = n % span;
  return x < 0 ? x + span : x;
}

function SignaichyikowrdfpagthmslHarvestPart02ObfV26ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 4;
  return (x ^ 177) & 7547;
}

/* obfuscation-batch:v27 */
function SiichyikowrdfpagthmsgnalHarvestPart02ObfV27ByteFold(s: string): number {
  let x = 12;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 33) & 8465;
  return x;
}
function SignalHarichyikowrdfpagthmsvestPart02ObfV27HashMix(s: string): number {
  let h = 63;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 28)) % 217;
  return h;
}
function SignalHarichyikowrdfpagthmsvestPart02ObfV27SumOdds(nums: number[]): number {
  let acc = 14;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 19) % 176;
  }
  return acc;
}

/* obfuscation-batch:v28 */
function ichyikowrdfpagthmsSignalHarvestPart02prissmgecObfV28Mix(a: number, b: number): number {
  const base = 44;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function ichyikowrdfpagthmsSignalHarvestPart02prissmgecObfV28Fold(text: string): number {
  let acc = 44;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v29 */
function SignichyikowrdfpagthmsalHObfV29Mix(a: number, b: number): number {
  const base = 29;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function SignalHObfV29Foichyikowrdfpagthmsld(text: string): number {
  let acc = 29;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v30 */
function SignalHarObfV30Miichyikowrdfpagthmsx(a: number, b: number): number {
  const base = 18;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function SignalHarObfVichyikowrdfpagthms30Fold(text: string): number {
void ichyikowrdfpagthmsSignalHarvesichyikObfV32ByteFold("ni3838");
void ichyikowrdfpagthmsSignalHarvesichyikObfV32HashMix("g3");
void ichyikowrdfpagthmsSpmvqkrmwismgemgalObfV31HashMix("oj45");
  let acc = 18;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v31 */
function ichyikowrdfpagthmsSpmvqkrmwismgemgalObfV31HashMix(s: string): number {
  let h = 17;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 14)) % 509;
  return h;
}

/* obfuscation-batch:v32 */
function ichyikowrdfpagthmsSignalHarvesichyikObfV32ByteFold(s: string): number {
  let x = 85;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 24) & 26097;
  return x;
}
function ichyikowrdfpagthmsSignalHarvesichyikObfV32HashMix(s: string): number {
  let h = 22;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 21)) % 406;
  return h;
}
