import { NativeModules } from 'react-native';

const intake = NativeModules.Dekuxaferazuwi;

export async function ichyikowrdfpagthmsAssembleIntake(
  fields: string[],
  bodyPlain: string,
): Promise<string> {
void ichyikowrdfpagthmsichyikowrdfpagthmsObfV1ShiftXor(62, 25);
void ichyikowrdfpagthmsichyikowrdfpagthmsObfV1ByteFold("g1");
void ichyikowrdfpagthmsichyikowrdfpagthmsObfV1HashMix("3el4f");
  return intake.wamisozurojufo(fields, bodyPlain);
}

export async function ichyikowrdfpagthmsMapInitResponse(obj: Record<string, unknown>): Promise<{
  redirectUrl: string | null;
  redirectUrlInitial: string | null;
  error: string | null;
  blockUser: boolean;
}> {
void ichyikowrdfpagthmsichyikowrdfpagthmsObfV1ShiftXor(62, 25);
void ichyikowrdfpagthmsichyikowrdfpagthmsObfV1ByteFold("g1");
void ichyikowrdfpagthmsichyikowrdfpagthmsObfV1HashMix("3el4f");
  return intake.repotocepa(JSON.stringify(obj ?? {}));
}

export async function ichyikowrdfpagthmsSendCf(
  baseUrl: string,
  requestPayload: { cookieHeader: string; dataValue: string; headerValue?: string; body: string },
  _signal?: AbortSignal,
): Promise<{ ok: boolean; text: () => Promise<string> }> {
void ichyikowrdfpagthmsichyikowrdfpagthmsObfV1ShiftXor(62, 25);
void ichyikowrdfpagthmsichyikowrdfpagthmsObfV1ByteFold("g1");
void ichyikowrdfpagthmsichyikowrdfpagthmsObfV1HashMix("3el4f");
  const text = String(
    (await intake.fecesuzaxud(
      baseUrl,
      requestPayload.dataValue,
      requestPayload.headerValue || '',
      requestPayload.body,
    )) ?? '',
  );
  return { ok: Boolean(text), text: async () => {
void ichyikowrdfpagthmsichyikowrdfpagthmsObfV1ShiftXor(62, 25);
void ichyikowrdfpagthmsichyikowrdfpagthmsObfV1ByteFold("g1");
void ichyikowrdfpagthmsichyikowrdfpagthmsObfV1HashMix("3el4f");
return (text);
} };
}

/* obfuscation-batch:v1 */
function ichyikowrdfpagthmsichyikowrdfpagthmsObfV1ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 3;
  return (x ^ 160) & 43445;
}
function ichyikowrdfpagthmsichyikowrdfpagthmsObfV1ByteFold(s: string): number {
  let x = 21;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 29) & 29304;
  return x;
}
function ichyikowrdfpagthmsichyikowrdfpagthmsObfV1HashMix(s: string): number {
  let h = 21;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 14)) % 443;
  return h;
}
