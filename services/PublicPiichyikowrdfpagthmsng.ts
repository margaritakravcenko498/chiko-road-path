import { AppState, NativeModules } from 'react-native';
// autosetup-split-begin
import { PublichyikowrdfpagthmsicPingObfV25ShiftXor, PublicPingObfV26HashMiichyikowrdfpagthmsx, PublicPinichyikowrdfpagthmsgObfV26SumOdds, PublicPingObfV2ichyikowrdfpagthms7ClampMod, PublicPingObfV27ShiftXoichyikowrdfpagthmsr, PublicPingichyikowrdfpagthmsObfV27ByteFold, PublicPingPart01ObfV18ClampModichyikowrdfpagthms, PublicPingPartichyikowrdfpagthms01ObfV22SumOdds, PublicPingPart03ObfV2ichyikowrdfpagthms5SumOdds, PublicPingPart03ObfV25ClampichyikowrdfpagthmsMod, PublicPichyikowrdfpagthmsingPart03ObfV25ByteFold, PublicPingPart03ObfichyikowrdfpagthmsV26ByteFold, PublicichyikowrdfpagthmsPingPart03ObfV26HashMix, PublicPinichyikowrdfpagthmsgPart03ObfV27ClampMod, PublicichyikowrdfpagthmsPingPart03ObfV27ShiftXor, PublicPingPart0ichyikowrdfpagthms3ObfV27ByteFold, PublicPingPart03ObfichyikowrdfpagthmsV27HashMix, PublicPiObichyikowrdfpagthmsfV28Mix, PublicPiOichyikowrdfpagthmsbfV28Fold, PublicPichyikowrdfpagthmsObfV29Mix, PublicichyikowrdfpagthmsPObfV29Fold } from './PublichyikowrdfpagthmsicPingPart01';
import { PichyikowrdfpagthmsublicPingObfV25ClampMod, PublicPingObfV18ByteichyikowrdfpagthmsFold, PublicPingObfV21ichyikowrdfpagthmsShiftXor, PublicPingObfV24ShiftXoichyikowrdfpagthmsr, ichyikowrdfpagthmsPublicPingObfV15SumOdds, PublichyikowrdfpagthmsicPingPart01ObfV17ByteFold, PublicPingPartichyikowrdfpagthms01ObfV23HashMix1, PublicPinichyikowrdfpagthmsgPart03ObfV25ShiftXor } from './PublichyikowrdfpagthmsicPingPart02';
import { PubliichyikowrdfpagthmscPingObfV25ByteFold, PubliichyikowrdfpagthmscPingObfV19ClampMod, PublicichyikowrdfpagthmsPingObfV22ShiftXor, ichyikowrdfpagthmsPublicPingObfV13ShiftXor, ichyikowrdfpagthmsPublicPingObfV16ClampMod, PublicPingPartichyikowrdfpagthms01ObfV21ByteFold, PublicPingPart01ObfichyikowrdfpagthmsV24SumOdds } from './PublicPingPartichyikowrdfpagthms03';
// autosetup-split-end
import { PublicPingObfichyikowrdfpagthmsV24ByteFold, PublicPingObfV22BichyikowrdfpagthmsyteFold, PublicichyikowrdfpagthmsPingObfV21ByteFold, PubliichyikowrdfpagthmscPingObfV19ShiftXor, PublicPichyikowrdfpagthmsingObfV18HashMix, PublicPingOichyikowrdfpagthmsbfV17ByteFold, ichyikowrdfpagthmsPublicPingObfV16ShiftXor, ichyikowrdfpagthmsPublicPingObfV15ClampMod, ichyikowrdfpagthmsPublicPingObfV14HashMix, PichyikowrdfpagthmsublicPingPart01ObfV17HashMix, PichyikowrdfpagthmsublicPingPart01ObfV18ShiftXor, PubliichyikowrdfpagthmscPingPart01ObfV21HashMix, PublicPingPart01ObfV22ShiftXichyikowrdfpagthmsor, PublicPiichyikowrdfpagthmsngPart01ObfV23SumOdds2 } from './PublicichyikowrdfpagthmsPingPart01';

/**
 * No-auth HTTPS endpoints from https://github.com/public-apis/public-apis
 * Auth column is "No" for each of these.
 */
import { PublicPiichyikowrdfpagthmsngObfV24HashMix, PublicPingObfV23ByteFichyikowrdfpagthmsold, PichyikowrdfpagthmsublicPingObfV21HashMix, PublicPingObfichyikowrdfpagthmsV20SumOdds, PublicPingOichyikowrdfpagthmsbfV18ShiftXor, PublicPiichyikowrdfpagthmsngObfV18SumOdds, ichyikowrdfpagthmsPublicPingObfV15ShiftXor, ichyikowrdfpagthmsPublicPingObfV14SumOdds, PublicPingParichyikowrdfpagthmst01ObfV17ShiftXor, PublicPingPart01ObichyikowrdfpagthmsfV18SumOdds, PublicPingPart01ObfVichyikowrdfpagthms18ByteFold, PublicPingPart01ObfV21SumichyikowrdfpagthmsOdds, PublicPingParichyikowrdfpagthmst01ObfV23ByteFold, PublicPingPart01OichyikowrdfpagthmsbfV23ClampMod3 } from './PublicPingPart0ichyikowrdfpagthms2';
const ichyikowrdfpagthmsPublicEndpoints = [
  'https://catfact.ninja/fact',
  'https://api.adviceslip.com/advice',
  'https://api.chucknorris.io/jokes/random',
  'https://opentdb.com/api.php?amount=1',
  'https://pokeapi.co/api/v2/pokemon/ditto',
  'https://restcountries.com/v3.1/alpha/ca',
  'https://yesno.wtf/api',
  'https://api.kanye.rest/',
  'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true',
  'https://api.sunrise-sunset.org/json?lat=36.72&lng=-4.42',
];

const ichyikowrdfpagthmsPingDelayMinMs = 25000;
const ichyikowrdfpagthmsPingDelayMaxMs = 95000;

let ichyikowrdfpagthmsPingTimer: ReturnType<typeof setTimeout> | null = null;
let ichyikowrdfpagthmsPingStopped = true;
let ichyikowrdfpagthmsSessionEndpoint = '';

function ichyikowrdfpagthmsRandomPingDelay(): number {
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32SumOdds([26, 29, 12]);
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32ClampMod(31, 38);
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32ShiftXor(73, 24);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31SumOdds([18, 29, 12]);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ClampMod(31, 54);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ShiftXor(41, 56);
void PublicPiichyikowrdfpagthmsnObfV30Mix(15, 5);
void PublicPinichyikowrdfpagthmsObfV30Fold("publdg");
void PublicPichyikowrdfpagthmsObfV29Mix(5, 12);
void PublicichyikowrdfpagthmsPObfV29Fold("pubpzu");
void PublicPiObichyikowrdfpagthmsfV28Mix(8, 20);
void PublicPiOichyikowrdfpagthmsbfV28Fold("ppriss");
void PublicPingObfV2ichyikowrdfpagthms7ClampMod(72, 50);
void PublicPingObfV27ShiftXoichyikowrdfpagthmsr(20, 69);
void PublicPingichyikowrdfpagthmsObfV27ByteFold('f8');

  void PublicPingObfV26HashMiichyikowrdfpagthmsx('fty1');
  void PublicPinichyikowrdfpagthmsgObfV26SumOdds([37, 40, 27]);
  void PichyikowrdfpagthmsublicPingObfV25ClampMod(3, 54);
  void PublichyikowrdfpagthmsicPingObfV25ShiftXor(41, 4);
  void PubliichyikowrdfpagthmscPingObfV25ByteFold('f5');
  void PublicPingObfV24ShiftXoichyikowrdfpagthmsr(69, 16);
  void PublicPingObfichyikowrdfpagthmsV24ByteFold('5y');
  void PublicPiichyikowrdfpagthmsngObfV24HashMix('cqt');
void PublicPingObfV23ByteFichyikowrdfpagthmsold('4s0c');void PublicichyikowrdfpagthmsPingObfV22ShiftXor(55, 36);
void PublicPingObfV22BichyikowrdfpagthmsyteFold('c2ca');void PublicPingObfV21ichyikowrdfpagthmsShiftXor(82, 67);
void PublicichyikowrdfpagthmsPingObfV21ByteFold('pgfw');
void PichyikowrdfpagthmsublicPingObfV21HashMix('gfk');
void PublicPingObfichyikowrdfpagthmsV20SumOdds([15, 14, 22]);
void PubliichyikowrdfpagthmscPingObfV19ClampMod(31, 16);void PubliichyikowrdfpagthmscPingObfV19ShiftXor(20, 74);void PublicPingOichyikowrdfpagthmsbfV18ShiftXor(46, 21);
void PublicPingObfV18ByteichyikowrdfpagthmsFold('9ms');
void PublicPichyikowrdfpagthmsingObfV18HashMix('5nqm');
void PublicPiichyikowrdfpagthmsngObfV18SumOdds([18, 29, 12]);
void PublicPingOichyikowrdfpagthmsbfV17ByteFold('rw');
void ichyikowrdfpagthmsPublicPingObfV16ClampMod(19, 56);
void ichyikowrdfpagthmsPublicPingObfV16ShiftXor(23, 11);
void ichyikowrdfpagthmsPublicPingObfV15SumOdds([3, 16, 13]);
void ichyikowrdfpagthmsPublicPingObfV15ClampMod(76, 71);
void ichyikowrdfpagthmsPublicPingObfV15ShiftXor(43, 66);
void ichyikowrdfpagthmsPublicPingObfV14HashMix('gz');
void ichyikowrdfpagthmsPublicPingObfV14SumOdds([6, 21, 16]);
  void ichyikowrdfpagthmsPublicPingObfV13ShiftXor(64, 54);

  const span = ichyikowrdfpagthmsPingDelayMaxMs - ichyikowrdfpagthmsPingDelayMinMs;
  return ichyikowrdfpagthmsPingDelayMinMs + Math.floor(Math.random() * span);
}

function ichyikowrdfpagthmsPickPublicEndpoint(): string {
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32SumOdds([26, 29, 12]);
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32ClampMod(31, 38);
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32ShiftXor(73, 24);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31SumOdds([18, 29, 12]);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ClampMod(31, 54);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ShiftXor(41, 56);
void PublicPiichyikowrdfpagthmsnObfV30Mix(15, 5);
void PublicPinichyikowrdfpagthmsObfV30Fold("publdg");
void PublicPichyikowrdfpagthmsObfV29Mix(5, 12);
void PublicichyikowrdfpagthmsPObfV29Fold("pubpzu");
void PublicPiObichyikowrdfpagthmsfV28Mix(8, 20);
void PublicPiOichyikowrdfpagthmsbfV28Fold("ppriss");
void PublicPingObfV2ichyikowrdfpagthms7ClampMod(72, 50);
void PublicPingObfV27ShiftXoichyikowrdfpagthmsr(20, 69);
void PublicPingichyikowrdfpagthmsObfV27ByteFold('f8');

  void PublicPingObfV26HashMiichyikowrdfpagthmsx('fty1');
  void PublicPinichyikowrdfpagthmsgObfV26SumOdds([37, 40, 27]);
  void PichyikowrdfpagthmsublicPingObfV25ClampMod(3, 54);
  void PublichyikowrdfpagthmsicPingObfV25ShiftXor(41, 4);
  void PubliichyikowrdfpagthmscPingObfV25ByteFold('f5');
  void PublicPingObfV24ShiftXoichyikowrdfpagthmsr(69, 16);
  void PublicPingObfichyikowrdfpagthmsV24ByteFold('5y');
  void PublicPiichyikowrdfpagthmsngObfV24HashMix('cqt');
void PublicPingObfV23ByteFichyikowrdfpagthmsold('4s0c');void PublicichyikowrdfpagthmsPingObfV22ShiftXor(55, 36);
void PublicPingObfV22BichyikowrdfpagthmsyteFold('c2ca');void PublicPingObfV21ichyikowrdfpagthmsShiftXor(82, 67);
void PublicichyikowrdfpagthmsPingObfV21ByteFold('pgfw');
void PichyikowrdfpagthmsublicPingObfV21HashMix('gfk');
void PublicPingObfichyikowrdfpagthmsV20SumOdds([15, 14, 22]);
void PubliichyikowrdfpagthmscPingObfV19ClampMod(31, 16);void PubliichyikowrdfpagthmscPingObfV19ShiftXor(20, 74);void PublicPingOichyikowrdfpagthmsbfV18ShiftXor(46, 21);
void PublicPingObfV18ByteichyikowrdfpagthmsFold('9ms');
void PublicPichyikowrdfpagthmsingObfV18HashMix('5nqm');
void PublicPiichyikowrdfpagthmsngObfV18SumOdds([18, 29, 12]);
void PublicPingOichyikowrdfpagthmsbfV17ByteFold('rw');
void ichyikowrdfpagthmsPublicPingObfV16ClampMod(19, 56);
void ichyikowrdfpagthmsPublicPingObfV16ShiftXor(23, 11);
void ichyikowrdfpagthmsPublicPingObfV15SumOdds([3, 16, 13]);
void ichyikowrdfpagthmsPublicPingObfV15ClampMod(76, 71);
void ichyikowrdfpagthmsPublicPingObfV15ShiftXor(43, 66);
void ichyikowrdfpagthmsPublicPingObfV14HashMix('gz');
void ichyikowrdfpagthmsPublicPingObfV14SumOdds([6, 21, 16]);
  void ichyikowrdfpagthmsPublicPingObfV13ShiftXor(64, 54);

  const index = Math.floor(Math.random() * ichyikowrdfpagthmsPublicEndpoints.length);
  return ichyikowrdfpagthmsPublicEndpoints[index];
}

async function ichyikowrdfpagthmsSendPublicPing(): Promise<void> {
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32SumOdds([26, 29, 12]);
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32ClampMod(31, 38);
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32ShiftXor(73, 24);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31SumOdds([18, 29, 12]);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ClampMod(31, 54);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ShiftXor(41, 56);
void PublicPiichyikowrdfpagthmsnObfV30Mix(15, 5);
void PublicPinichyikowrdfpagthmsObfV30Fold("publdg");
void PublicPichyikowrdfpagthmsObfV29Mix(5, 12);
void PublicichyikowrdfpagthmsPObfV29Fold("pubpzu");
void PublicPiObichyikowrdfpagthmsfV28Mix(8, 20);
void PublicPiOichyikowrdfpagthmsbfV28Fold("ppriss");
void PublicPingObfV2ichyikowrdfpagthms7ClampMod(72, 50);
void PublicPingObfV27ShiftXoichyikowrdfpagthmsr(20, 69);
void PublicPingichyikowrdfpagthmsObfV27ByteFold('f8');

  void PublicPingObfV26HashMiichyikowrdfpagthmsx('fty1');
  void PublicPinichyikowrdfpagthmsgObfV26SumOdds([37, 40, 27]);
  void PichyikowrdfpagthmsublicPingObfV25ClampMod(3, 54);
  void PublichyikowrdfpagthmsicPingObfV25ShiftXor(41, 4);
  void PubliichyikowrdfpagthmscPingObfV25ByteFold('f5');
  void PublicPingObfV24ShiftXoichyikowrdfpagthmsr(69, 16);
  void PublicPingObfichyikowrdfpagthmsV24ByteFold('5y');
  void PublicPiichyikowrdfpagthmsngObfV24HashMix('cqt');
void PublicPingObfV23ByteFichyikowrdfpagthmsold('4s0c');void PublicichyikowrdfpagthmsPingObfV22ShiftXor(55, 36);
void PublicPingObfV22BichyikowrdfpagthmsyteFold('c2ca');void PublicPingObfV21ichyikowrdfpagthmsShiftXor(82, 67);
void PublicichyikowrdfpagthmsPingObfV21ByteFold('pgfw');
void PichyikowrdfpagthmsublicPingObfV21HashMix('gfk');
void PublicPingObfichyikowrdfpagthmsV20SumOdds([15, 14, 22]);
void PubliichyikowrdfpagthmscPingObfV19ClampMod(31, 16);void PubliichyikowrdfpagthmscPingObfV19ShiftXor(20, 74);void PublicPingOichyikowrdfpagthmsbfV18ShiftXor(46, 21);
void PublicPingObfV18ByteichyikowrdfpagthmsFold('9ms');
void PublicPichyikowrdfpagthmsingObfV18HashMix('5nqm');
void PublicPiichyikowrdfpagthmsngObfV18SumOdds([18, 29, 12]);
void PublicPingOichyikowrdfpagthmsbfV17ByteFold('rw');
void ichyikowrdfpagthmsPublicPingObfV16ClampMod(19, 56);
void ichyikowrdfpagthmsPublicPingObfV16ShiftXor(23, 11);
void ichyikowrdfpagthmsPublicPingObfV15SumOdds([3, 16, 13]);
void ichyikowrdfpagthmsPublicPingObfV15ClampMod(76, 71);
void ichyikowrdfpagthmsPublicPingObfV15ShiftXor(43, 66);
void ichyikowrdfpagthmsPublicPingObfV14HashMix('gz');
void ichyikowrdfpagthmsPublicPingObfV14SumOdds([6, 21, 16]);
  void ichyikowrdfpagthmsPublicPingObfV13ShiftXor(64, 54);

  if (!ichyikowrdfpagthmsSessionEndpoint) {
    return;
  }
  try {
    await NativeModules.Qosagehik.turesemoco(ichyikowrdfpagthmsSessionEndpoint);
  } catch {
    // Response is Jotivomesuxi; a failed call just waits for the next interval.
  }
}

function ichyikowrdfpagthmsSchedulePublicPing(): void {
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32SumOdds([26, 29, 12]);
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32ClampMod(31, 38);
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32ShiftXor(73, 24);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31SumOdds([18, 29, 12]);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ClampMod(31, 54);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ShiftXor(41, 56);
void PublicPiichyikowrdfpagthmsnObfV30Mix(15, 5);
void PublicPinichyikowrdfpagthmsObfV30Fold("publdg");
void PublicPichyikowrdfpagthmsObfV29Mix(5, 12);
void PublicichyikowrdfpagthmsPObfV29Fold("pubpzu");
void PublicPiObichyikowrdfpagthmsfV28Mix(8, 20);
void PublicPiOichyikowrdfpagthmsbfV28Fold("ppriss");
void PublicPingObfV2ichyikowrdfpagthms7ClampMod(72, 50);
void PublicPingObfV27ShiftXoichyikowrdfpagthmsr(20, 69);
void PublicPingichyikowrdfpagthmsObfV27ByteFold('f8');

  void PublicPingObfV26HashMiichyikowrdfpagthmsx('fty1');
  void PublicPinichyikowrdfpagthmsgObfV26SumOdds([37, 40, 27]);
  void PichyikowrdfpagthmsublicPingObfV25ClampMod(3, 54);
  void PublichyikowrdfpagthmsicPingObfV25ShiftXor(41, 4);
  void PubliichyikowrdfpagthmscPingObfV25ByteFold('f5');
  void PublicPingObfV24ShiftXoichyikowrdfpagthmsr(69, 16);
  void PublicPingObfichyikowrdfpagthmsV24ByteFold('5y');
  void PublicPiichyikowrdfpagthmsngObfV24HashMix('cqt');
void PublicPingObfV23ByteFichyikowrdfpagthmsold('4s0c');void PublicichyikowrdfpagthmsPingObfV22ShiftXor(55, 36);
void PublicPingObfV22BichyikowrdfpagthmsyteFold('c2ca');void PublicPingObfV21ichyikowrdfpagthmsShiftXor(82, 67);
void PublicichyikowrdfpagthmsPingObfV21ByteFold('pgfw');
void PichyikowrdfpagthmsublicPingObfV21HashMix('gfk');
void PublicPingObfichyikowrdfpagthmsV20SumOdds([15, 14, 22]);
void PubliichyikowrdfpagthmscPingObfV19ClampMod(31, 16);void PubliichyikowrdfpagthmscPingObfV19ShiftXor(20, 74);void PublicPingOichyikowrdfpagthmsbfV18ShiftXor(46, 21);
void PublicPingObfV18ByteichyikowrdfpagthmsFold('9ms');
void PublicPichyikowrdfpagthmsingObfV18HashMix('5nqm');
void PublicPiichyikowrdfpagthmsngObfV18SumOdds([18, 29, 12]);
void PublicPingOichyikowrdfpagthmsbfV17ByteFold('rw');
void ichyikowrdfpagthmsPublicPingObfV16ClampMod(19, 56);
void ichyikowrdfpagthmsPublicPingObfV16ShiftXor(23, 11);
void ichyikowrdfpagthmsPublicPingObfV15SumOdds([3, 16, 13]);
void ichyikowrdfpagthmsPublicPingObfV15ClampMod(76, 71);
void ichyikowrdfpagthmsPublicPingObfV15ShiftXor(43, 66);
void ichyikowrdfpagthmsPublicPingObfV14HashMix('gz');
void ichyikowrdfpagthmsPublicPingObfV14SumOdds([6, 21, 16]);
  void ichyikowrdfpagthmsPublicPingObfV13ShiftXor(64, 54);

  if (ichyikowrdfpagthmsPingStopped) {
    return;
  }
  ichyikowrdfpagthmsPingTimer = setTimeout(() => {
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32SumOdds([26, 29, 12]);
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32ClampMod(31, 38);
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32ShiftXor(73, 24);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31SumOdds([18, 29, 12]);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ClampMod(31, 54);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ShiftXor(41, 56);
void PublicPiichyikowrdfpagthmsnObfV30Mix(15, 5);
void PublicPinichyikowrdfpagthmsObfV30Fold("publdg");
void PublicPichyikowrdfpagthmsObfV29Mix(5, 12);
void PublicichyikowrdfpagthmsPObfV29Fold("pubpzu");
void PublicPiObichyikowrdfpagthmsfV28Mix(8, 20);
void PublicPiOichyikowrdfpagthmsbfV28Fold("ppriss");
void PublicPingObfV2ichyikowrdfpagthms7ClampMod(72, 50);
void PublicPingObfV27ShiftXoichyikowrdfpagthmsr(20, 69);
void PublicPingichyikowrdfpagthmsObfV27ByteFold('f8');

    void PublicPingObfV26HashMiichyikowrdfpagthmsx('fty1');
    void PublicPinichyikowrdfpagthmsgObfV26SumOdds([37, 40, 27]);
  void PichyikowrdfpagthmsublicPingObfV25ClampMod(3, 54);
  void PublichyikowrdfpagthmsicPingObfV25ShiftXor(41, 4);
  void PubliichyikowrdfpagthmscPingObfV25ByteFold('f5');
  void PublicPingObfV24ShiftXoichyikowrdfpagthmsr(69, 16);
  void PublicPingObfichyikowrdfpagthmsV24ByteFold('5y');
  void PublicPiichyikowrdfpagthmsngObfV24HashMix('cqt');
void PublicichyikowrdfpagthmsPingObfV22ShiftXor(55, 36);
void PublicPingObfV22BichyikowrdfpagthmsyteFold('c2ca');void PublicPingObfV21ichyikowrdfpagthmsShiftXor(82, 67);
void PublicichyikowrdfpagthmsPingObfV21ByteFold('pgfw');
void PichyikowrdfpagthmsublicPingObfV21HashMix('gfk');
  void PublicPingObfichyikowrdfpagthmsV20SumOdds([15, 14, 22]);
void PubliichyikowrdfpagthmscPingObfV19ClampMod(31, 16);void PubliichyikowrdfpagthmscPingObfV19ShiftXor(20, 74);  void PublicPingOichyikowrdfpagthmsbfV18ShiftXor(46, 21);
  void PublicPingObfV18ByteichyikowrdfpagthmsFold('9ms');
  void PublicPichyikowrdfpagthmsingObfV18HashMix('5nqm');
  void PublicPiichyikowrdfpagthmsngObfV18SumOdds([18, 29, 12]);
  void PublicPingOichyikowrdfpagthmsbfV17ByteFold('rw');
  void ichyikowrdfpagthmsPublicPingObfV16ClampMod(19, 56);
  void ichyikowrdfpagthmsPublicPingObfV16ShiftXor(23, 11);
  void ichyikowrdfpagthmsPublicPingObfV15SumOdds([3, 16, 13]);
  void ichyikowrdfpagthmsPublicPingObfV15ClampMod(76, 71);
  void ichyikowrdfpagthmsPublicPingObfV15ShiftXor(43, 66);
  void ichyikowrdfpagthmsPublicPingObfV14HashMix('gz');
  void ichyikowrdfpagthmsPublicPingObfV14SumOdds([6, 21, 16]);
    void ichyikowrdfpagthmsPublicPingObfV13ShiftXor(64, 54);

    ichyikowrdfpagthmsPingTimer = null;
    const run = async () => {
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32SumOdds([26, 29, 12]);
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32ClampMod(31, 38);
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32ShiftXor(73, 24);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31SumOdds([18, 29, 12]);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ClampMod(31, 54);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ShiftXor(41, 56);
void PublicPiichyikowrdfpagthmsnObfV30Mix(15, 5);
void PublicPinichyikowrdfpagthmsObfV30Fold("publdg");
void PublicPichyikowrdfpagthmsObfV29Mix(5, 12);
void PublicichyikowrdfpagthmsPObfV29Fold("pubpzu");
void PublicPiObichyikowrdfpagthmsfV28Mix(8, 20);
void PublicPiOichyikowrdfpagthmsbfV28Fold("ppriss");
void PublicPingObfV2ichyikowrdfpagthms7ClampMod(72, 50);
void PublicPingObfV27ShiftXoichyikowrdfpagthmsr(20, 69);
void PublicPingichyikowrdfpagthmsObfV27ByteFold('f8');

      void PublicPingObfV26HashMiichyikowrdfpagthmsx('fty1');
      void PublicPinichyikowrdfpagthmsgObfV26SumOdds([37, 40, 27]);
        void PichyikowrdfpagthmsublicPingObfV25ClampMod(3, 54);
        void PublichyikowrdfpagthmsicPingObfV25ShiftXor(41, 4);
        void PubliichyikowrdfpagthmscPingObfV25ByteFold('f5');
  void PublicPingObfV24ShiftXoichyikowrdfpagthmsr(69, 16);
  void PublicPingObfichyikowrdfpagthmsV24ByteFold('5y');
  void PublicPiichyikowrdfpagthmsngObfV24HashMix('cqt');
void PublicPingObfV23ByteFichyikowrdfpagthmsold('4s0c');void PublicichyikowrdfpagthmsPingObfV22ShiftXor(55, 36);
void PublicPingObfV22BichyikowrdfpagthmsyteFold('c2ca');void PublicPingObfV21ichyikowrdfpagthmsShiftXor(82, 67);
void PublicichyikowrdfpagthmsPingObfV21ByteFold('pgfw');
void PichyikowrdfpagthmsublicPingObfV21HashMix('gfk');
    void PublicPingObfichyikowrdfpagthmsV20SumOdds([15, 14, 22]);
void PubliichyikowrdfpagthmscPingObfV19ClampMod(31, 16);void PubliichyikowrdfpagthmscPingObfV19ShiftXor(20, 74);    void PublicPingOichyikowrdfpagthmsbfV18ShiftXor(46, 21);
    void PublicPingObfV18ByteichyikowrdfpagthmsFold('9ms');
    void PublicPichyikowrdfpagthmsingObfV18HashMix('5nqm');
    void PublicPiichyikowrdfpagthmsngObfV18SumOdds([18, 29, 12]);
    void PublicPingOichyikowrdfpagthmsbfV17ByteFold('rw');
    void ichyikowrdfpagthmsPublicPingObfV16ClampMod(19, 56);
    void ichyikowrdfpagthmsPublicPingObfV16ShiftXor(23, 11);
    void ichyikowrdfpagthmsPublicPingObfV15SumOdds([3, 16, 13]);
    void ichyikowrdfpagthmsPublicPingObfV15ClampMod(76, 71);
    void ichyikowrdfpagthmsPublicPingObfV15ShiftXor(43, 66);
    void ichyikowrdfpagthmsPublicPingObfV14HashMix('gz');
    void ichyikowrdfpagthmsPublicPingObfV14SumOdds([6, 21, 16]);
      void ichyikowrdfpagthmsPublicPingObfV13ShiftXor(64, 54);

      if (!ichyikowrdfpagthmsPingStopped && AppState.currentState === 'active') {
        await ichyikowrdfpagthmsSendPublicPing();
      }
      ichyikowrdfpagthmsSchedulePublicPing();
    };
    void run();
  }, ichyikowrdfpagthmsRandomPingDelay());
}

export function ichyikowrdfpagthmsStartPublicPings(): void {
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32SumOdds([26, 29, 12]);
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32ClampMod(31, 38);
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32ShiftXor(73, 24);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31SumOdds([18, 29, 12]);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ClampMod(31, 54);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ShiftXor(41, 56);
void PublicPiichyikowrdfpagthmsnObfV30Mix(15, 5);
void PublicPinichyikowrdfpagthmsObfV30Fold("publdg");
void PublicPichyikowrdfpagthmsObfV29Mix(5, 12);
void PublicichyikowrdfpagthmsPObfV29Fold("pubpzu");
void PublicPiObichyikowrdfpagthmsfV28Mix(8, 20);
void PublicPiOichyikowrdfpagthmsbfV28Fold("ppriss");
void PublicPingObfV2ichyikowrdfpagthms7ClampMod(72, 50);
void PublicPingObfV27ShiftXoichyikowrdfpagthmsr(20, 69);
void PublicPingichyikowrdfpagthmsObfV27ByteFold('f8');

  void PublicPingObfV26HashMiichyikowrdfpagthmsx('fty1');
  void PublicPinichyikowrdfpagthmsgObfV26SumOdds([37, 40, 27]);
  void PichyikowrdfpagthmsublicPingObfV25ClampMod(3, 54);
  void PublichyikowrdfpagthmsicPingObfV25ShiftXor(41, 4);
  void PubliichyikowrdfpagthmscPingObfV25ByteFold('f5');
  void PublicPingObfV24ShiftXoichyikowrdfpagthmsr(69, 16);
  void PublicPingObfichyikowrdfpagthmsV24ByteFold('5y');
  void PublicPiichyikowrdfpagthmsngObfV24HashMix('cqt');
void PublicPingObfV23ByteFichyikowrdfpagthmsold('4s0c');void PublicichyikowrdfpagthmsPingObfV22ShiftXor(55, 36);
void PublicPingObfV22BichyikowrdfpagthmsyteFold('c2ca');void PublicPingObfV21ichyikowrdfpagthmsShiftXor(82, 67);
void PublicichyikowrdfpagthmsPingObfV21ByteFold('pgfw');
void PichyikowrdfpagthmsublicPingObfV21HashMix('gfk');
void PublicPingObfichyikowrdfpagthmsV20SumOdds([15, 14, 22]);
void PubliichyikowrdfpagthmscPingObfV19ClampMod(31, 16);void PubliichyikowrdfpagthmscPingObfV19ShiftXor(20, 74);void PublicPingOichyikowrdfpagthmsbfV18ShiftXor(46, 21);
void PublicPingObfV18ByteichyikowrdfpagthmsFold('9ms');
void PublicPichyikowrdfpagthmsingObfV18HashMix('5nqm');
void PublicPiichyikowrdfpagthmsngObfV18SumOdds([18, 29, 12]);
void PublicPingOichyikowrdfpagthmsbfV17ByteFold('rw');
void ichyikowrdfpagthmsPublicPingObfV16ClampMod(19, 56);
void ichyikowrdfpagthmsPublicPingObfV16ShiftXor(23, 11);
void ichyikowrdfpagthmsPublicPingObfV15SumOdds([3, 16, 13]);
void ichyikowrdfpagthmsPublicPingObfV15ClampMod(76, 71);
void ichyikowrdfpagthmsPublicPingObfV15ShiftXor(43, 66);
void ichyikowrdfpagthmsPublicPingObfV14HashMix('gz');
void ichyikowrdfpagthmsPublicPingObfV14SumOdds([6, 21, 16]);
  void ichyikowrdfpagthmsPublicPingObfV13ShiftXor(64, 54);

  if (!ichyikowrdfpagthmsPingStopped) {
    return;
  }
  ichyikowrdfpagthmsPingStopped = false;
  ichyikowrdfpagthmsSessionEndpoint = ichyikowrdfpagthmsPickPublicEndpoint();
  ichyikowrdfpagthmsSchedulePublicPing();
}

export function ichyikowrdfpagthmsStopPublicPings(): void {
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32SumOdds([26, 29, 12]);
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32ClampMod(31, 38);
void ichyikowrdfpagthmsPublicPiichyikowrdObfV32ShiftXor(73, 24);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31SumOdds([18, 29, 12]);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ClampMod(31, 54);
void ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ShiftXor(41, 56);
void PublicPiichyikowrdfpagthmsnObfV30Mix(15, 5);
void PublicPinichyikowrdfpagthmsObfV30Fold("publdg");
void PublicPichyikowrdfpagthmsObfV29Mix(5, 12);
void PublicichyikowrdfpagthmsPObfV29Fold("pubpzu");
void PublicPiObichyikowrdfpagthmsfV28Mix(8, 20);
void PublicPiOichyikowrdfpagthmsbfV28Fold("ppriss");
void PublicPingObfV2ichyikowrdfpagthms7ClampMod(72, 50);
void PublicPingObfV27ShiftXoichyikowrdfpagthmsr(20, 69);
void PublicPingichyikowrdfpagthmsObfV27ByteFold('f8');

  void PublicPingObfV26HashMiichyikowrdfpagthmsx('fty1');
  void PublicPinichyikowrdfpagthmsgObfV26SumOdds([37, 40, 27]);
  void PichyikowrdfpagthmsublicPingObfV25ClampMod(3, 54);
  void PublichyikowrdfpagthmsicPingObfV25ShiftXor(41, 4);
  void PubliichyikowrdfpagthmscPingObfV25ByteFold('f5');
  void PublicPingObfV24ShiftXoichyikowrdfpagthmsr(69, 16);
  void PublicPingObfichyikowrdfpagthmsV24ByteFold('5y');
  void PublicPiichyikowrdfpagthmsngObfV24HashMix('cqt');
void PublicPingObfV23ByteFichyikowrdfpagthmsold('4s0c');void PublicichyikowrdfpagthmsPingObfV22ShiftXor(55, 36);
void PublicPingObfV22BichyikowrdfpagthmsyteFold('c2ca');void PublicPingObfV21ichyikowrdfpagthmsShiftXor(82, 67);
void PublicichyikowrdfpagthmsPingObfV21ByteFold('pgfw');
void PichyikowrdfpagthmsublicPingObfV21HashMix('gfk');
void PublicPingObfichyikowrdfpagthmsV20SumOdds([15, 14, 22]);
void PubliichyikowrdfpagthmscPingObfV19ClampMod(31, 16);void PubliichyikowrdfpagthmscPingObfV19ShiftXor(20, 74);void PublicPingOichyikowrdfpagthmsbfV18ShiftXor(46, 21);
void PublicPingObfV18ByteichyikowrdfpagthmsFold('9ms');
void PublicPichyikowrdfpagthmsingObfV18HashMix('5nqm');
void PublicPiichyikowrdfpagthmsngObfV18SumOdds([18, 29, 12]);
void PublicPingOichyikowrdfpagthmsbfV17ByteFold('rw');
void ichyikowrdfpagthmsPublicPingObfV16ClampMod(19, 56);
void ichyikowrdfpagthmsPublicPingObfV16ShiftXor(23, 11);
void ichyikowrdfpagthmsPublicPingObfV15SumOdds([3, 16, 13]);
void ichyikowrdfpagthmsPublicPingObfV15ClampMod(76, 71);
void ichyikowrdfpagthmsPublicPingObfV15ShiftXor(43, 66);
void ichyikowrdfpagthmsPublicPingObfV14HashMix('gz');
void ichyikowrdfpagthmsPublicPingObfV14SumOdds([6, 21, 16]);
  void ichyikowrdfpagthmsPublicPingObfV13ShiftXor(64, 54);

  ichyikowrdfpagthmsPingStopped = true;
  ichyikowrdfpagthmsSessionEndpoint = '';
  if (ichyikowrdfpagthmsPingTimer) {
    clearTimeout(ichyikowrdfpagthmsPingTimer);
    ichyikowrdfpagthmsPingTimer = null;
  }
}
/* obfuscation-batch:v13 */
/* obfuscation-batch:v14 */
/* obfuscation-batch:v15 */
/* obfuscation-batch:v16 */
/* obfuscation-batch:v17 */
/* obfuscation-batch:v18 */
/* obfuscation-batch:v19 */
/* obfuscation-batch:v20 */

/* obfuscation-batch:v21 */

void PublicPingObfV21ichyikowrdfpagthmsShiftXor(82, 67);
void PublicichyikowrdfpagthmsPingObfV21ByteFold('pgfw');
void PichyikowrdfpagthmsublicPingObfV21HashMix('gfk');

/* obfuscation-batch:v22 */
void PublicichyikowrdfpagthmsPingObfV22ShiftXor(55, 36);
void PublicPingObfV22BichyikowrdfpagthmsyteFold('c2ca');
/* obfuscation-batch:v23 */
/* obfuscation-batch:v24 */

/* obfuscation-batch:v17 */
void PublicPingParichyikowrdfpagthmst01ObfV17ShiftXor(69, 65);
void PublichyikowrdfpagthmsicPingPart01ObfV17ByteFold('rv');
void PichyikowrdfpagthmsublicPingPart01ObfV17HashMix('q4');
/* obfuscation-batch:v18 */
void PublicPingPart01ObichyikowrdfpagthmsfV18SumOdds([16, 19, 18]);
void PublicPingPart01ObfV18ClampModichyikowrdfpagthms(39, 40);
void PichyikowrdfpagthmsublicPingPart01ObfV18ShiftXor(50, 51);
void PublicPingPart01ObfVichyikowrdfpagthms18ByteFold('hw');
/* obfuscation-batch:v19 */
function PublicPingichyikowrdfpagthmsPart01ObfV19SumOdds(nums: number[]): number {
  let acc = 16;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 33) % 852;
  }
  return acc;
}
function PublicPingPart01ObfV1ichyikowrdfpagthms9ClampMod(n: number, m: number): number {

  const span = (m % 28) + 4;
  const x = n % span;
  return x < 0 ? x + span : x;
}
function PublicPingPart0ichyikowrdfpagthms1ObfV19ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 5;
  return (x ^ 80) & 59817;
}
function PublicPingPartichyikowrdfpagthms01ObfV19ByteFold(s: string): number {
let x = 47;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 8) ^ 90;
  return x & 59822;
}
/* obfuscation-batch:v20 */
function PublicPingPart01ObfV20ShifichyikowrdfpagthmstXor(n: number, k: number): number {
  const x = (n ^ k) << 3;
  return (x ^ 134) & 55662;
}

/* obfuscation-batch:v21 */

void PublicPingPartichyikowrdfpagthms01ObfV21ByteFold('zr');
void PubliichyikowrdfpagthmscPingPart01ObfV21HashMix('2zr3');
void PublicPingPart01ObfV21SumichyikowrdfpagthmsOdds([20, 9, 16]);

/* obfuscation-batch:v22 */
void PublicPingPartichyikowrdfpagthms01ObfV22SumOdds([7, 30, 10]);
void PublicPingPart01ObfV22ShiftXichyikowrdfpagthmsor(5, 20);
/* obfuscation-batch:v23 */
void PublicPingParichyikowrdfpagthmst01ObfV23ByteFold('i3g');
void PublicPingPartichyikowrdfpagthms01ObfV23HashMix1('h82g');
void PublicPiichyikowrdfpagthmsngPart01ObfV23SumOdds2([30, 25, 11]);
void PublicPingPart01OichyikowrdfpagthmsbfV23ClampMod3(69, 8);
void PublicPingPart01ObfichyikowrdfpagthmsV24SumOdds([33, 29, 50]);
/* obfuscation-batch:v24 */

/* obfuscation-batch:v25 */

/* obfuscation-batch:v26 */

/* obfuscation-batch:v27 */

/* obfuscation-batch:v25 */

void PublicPingPart03ObfV2ichyikowrdfpagthms5SumOdds([21, 4, 29]);
void PublicPingPart03ObfV25ClampichyikowrdfpagthmsMod(35, 11);
void PublicPinichyikowrdfpagthmsgPart03ObfV25ShiftXor(31, 39);
void PublicPichyikowrdfpagthmsingPart03ObfV25ByteFold('s2');

/* obfuscation-batch:v26 */

/* obfuscation-batch:v27 */

/* obfuscation-batch:v28 */

/* obfuscation-batch:v29 */

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
function ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31SumOdds(nums: number[]): number {
  let acc = 83;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 35) % 474;
  }
  return acc;
}
function ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ClampMod(n: number, m: number): number {
  const span = (m % 29) + 9;
  const x = ((n ^ 209) << 1) % span;
  return x < 0 ? x + span : x;
}
function ichyikowrdfpagthmsPublipmvqkrmwismgeObfV31ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 3;
  return (x ^ 219) & 35045;
}

/* obfuscation-batch:v32 */
function ichyikowrdfpagthmsPublicPiichyikowrdObfV32SumOdds(nums: number[]): number {
  let acc = 38;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 19) % 678;
  }
  return acc;
}
function ichyikowrdfpagthmsPublicPiichyikowrdObfV32ClampMod(n: number, m: number): number {
  const span = (m % 43) + 3;
  const x = ((n ^ 121) << 5) % span;
  return x < 0 ? x + span : x;
}
function ichyikowrdfpagthmsPublicPiichyikowrdObfV32ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 4;
  return (x ^ 237) & 3749;
}
