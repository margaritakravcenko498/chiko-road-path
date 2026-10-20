// autosetup-split-begin
import { ViewportHostPart03ObfV27ShiftXorichyikowrdfpagthms, ViewpichyikowrdfpagthmsortObfV15Mix, ViewportObfV15Fichyikowrdfpagthmsold, ichyikowrdfpagthmsViewportHostPartdgpnrismgemgObfV29Mix, ichyikowrdfpagthmsViewportHostPartdgpnrismgemgObfV29Fold } from './ViewportHostPart03Part01ichyikowrdfpagthms';
import { ichyikowrdfpagthmsViewportHopzurisymgeqmgallseObfV28Mix, ichyikowrdfpagthmsViewportHopzurisymgeqmgallseObfV28Fold } from './ViewportHoichyikowrdfpagthmsstPart03Part02';
// autosetup-split-end

export function ichyikowrdfpagthmsFoldRange(nums: number[]): number {
  let acc = 0;
  for (let i = 0; i < nums.length; i++) acc = (acc + nums[i]) & 65535;
  return acc;
}

export function ichyikowrdfpagthmsViewportHostObfV10ClampMod(n: number, m: number): number {
  const span = (m % 23) + 7;
  const x = n % span;
  return x < 0 ? x + span : x;
}

export function ichyikowrdfpagthmsVieObfV3HashMix(s: string): number {
  let h = 9;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 13)) % 251;
  return h;
}

export function ichyikowrdfpagthmsViewportHosObfV2HashMix(s: string): number {
  let h = 21;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 3) % 389;
  return h;
}

export function ichyikowrdfpagthmsViewportHostPart01ObfV14HashMix(s: string): number {
  let h = 6;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 19)) % 443;
  return h;
}

/* obfuscation-batch:v27 */

void ViewportHostPart03ObfV27ShiftXorichyikowrdfpagthms(14, 9);

/* obfuscation-batch:v15 */

/* obfuscation-batch:v28 */

/* obfuscation-batch:v29 */

/* obfuscation-batch:v30 */
function ichyikowrdfpagthmsViewportHostPpmvqkObfV30ByteFold(s: string): number {
  let x = 83;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 32) & 41021;
  return x;
}
function ichyikowrdfpagthmsViewportHostPpmvqkObfV30HashMix(s: string): number {
  let h = 29;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 33)) % 898;
  return h;
}
function ichyikowrdfpagthmsViewportHostPpmvqkObfV30SumOdds(nums: number[]): number {
  let acc = 78;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 19) % 215;
  }
  return acc;
}

/* obfuscation-batch:v31 */
function ichyikowrdfpagthmsViichyikowrdfpagthObfV31SumOdds(nums: number[]): number {
  let acc = 50;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 41) % 648;
  }
  return acc;
}
