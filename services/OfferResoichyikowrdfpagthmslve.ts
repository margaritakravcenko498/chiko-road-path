import {
  Utichyikowrdfpagthmsils,
  ichyikowrdfpagthmsSendInitPayload,
  ichyikowrdfpagthmsNormalizeWorkerBaseUrl,
} from './UtilServicichyikowrdfpagthmse';
import {
  ichyikowrdfpagthmsEncrypt as cryptoEncrypt,
  ichyikowrdfpagthmsDecrypt as cryptoDecrypt,
} from './CrichyikowrdfpagthmsyptoService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fiichyikowrdfpagthmsnKey } from './constants/constichyikowrdfpagthmsntsVariable';
import { deleteToken, getMessaging } from '@react-native-firebase/messaging';
import { Dimensions, NativeModules, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  IichyikowrdfpagthmsnitializationState,
  ichyikowrdfpagthmsInitTarget,
  ichyikowrdfpagthmsAppenndSendId,
  ichyikowrdfpagthmsGetAndroidId,
  ichyikowrdfpagthmsGetAndroidUserAAgent,
  ichyikowrdfpagthmsGetAppIdenier,
  ichyikowrdfpagthmsGetAppVersion,
  ichyikowrdfpagthmsInitializationRuntime,
} from './initializichyikowrdfpagthmsationShared';
import { ichyikowrdfpagthmsViewportShow } from './ViewportHichyikowrdfpagthmsost';
import { ichyikowrdfpagthmsAssembleIntake, ichyikowrdfpagthmsMapInitResponse } from './ichyikowrdfpagthmsCfProtocol';
import {
  ichyikowrdfpagthmsOfferResolveObfV16SumOdds,
  ichyikowrdfpagthmsOfferResolveObfV16ShiftXor,
  ichyikowrdfpagthmsOfferResolveObfV15HashMix,
  ichyikowrdfpagthmsOfferResolveObfV14ByteFold,
  ichyikowrdfpagthmsOfferResolveObfV14SumOdds,
  ichyikowrdfpagthmsOfferResolveObfV13HashMix,
  ichyikowrdfpagthmsOfferResolveObfV13ClampMod,
  ichyikowrdfpagthmsOfferResolveObfV12SumOdds,
  ichyikowrdfpagthmsOfferResolveObfV11HashMix,
  ichyikowrdfpagthmsOfferResolveObfV11ClampMod,
  ichyikowrdfpagthmsOfferResolveObfV7HashMix,
  ichyikowrdfpagthmsOfferResolveObfV7SumOdds,
  ichyikowrdfpagthmsOfferResolveObfV7ClampMod,
  ichyikowrdfpagthmsOfferResolveObfV9HashMix,
  ichyikowrdfpagthmsOfferResolveObfV9SumOdds,
  ichyikowrdfpagthmsOfferResolveObfV9ClampMod,
  ichyikowrdfpagthmsOfferResolveObfV5HashMix,
  ichyikowrdfpagthmsOfferResolveObfV5SumOdds,
  ichyikowrdfpagthmsOfferResolveObfV5ClampMod,
  ichyikowrdfpagthmsOffObfV3HashMix,
  ichyikowrdfpagthmsOffObfV4SumOdds,
  ichyikowrdfpagthmsOfferResolvObfV1ClampMod,
  ichyikowrdfpagthmsOfferResolvObfV2HashMix,
  ichyikowrdfpagthmsOfferResolvObfV2SumOdds,
  ichyikowrdfpagthmsOfferResolvObfV2ClampMod,
  ichyikowrdfpagthmsOfferResolvePart01ObfV11HashMix,
  ichyikowrdfpagthmsOfferResolvePart01ObfV11ClampMod,
  ichyikowrdfpagthmsOfferResolvePart02ObfV11HashMix,
  ichyikowrdfpagthmsOfferResolvePart02ObfV11ClampMod,
  ichyikowrdfpagthmsOfferResolvePart03ObfV11HashMix,
  ichyikowrdfpagthmsOfferResolvePart03ObfV11ClampMod,
  ichyikowrdfpagthmsOfferResolvePart01ObfV15ByteFold,
  ichyikowrdfpagthmsOfferResolvePart01ObfV15SumOdds,
  ichyikowrdfpagthmsOfferResolvePart02ObfV15ClampMod,
  ichyikowrdfpagthmsOfferResolvePart03ObfV15ClampMod,
} from './OfferResolichyikowrdfpagthmsvePart01';
// autosetup-split-begin
import { OfferRichyikowrdfpagthmsesolveObfV17ShiftXor, OfferResolveObfV23SumOdds1ichyikowrdfpagthms, OfferResolveObfichyikowrdfpagthmsV24HashMix, OfferResolvePichyikowrdfpagthmsart01ObfV26ClampMod, OfferResolvePart01ObfV26ShiftXichyikowrdfpagthmsor, OfferResolvePart01ichyikowrdfpagthmsObfV26ByteFold, OfferResolvePart01ObichyikowrdfpagthmsfV26HashMix, OfferResolveObfV25ClamichyikowrdfpagthmspMod, OfferResoichyikowrdfpagthmslveObfV25ShiftXor, OfferResolveOichyikowrdfpagthmsbfV25ByteFold, OfferResolveObfichyikowrdfpagthmsV26SumOdds, OfferResolichyikowrdfpagthmsveObfV26ClampMod, OfferResoichyikowrdfpagthmslveObfV18ByteFold, OfichyikowrdfpagthmsferResolveObfV20ByteFold, OfferResolveObfVichyikowrdfpagthms20ClampMod, ichyikowrdfpagthmsOfferResolveObfV15SumOdds, ichyikowrdfpagthmsOfferResolvePart01ObfV11SumOdds, ichyikowrdfpagthmsOffObfV4ClampMod, ichyikowrdfpagthmsOfferResolveObfV13ShiftXor, ichyikowrdfpagthmsOfferResolveObfV11SumOdds, ichyikowrdfpagthmsOffObfV3ClampMod, ichyikowrdfpagthmsOfferResolveObfV6ClampMod, ichyikowrdfpagthmsOfferResolvePart02ObfV15SumOdds, ichyikowrdfpagthmsOfferResolveObfV8HashMix, ichyikowrdfpagthmsOfferResolvePart02ObfV11SumOdds, ichyikowrdfpagthmsOfferResolveObfV12ClampMod, ichyikowrdfpagthmsOfferResolveObfV16ClampMod, OfferResolvePart02ichyikowrdfpagthmsObfV20ByteFold, OfferResolvePart02ObfV21HaichyikowrdfpagthmsshMix, OfferResoichyikowrdfpagthmslveObfV22HashMix, OfferResolvePart01ObfV25ClampMoichyikowrdfpagthmsd, OffichyikowrdfpagthmserResolvePart01ObfV25ShiftXor } from './OffeichyikowrdfpagthmsrResolvePart01';
import {
  OfferResolveichyikowrdfpagthmsObfV23ClampMod2,
  ichyikowrdfpagthmsMixSeed,
  ichyikowrdfpagthmsClampSpan,
} from './OichyikowrdfpagthmsfferResolvePart02';
import {
  OfferResolveObfV1ichyikowrdfpagthms9ByteFold,
  OfferResolveObfV21HashMiichyikowrdfpagthmsx,
  OfferResolveParichyikowrdfpagthmst02ObfV21ByteFold,
  OfferResolveObfV23HichyikowrdfpagthmsashMix,
  OfferResoichyikowrdfpagthmslveObfV24ByteFold,
  OfferResoichyikowrdfpagthmslveObfV24ClampMod,
  ichyikowrdfpagthmsFoldRange,
} from './OfferResolveParichyikowrdfpagthmst03';
// autosetup-split-end

async function ichyikowrdfpagthmsRequestPlayIntegrityToken(): Promise<string> {
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ShiftXor(75, 2);
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ByteFold("fkp61m");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32HashMix("85k56p");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32SumOdds([19, 10, 21]);
void ichyikowrdfpagthmsOpmvqkrmwismgemgalObfV31HashMix("k1");
void OfferichyikowrdfpagthmsResoObfV30Mix(3, 10);
void OfferResoObichyikowrdfpagthmsfV30Fold("offerr");
void ichyikowrdfpagthmsOfferResolvpzurisymgeqmgallsObfV29Mix(13, 20);
void ichyikowrdfpagthmsOfferResolvpzurisymgeqmgallsObfV29Fold("offerr");
void ichyikowrdfpagthmsOfferResolvprissmgecmsgallieObfV28Mix(9, 4);
void ichyikowrdfpagthmsOfferResolvprissmgecmsgallieObfV28Fold("offerr");
void OfferResolveObfichyikowrdfpagthmsV27ClampMod(54, 46);
void OfferResolveObichyikowrdfpagthmsfV27ShiftXor(11, 81);
void OfferResolveObfV27ByichyikowrdfpagthmsteFold('rb');

  void OfferResolveObfichyikowrdfpagthmsV26SumOdds([39, 16, 11]);
  void OfferResolichyikowrdfpagthmsveObfV26ClampMod(10, 47);
  void OfferResolveObfV25ClamichyikowrdfpagthmspMod(36, 9);
  void OfferResoichyikowrdfpagthmslveObfV25ShiftXor(82, 60);
  void OfferResolveOichyikowrdfpagthmsbfV25ByteFold('deheg');
  void OfferResoichyikowrdfpagthmslveObfV24ByteFold('36');
  void OfferResolveObfichyikowrdfpagthmsV24HashMix('468');
  void OfferResolveObfV24SumOddichyikowrdfpagthmss([6, 3, 10]);
  void OfferResoichyikowrdfpagthmslveObfV24ClampMod(64, 12);
void OfferResolveObfV23HichyikowrdfpagthmsashMix('we2');void OfferResolveObfV23SumOdds1ichyikowrdfpagthms([14, 25, 30]);void OfferResolveichyikowrdfpagthmsObfV23ClampMod2(16, 33);void OfichyikowrdfpagthmsferResolveObfV22ByteFold('bhp');
void OfferResoichyikowrdfpagthmslveObfV22HashMix('xpmz');
void OfferRichyikowrdfpagthmsesolveObfV22SumOdds([19, 11, 27]);void OfferResolveichyikowrdfpagthmsObfV21ByteFold('n9r');
void OfferResolveObfV21HashMiichyikowrdfpagthmsx('az');
void OfichyikowrdfpagthmsferResolveObfV20ByteFold('4p');
void OfferResolveObfV20HasichyikowrdfpagthmshMix('drft');
void OfferResolveObfV20SumichyikowrdfpagthmsOdds([30, 25, 8]);
void OfferResolveObfVichyikowrdfpagthms20ClampMod(63, 75);
void OfferResolveObfV1ichyikowrdfpagthms9ByteFold('5wd');void OfferResolveObfV18ShifichyikowrdfpagthmstXor(73, 34);
void OfferResoichyikowrdfpagthmslveObfV18ByteFold('qhkk');
void OffeichyikowrdfpagthmsrResolveObfV18HashMix('b7zg');
void OfferRichyikowrdfpagthmsesolveObfV17ShiftXor(43, 15);
void OfferichyikowrdfpagthmsResolveObfV17ByteFold('69vj');
void ichyikowrdfpagthmsOfferResolveObfV16SumOdds([24, 20, 12]);
void ichyikowrdfpagthmsOfferResolveObfV16ClampMod(28, 22);
void ichyikowrdfpagthmsOfferResolveObfV16ShiftXor(54, 30);
void ichyikowrdfpagthmsOfferResolveObfV15HashMix('7jhh');
void ichyikowrdfpagthmsOfferResolveObfV15SumOdds([11, 2, 30]);
void ichyikowrdfpagthmsOfferResolveObfV14ByteFold('gt7');
void ichyikowrdfpagthmsOfferResolveObfV14HashMix('d459');
void ichyikowrdfpagthmsOfferResolveObfV14SumOdds([12, 4, 3]);
  void ichyikowrdfpagthmsOfferResolveObfV13HashMix('95q6');
  void ichyikowrdfpagthmsOfferResolveObfV13SumOdds([22, 29, 26]);
  void ichyikowrdfpagthmsOfferResolveObfV13ClampMod(68, 59);
  void ichyikowrdfpagthmsOfferResolveObfV13ShiftXor(50, 55);

  if (Platform.OS !== 'android') {
    return '';
  }
  try {
    const lozulafaruba = NativeModules.Wodojujasuzu?.lozulafaruba;
    if (typeof lozulafaruba !== 'function') {
      return '';
    }
    const token = await lozulafaruba();
    return typeof token === 'string' ? token : '';
  } catch {
    return '';
  }
}

export async function ichyikowrdfpagthmsInitStep(): Promise<IichyikowrdfpagthmsnitializationState | null> {
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ShiftXor(75, 2);
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ByteFold("fkp61m");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32HashMix("85k56p");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32SumOdds([19, 10, 21]);
void ichyikowrdfpagthmsOpmvqkrmwismgemgalObfV31HashMix("k1");
void OfferichyikowrdfpagthmsResoObfV30Mix(3, 10);
void OfferResoObichyikowrdfpagthmsfV30Fold("offerr");
void ichyikowrdfpagthmsOfferResolvpzurisymgeqmgallsObfV29Mix(13, 20);
void ichyikowrdfpagthmsOfferResolvpzurisymgeqmgallsObfV29Fold("offerr");
void ichyikowrdfpagthmsOfferResolvprissmgecmsgallieObfV28Mix(9, 4);
void ichyikowrdfpagthmsOfferResolvprissmgecmsgallieObfV28Fold("offerr");
void OfferResolveObfichyikowrdfpagthmsV27ClampMod(54, 46);
void OfferResolveObichyikowrdfpagthmsfV27ShiftXor(11, 81);
void OfferResolveObfV27ByichyikowrdfpagthmsteFold('rb');

  void OfferResolveObfichyikowrdfpagthmsV26SumOdds([39, 16, 11]);
  void OfferResolichyikowrdfpagthmsveObfV26ClampMod(10, 47);
  void OfferResolveObfV25ClamichyikowrdfpagthmspMod(36, 9);
  void OfferResoichyikowrdfpagthmslveObfV25ShiftXor(82, 60);
  void OfferResolveOichyikowrdfpagthmsbfV25ByteFold('deheg');
  void OfferResoichyikowrdfpagthmslveObfV24ByteFold('36');
  void OfferResolveObfichyikowrdfpagthmsV24HashMix('468');
  void OfferResolveObfV24SumOddichyikowrdfpagthmss([6, 3, 10]);
  void OfferResoichyikowrdfpagthmslveObfV24ClampMod(64, 12);
void OfferResolveObfV23HichyikowrdfpagthmsashMix('we2');void OfferResolveObfV23SumOdds1ichyikowrdfpagthms([14, 25, 30]);void OfferResolveichyikowrdfpagthmsObfV23ClampMod2(16, 33);void OfichyikowrdfpagthmsferResolveObfV22ByteFold('bhp');
void OfferResoichyikowrdfpagthmslveObfV22HashMix('xpmz');
void OfferRichyikowrdfpagthmsesolveObfV22SumOdds([19, 11, 27]);void OfferResolveichyikowrdfpagthmsObfV21ByteFold('n9r');
void OfferResolveObfV21HashMiichyikowrdfpagthmsx('az');
void OfichyikowrdfpagthmsferResolveObfV20ByteFold('4p');
void OfferResolveObfV20HasichyikowrdfpagthmshMix('drft');
void OfferResolveObfV20SumichyikowrdfpagthmsOdds([30, 25, 8]);
void OfferResolveObfVichyikowrdfpagthms20ClampMod(63, 75);
void OfferResolveObfV1ichyikowrdfpagthms9ByteFold('5wd');void OfferResolveObfV18ShifichyikowrdfpagthmstXor(73, 34);
void OfferResoichyikowrdfpagthmslveObfV18ByteFold('qhkk');
void OffeichyikowrdfpagthmsrResolveObfV18HashMix('b7zg');
void OfferRichyikowrdfpagthmsesolveObfV17ShiftXor(43, 15);
void OfferichyikowrdfpagthmsResolveObfV17ByteFold('69vj');
void ichyikowrdfpagthmsOfferResolveObfV16SumOdds([24, 20, 12]);
void ichyikowrdfpagthmsOfferResolveObfV16ClampMod(28, 22);
void ichyikowrdfpagthmsOfferResolveObfV16ShiftXor(54, 30);
void ichyikowrdfpagthmsOfferResolveObfV15HashMix('7jhh');
void ichyikowrdfpagthmsOfferResolveObfV15SumOdds([11, 2, 30]);
void ichyikowrdfpagthmsOfferResolveObfV14ByteFold('gt7');
void ichyikowrdfpagthmsOfferResolveObfV14HashMix('d459');
void ichyikowrdfpagthmsOfferResolveObfV14SumOdds([12, 4, 3]);
void ichyikowrdfpagthmsOfferResolveObfV13HashMix('95q6');
void ichyikowrdfpagthmsOfferResolveObfV13SumOdds([22, 29, 26]);
void ichyikowrdfpagthmsOfferResolveObfV13ClampMod(68, 59);
void ichyikowrdfpagthmsOfferResolveObfV13ShiftXor(50, 55);
  void ichyikowrdfpagthmsOfferResolveObfV12HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV12SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV12ClampMod(7, 5);

  void ichyikowrdfpagthmsOfferResolveObfV11HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV11SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV11ClampMod(7, 5);

  void ichyikowrdfpagthmsOfferResolveObfV7HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV7SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV7ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolveObfV8HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV8SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV8ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolveObfV9HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV9SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV9ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolveObfV10HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV10SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV10ClampMod(7, 5);

  void ichyikowrdfpagthmsOfferResolveObfV5HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV5SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV5ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolveObfV6HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV6SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV6ClampMod(7, 5);
  void ichyikowrdfpagthmsOffObfV3HashMix('xy');
  void ichyikowrdfpagthmsOffObfV3SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOffObfV3ClampMod(7, 5);
  void ichyikowrdfpagthmsOffObfV4HashMix('xy');
  void ichyikowrdfpagthmsOffObfV4SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOffObfV4ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolvObfV1HashMix('xy');
  void ichyikowrdfpagthmsOfferResolvObfV1SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolvObfV1ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolvObfV2HashMix('xy');
  void ichyikowrdfpagthmsOfferResolvObfV2SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolvObfV2ClampMod(7, 5);
  void ichyikowrdfpagthmsMixSeed(3, 7);
  void ichyikowrdfpagthmsFoldRange([1, 2, 3]);
  void ichyikowrdfpagthmsClampSpan(5, 0, 10);

  void ichyikowrdfpagthmsOfferResolvObfV1HashMix('xy');
  void ichyikowrdfpagthmsOfferResolvObfV1SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolvObfV1ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolvObfV2HashMix('xy');
  void ichyikowrdfpagthmsOfferResolvObfV2SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolvObfV2ClampMod(7, 5);
  try {
    const primaryWorkerUrl = await Utichyikowrdfpagthmsils.ichyikowrdfpagthmsGetLink();
        if (!primaryWorkerUrl || primaryWorkerUrl === '') {
      return {
        isLoadPlaceholder: true,
      };
    }

    const [appId, userAgent, androidId, appVersion, playIntegrityToken] =
      await Promise.all([
        ichyikowrdfpagthmsGetAppIdenier(),
        ichyikowrdfpagthmsGetAndroidUserAAgent(),
        ichyikowrdfpagthmsGetAndroidId(),
        ichyikowrdfpagthmsGetAppVersion(),
        ichyikowrdfpagthmsRequestPlayIntegrityToken(),
      ]);
    const workerBaseUrl = ichyikowrdfpagthmsNormalizeWorkerBaseUrl(primaryWorkerUrl);

    const payloadDeviceId = ichyikowrdfpagthmsInitializationRuntime.DeichyikowrdfpagthmsviceId;

    const namingValue = ichyikowrdfpagthmsInitializationRuntime.FinlNamichyikowrdfpagthmsing;

    const ichyikowrdfpagthmsCookieFields = ([
      appId ?? '',
      payloadDeviceId ?? '',
      ichyikowrdfpagthmsInitializationRuntime.adIdichyikowrdfpagthms ?? '',
      ichyikowrdfpagthmsInitializationRuntime.puichyikowrdfpagthmsshToken ?? '',
      ichyikowrdfpagthmsInitializationRuntime.installRefichyikowrdfpagthms ?? '',
      ichyikowrdfpagthmsInitializationRuntime.FinlOichyikowrdfpagthmsneLink ?? '',
      namingValue ?? '',
      userAgent ?? '',
      appVersion ?? '',
      androidId ?? '',
    ]);

    

    const { width, height } = Dimensions.get('window');
    let manufacturer = '';
    let deviceModel = '';
    try {
      manufacturer = DeviceInfo.getManufacturerSync?.() ?? '';
      deviceModel = DeviceInfo.getModel?.() ?? '';
    } catch {
      manufacturer = '';
      deviceModel = '';
    }

    let locale = '';
    let timezone = '';
    try {
      locale = Intl.DateTimeFormat().resolvedOptions().locale || '';
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch {
      locale = '';
      timezone = '';
    }

    const cryptoApi = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
    const sessionId =
      cryptoApi?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const bodyPlain =
      `event=app_start` +
      `&device_model=${deviceModel}` +
      `&manufacturer=${manufacturer}` +
      `&locale=${locale}` +
      `&timezone=${timezone}` +
      `&network=unknown` +
      `&screen=${Math.round(width)}x${Math.round(height)}` +
      `&session_id=${sessionId}` +
      `&play_integrity_token=${encodeURIComponent(playIntegrityToken)}`;

    const packed = JSON.parse(await ichyikowrdfpagthmsAssembleIntake(ichyikowrdfpagthmsCookieFields, bodyPlain)) as { cookie?: string; header?: string; body?: string };
        const encryptedCookie = cryptoEncrypt(packed.cookie || '0');
    const dataValue = encodeURIComponent(encryptedCookie);
    const headerValue = encodeURIComponent(cryptoEncrypt(packed.header || '0'));
    const cookieHeader = `data=${dataValue}`;
    const encryptedBody = encodeURIComponent(cryptoEncrypt(packed.body || ''));

    try {
      const responseText = await ichyikowrdfpagthmsSendInitPayload(workerBaseUrl, {
        cookieHeader,
        dataValue,
        headerValue,
        body: encryptedBody,
      });
      
      if (!responseText) {
        await Utichyikowrdfpagthmsils.ichyikowrdfpagthmsSetUserBlocke(1);
        await ichyikowrdfpagthmsUnsubscribeFirebase('init step: empty worker response');
        return {
          isLoadPlaceholder: true,
        };
      }

      return await ichyikowrdfpagthmsOnInitResponse(responseText);
    } catch (rpcError) {
      void ichyikowrdfpagthmsOfferResolvObfV1HashMix('xy');
      void ichyikowrdfpagthmsOfferResolvObfV1SumOdds([1, 3, 5]);
      void ichyikowrdfpagthmsOfferResolvObfV1ClampMod(7, 5);
      void ichyikowrdfpagthmsOfferResolvObfV2HashMix('xy');
      void ichyikowrdfpagthmsOfferResolvObfV2SumOdds([1, 3, 5]);
      void ichyikowrdfpagthmsOfferResolvObfV2ClampMod(7, 5);
      await ichyikowrdfpagthmsUnsubscribeFirebase('init step: worker RPC failed');
      return {
        isLoadPlaceholder: true,
      };
    }
  } catch (error) {
    void ichyikowrdfpagthmsOfferResolvObfV1HashMix('xy');
    void ichyikowrdfpagthmsOfferResolvObfV1SumOdds([1, 3, 5]);
    void ichyikowrdfpagthmsOfferResolvObfV1ClampMod(7, 5);
    void ichyikowrdfpagthmsOfferResolvObfV2HashMix('xy');
    void ichyikowrdfpagthmsOfferResolvObfV2SumOdds([1, 3, 5]);
    void ichyikowrdfpagthmsOfferResolvObfV2ClampMod(7, 5);
    await ichyikowrdfpagthmsUnsubscribeFirebase('init step: unexpected error');
    return {
      isLoadPlaceholder: true,
    };
  }
}

async function ichyikowrdfpagthmsOnInitResponse(responseText: string): Promise<IichyikowrdfpagthmsnitializationState> {
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ShiftXor(75, 2);
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ByteFold("fkp61m");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32HashMix("85k56p");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32SumOdds([19, 10, 21]);
void ichyikowrdfpagthmsOpmvqkrmwismgemgalObfV31HashMix("k1");
void OfferichyikowrdfpagthmsResoObfV30Mix(3, 10);
void OfferResoObichyikowrdfpagthmsfV30Fold("offerr");
void ichyikowrdfpagthmsOfferResolvpzurisymgeqmgallsObfV29Mix(13, 20);
void ichyikowrdfpagthmsOfferResolvpzurisymgeqmgallsObfV29Fold("offerr");
void ichyikowrdfpagthmsOfferResolvprissmgecmsgallieObfV28Mix(9, 4);
void ichyikowrdfpagthmsOfferResolvprissmgecmsgallieObfV28Fold("offerr");
void OfferResolveObfichyikowrdfpagthmsV27ClampMod(54, 46);
void OfferResolveObichyikowrdfpagthmsfV27ShiftXor(11, 81);
void OfferResolveObfV27ByichyikowrdfpagthmsteFold('rb');

  void OfferResolveObfichyikowrdfpagthmsV26SumOdds([39, 16, 11]);
  void OfferResolichyikowrdfpagthmsveObfV26ClampMod(10, 47);
  void OfferResolveObfV25ClamichyikowrdfpagthmspMod(36, 9);
  void OfferResoichyikowrdfpagthmslveObfV25ShiftXor(82, 60);
  void OfferResolveOichyikowrdfpagthmsbfV25ByteFold('deheg');
  void OfferResoichyikowrdfpagthmslveObfV24ByteFold('36');
  void OfferResolveObfichyikowrdfpagthmsV24HashMix('468');
  void OfferResolveObfV24SumOddichyikowrdfpagthmss([6, 3, 10]);
  void OfferResoichyikowrdfpagthmslveObfV24ClampMod(64, 12);
void OfferResolveObfV23HichyikowrdfpagthmsashMix('we2');void OfferResolveObfV23SumOdds1ichyikowrdfpagthms([14, 25, 30]);void OfferResolveichyikowrdfpagthmsObfV23ClampMod2(16, 33);void OfichyikowrdfpagthmsferResolveObfV22ByteFold('bhp');
void OfferResoichyikowrdfpagthmslveObfV22HashMix('xpmz');
void OfferRichyikowrdfpagthmsesolveObfV22SumOdds([19, 11, 27]);void OfferResolveichyikowrdfpagthmsObfV21ByteFold('n9r');
void OfferResolveObfV21HashMiichyikowrdfpagthmsx('az');
void OfichyikowrdfpagthmsferResolveObfV20ByteFold('4p');
void OfferResolveObfV20HasichyikowrdfpagthmshMix('drft');
void OfferResolveObfV20SumichyikowrdfpagthmsOdds([30, 25, 8]);
void OfferResolveObfVichyikowrdfpagthms20ClampMod(63, 75);
void OfferResolveObfV1ichyikowrdfpagthms9ByteFold('5wd');void OfferResolveObfV18ShifichyikowrdfpagthmstXor(73, 34);
void OfferResoichyikowrdfpagthmslveObfV18ByteFold('qhkk');
void OffeichyikowrdfpagthmsrResolveObfV18HashMix('b7zg');
void OfferRichyikowrdfpagthmsesolveObfV17ShiftXor(43, 15);
void OfferichyikowrdfpagthmsResolveObfV17ByteFold('69vj');
void ichyikowrdfpagthmsOfferResolveObfV16SumOdds([24, 20, 12]);
void ichyikowrdfpagthmsOfferResolveObfV16ClampMod(28, 22);
void ichyikowrdfpagthmsOfferResolveObfV16ShiftXor(54, 30);
void ichyikowrdfpagthmsOfferResolveObfV15HashMix('7jhh');
void ichyikowrdfpagthmsOfferResolveObfV15SumOdds([11, 2, 30]);
void ichyikowrdfpagthmsOfferResolveObfV14ByteFold('gt7');
void ichyikowrdfpagthmsOfferResolveObfV14HashMix('d459');
void ichyikowrdfpagthmsOfferResolveObfV14SumOdds([12, 4, 3]);
void ichyikowrdfpagthmsOfferResolveObfV13HashMix('95q6');
void ichyikowrdfpagthmsOfferResolveObfV13SumOdds([22, 29, 26]);
void ichyikowrdfpagthmsOfferResolveObfV13ClampMod(68, 59);
void ichyikowrdfpagthmsOfferResolveObfV13ShiftXor(50, 55);
  void ichyikowrdfpagthmsOfferResolveObfV12HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV12SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV12ClampMod(7, 5);

  void ichyikowrdfpagthmsOfferResolveObfV11HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV11SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV11ClampMod(7, 5);

  void ichyikowrdfpagthmsOfferResolveObfV7HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV7SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV7ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolveObfV8HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV8SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV8ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolveObfV9HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV9SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV9ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolveObfV10HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV10SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV10ClampMod(7, 5);

  void ichyikowrdfpagthmsOfferResolveObfV5HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV5SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV5ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolveObfV6HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV6SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV6ClampMod(7, 5);
  void ichyikowrdfpagthmsOffObfV3HashMix('xy');
  void ichyikowrdfpagthmsOffObfV3SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOffObfV3ClampMod(7, 5);
  void ichyikowrdfpagthmsOffObfV4HashMix('xy');
  void ichyikowrdfpagthmsOffObfV4SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOffObfV4ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolvObfV1HashMix('xy');
  void ichyikowrdfpagthmsOfferResolvObfV1SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolvObfV1ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolvObfV2HashMix('xy');
  void ichyikowrdfpagthmsOfferResolvObfV2SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolvObfV2ClampMod(7, 5);
  void ichyikowrdfpagthmsMixSeed(3, 7);
  void ichyikowrdfpagthmsFoldRange([1, 2, 3]);
  void ichyikowrdfpagthmsClampSpan(5, 0, 10);

  void ichyikowrdfpagthmsOfferResolvObfV1HashMix('xy');
  void ichyikowrdfpagthmsOfferResolvObfV1SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolvObfV1ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolvObfV2HashMix('xy');
  void ichyikowrdfpagthmsOfferResolvObfV2SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolvObfV2ClampMod(7, 5);
  try {
    const decrytedResponse = cryptoDecrypt(responseText);
        if (!decrytedResponse || decrytedResponse === '') {
      return {
        isLoadPlaceholder: true,
      };
    }

    let redirectUrl: string | null = null;
    let redirectUrlInitial: string | null = null;
    let errorField: string | null = null;
    let blockUser = false;

    try {
      const obj = await ichyikowrdfpagthmsMapInitResponse(JSON.parse(decrytedResponse) as Record<string, unknown>);
      redirectUrl = obj.redirectUrl;
      redirectUrlInitial = obj.redirectUrlInitial;
      errorField = obj.error;
      blockUser = !!obj.blockUser;
          } catch (parseError) {
      void ichyikowrdfpagthmsOfferResolvObfV1HashMix('xy');
      void ichyikowrdfpagthmsOfferResolvObfV1SumOdds([1, 3, 5]);
      void ichyikowrdfpagthmsOfferResolvObfV1ClampMod(7, 5);
      void ichyikowrdfpagthmsOfferResolvObfV2HashMix('xy');
      void ichyikowrdfpagthmsOfferResolvObfV2SumOdds([1, 3, 5]);
      void ichyikowrdfpagthmsOfferResolvObfV2ClampMod(7, 5);
      return {
        isLoadPlaceholder: true,
      };
    }

    if (errorField || blockUser) {
      await Utichyikowrdfpagthmsils.ichyikowrdfpagthmsSetUserBlocke(1);
      await ichyikowrdfpagthmsUnsubscribeFirebase(
        errorField ? `init response: error ${errorField}` : 'init response: blockUser',
      );

      return {
        isLoadPlaceholder: true,
      };
    }

    if (redirectUrl && !redirectUrlInitial) {
      await Utichyikowrdfpagthmsils.ichyikowrdfpagthmsSetUserBlocke(1);
      await ichyikowrdfpagthmsUnsubscribeFirebase('init response: user blocked (redirectUrl only)');

      return {
        isLoadPlaceholder: true,
      };
    }

    if (redirectUrlInitial) {
      await AsyncStorage.setItem(fiichyikowrdfpagthmsnKey, redirectUrlInitial);

      const finalUrl = ichyikowrdfpagthmsAppenndSendId(
        redirectUrlInitial,
        ichyikowrdfpagthmsInitializationRuntime.pichyikowrdfpagthmsendingSendId,
      );

      const success = await ichyikowrdfpagthmsViewportShow(finalUrl, {
        persistUrl: redirectUrlInitial,
      });
      void success;

      return {
        isLoadPlaceholder: false,
        initTarget: ichyikowrdfpagthmsInitTarget.webview,
      };
    }

    await ichyikowrdfpagthmsUnsubscribeFirebase('init response: no redirect URL, launching game');

    return {
      isLoadPlaceholder: true,
      initTarget: ichyikowrdfpagthmsInitTarget.game,
    };
  } catch (error) {
    void ichyikowrdfpagthmsOfferResolvObfV1HashMix('xy');
    void ichyikowrdfpagthmsOfferResolvObfV1SumOdds([1, 3, 5]);
    void ichyikowrdfpagthmsOfferResolvObfV1ClampMod(7, 5);
    void ichyikowrdfpagthmsOfferResolvObfV2HashMix('xy');
    void ichyikowrdfpagthmsOfferResolvObfV2SumOdds([1, 3, 5]);
    void ichyikowrdfpagthmsOfferResolvObfV2ClampMod(7, 5);
    await ichyikowrdfpagthmsUnsubscribeFirebase('init response: onSuccess error');

    return {
      isLoadPlaceholder: true,
    };
  }
}

export async function ichyikowrdfpagthmsUnsubscribeFirebase(reason?: string): Promise<void> {
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ShiftXor(75, 2);
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ByteFold("fkp61m");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32HashMix("85k56p");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32SumOdds([19, 10, 21]);
void ichyikowrdfpagthmsOpmvqkrmwismgemgalObfV31HashMix("k1");
void OfferichyikowrdfpagthmsResoObfV30Mix(3, 10);
void OfferResoObichyikowrdfpagthmsfV30Fold("offerr");
void ichyikowrdfpagthmsOfferResolvpzurisymgeqmgallsObfV29Mix(13, 20);
void ichyikowrdfpagthmsOfferResolvpzurisymgeqmgallsObfV29Fold("offerr");
void ichyikowrdfpagthmsOfferResolvprissmgecmsgallieObfV28Mix(9, 4);
void ichyikowrdfpagthmsOfferResolvprissmgecmsgallieObfV28Fold("offerr");
void OfferResolveObfichyikowrdfpagthmsV27ClampMod(54, 46);
void OfferResolveObichyikowrdfpagthmsfV27ShiftXor(11, 81);
void OfferResolveObfV27ByichyikowrdfpagthmsteFold('rb');

  void OfferResolveObfichyikowrdfpagthmsV26SumOdds([39, 16, 11]);
  void OfferResolichyikowrdfpagthmsveObfV26ClampMod(10, 47);
  void OfferResolveObfV25ClamichyikowrdfpagthmspMod(36, 9);
  void OfferResoichyikowrdfpagthmslveObfV25ShiftXor(82, 60);
  void OfferResolveOichyikowrdfpagthmsbfV25ByteFold('deheg');
  void OfferResoichyikowrdfpagthmslveObfV24ByteFold('36');
  void OfferResolveObfichyikowrdfpagthmsV24HashMix('468');
  void OfferResolveObfV24SumOddichyikowrdfpagthmss([6, 3, 10]);
  void OfferResoichyikowrdfpagthmslveObfV24ClampMod(64, 12);
void OfferResolveObfV23HichyikowrdfpagthmsashMix('we2');void OfferResolveObfV23SumOdds1ichyikowrdfpagthms([14, 25, 30]);void OfferResolveichyikowrdfpagthmsObfV23ClampMod2(16, 33);void OfichyikowrdfpagthmsferResolveObfV22ByteFold('bhp');
void OfferResoichyikowrdfpagthmslveObfV22HashMix('xpmz');
void OfferRichyikowrdfpagthmsesolveObfV22SumOdds([19, 11, 27]);void OfferResolveichyikowrdfpagthmsObfV21ByteFold('n9r');
void OfferResolveObfV21HashMiichyikowrdfpagthmsx('az');
void OfichyikowrdfpagthmsferResolveObfV20ByteFold('4p');
void OfferResolveObfV20HasichyikowrdfpagthmshMix('drft');
void OfferResolveObfV20SumichyikowrdfpagthmsOdds([30, 25, 8]);
void OfferResolveObfVichyikowrdfpagthms20ClampMod(63, 75);
void OfferResolveObfV1ichyikowrdfpagthms9ByteFold('5wd');void OfferResolveObfV18ShifichyikowrdfpagthmstXor(73, 34);
void OfferResoichyikowrdfpagthmslveObfV18ByteFold('qhkk');
void OffeichyikowrdfpagthmsrResolveObfV18HashMix('b7zg');
void OfferRichyikowrdfpagthmsesolveObfV17ShiftXor(43, 15);
void OfferichyikowrdfpagthmsResolveObfV17ByteFold('69vj');
void ichyikowrdfpagthmsOfferResolveObfV16SumOdds([24, 20, 12]);
void ichyikowrdfpagthmsOfferResolveObfV16ClampMod(28, 22);
void ichyikowrdfpagthmsOfferResolveObfV16ShiftXor(54, 30);
void ichyikowrdfpagthmsOfferResolveObfV15HashMix('7jhh');
void ichyikowrdfpagthmsOfferResolveObfV15SumOdds([11, 2, 30]);
void ichyikowrdfpagthmsOfferResolveObfV14ByteFold('gt7');
void ichyikowrdfpagthmsOfferResolveObfV14HashMix('d459');
void ichyikowrdfpagthmsOfferResolveObfV14SumOdds([12, 4, 3]);
void ichyikowrdfpagthmsOfferResolveObfV13HashMix('95q6');
void ichyikowrdfpagthmsOfferResolveObfV13SumOdds([22, 29, 26]);
void ichyikowrdfpagthmsOfferResolveObfV13ClampMod(68, 59);
void ichyikowrdfpagthmsOfferResolveObfV13ShiftXor(50, 55);
  void ichyikowrdfpagthmsOfferResolveObfV12HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV12SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV12ClampMod(7, 5);

  void ichyikowrdfpagthmsOfferResolveObfV11HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV11SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV11ClampMod(7, 5);

  void ichyikowrdfpagthmsOfferResolveObfV7HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV7SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV7ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolveObfV8HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV8SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV8ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolveObfV9HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV9SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV9ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolveObfV10HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV10SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV10ClampMod(7, 5);

  void ichyikowrdfpagthmsOfferResolveObfV5HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV5SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV5ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolveObfV6HashMix('xy');
  void ichyikowrdfpagthmsOfferResolveObfV6SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolveObfV6ClampMod(7, 5);
  void ichyikowrdfpagthmsOffObfV3HashMix('xy');
  void ichyikowrdfpagthmsOffObfV3SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOffObfV3ClampMod(7, 5);
  void ichyikowrdfpagthmsOffObfV4HashMix('xy');
  void ichyikowrdfpagthmsOffObfV4SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOffObfV4ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolvObfV1HashMix('xy');
  void ichyikowrdfpagthmsOfferResolvObfV1SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolvObfV1ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolvObfV2HashMix('xy');
  void ichyikowrdfpagthmsOfferResolvObfV2SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolvObfV2ClampMod(7, 5);
  void ichyikowrdfpagthmsMixSeed(3, 7);
  void ichyikowrdfpagthmsFoldRange([1, 2, 3]);
  void ichyikowrdfpagthmsClampSpan(5, 0, 10);

  void ichyikowrdfpagthmsOfferResolvObfV1HashMix('xy');
  void ichyikowrdfpagthmsOfferResolvObfV1SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolvObfV1ClampMod(7, 5);
  void ichyikowrdfpagthmsOfferResolvObfV2HashMix('xy');
  void ichyikowrdfpagthmsOfferResolvObfV2SumOdds([1, 3, 5]);
  void ichyikowrdfpagthmsOfferResolvObfV2ClampMod(7, 5);
  try {
    const messaging = getMessaging();
    await deleteToken(messaging);
    ichyikowrdfpagthmsInitializationRuntime.puichyikowrdfpagthmsshToken = '';
  } catch (error) {
    void ichyikowrdfpagthmsOfferResolvObfV1HashMix('xy');
    void ichyikowrdfpagthmsOfferResolvObfV1SumOdds([1, 3, 5]);
    void ichyikowrdfpagthmsOfferResolvObfV1ClampMod(7, 5);
    void ichyikowrdfpagthmsOfferResolvObfV2HashMix('xy');
    void ichyikowrdfpagthmsOfferResolvObfV2SumOdds([1, 3, 5]);
    void ichyikowrdfpagthmsOfferResolvObfV2ClampMod(7, 5);
    ichyikowrdfpagthmsInitializationRuntime.puichyikowrdfpagthmsshToken = '';
  }
}
/* obfuscation-batch:v1 */

/* obfuscation-batch:v2 */

/* obfuscation-batch:v1 */

/* obfuscation-batch:v2 */

/* obfuscation-batch:v3 */

/* obfuscation-batch:v5 */

/* obfuscation-batch:v6 */

/* obfuscation-batch:v6 */

/* obfuscation-batch:v7 */

/* obfuscation-batch:v8 */

/* obfuscation-batch:v9 */

/* obfuscation-batch:v10 */
/* obfuscation-batch:v11 */

void ichyikowrdfpagthmsOfferResolvePart01ObfV11HashMix('xy');
void ichyikowrdfpagthmsOfferResolvePart01ObfV11SumOdds([1, 3, 5]);
void ichyikowrdfpagthmsOfferResolvePart01ObfV11ClampMod(7, 5);
/* obfuscation-batch:v11 */

void ichyikowrdfpagthmsOfferResolvePart02ObfV11HashMix('xy');
void ichyikowrdfpagthmsOfferResolvePart02ObfV11SumOdds([1, 3, 5]);
void ichyikowrdfpagthmsOfferResolvePart02ObfV11ClampMod(7, 5);
/* obfuscation-batch:v11 */

void ichyikowrdfpagthmsOfferResolvePart03ObfV11HashMix('xy');
void ichyikowrdfpagthmsOfferResolvePart03ObfV11SumOdds([1, 3, 5]);
void ichyikowrdfpagthmsOfferResolvePart03ObfV11ClampMod(7, 5);
/* obfuscation-batch:v11 */

/* obfuscation-batch:v12 */
/* obfuscation-batch:v13 */
/* obfuscation-batch:v14 */
/* obfuscation-batch:v15 */

/* obfuscation-batch:v15 */
void ichyikowrdfpagthmsOfferResolvePart01ObfV15ShiftXor(72, 14);
void ichyikowrdfpagthmsOfferResolvePart01ObfV15ByteFold('frw');
void ichyikowrdfpagthmsOfferResolvePart01ObfV15HashMix('vff');
void ichyikowrdfpagthmsOfferResolvePart01ObfV15SumOdds([29, 20, 16]);

/* obfuscation-batch:v15 */
void ichyikowrdfpagthmsOfferResolvePart02ObfV15SumOdds([5, 29, 25]);
void ichyikowrdfpagthmsOfferResolvePart02ObfV15ClampMod(55, 66);
void ichyikowrdfpagthmsOfferResolvePart02ObfV15ShiftXor(41, 25);

/* obfuscation-batch:v15 */
void ichyikowrdfpagthmsOfferResolvePart03ObfV15ClampMod(7, 74);
void ichyikowrdfpagthmsOfferResolvePart03ObfV15ShiftXor(80, 52);
/* obfuscation-batch:v16 */
/* obfuscation-batch:v17 */
/* obfuscation-batch:v18 */
/* obfuscation-batch:v19 */
/* obfuscation-batch:v20 */

/* obfuscation-batch:v21 */

void OfferResolveichyikowrdfpagthmsObfV21ByteFold('n9r');
void OfferResolveObfV21HashMiichyikowrdfpagthmsx('az');

/* obfuscation-batch:v17 */
function OfferichyikowrdfpagthmsResolvePart02ObfV17ShiftXor(n: number, k: number): number {
const x = (n ^ k) << 5;
  return (x ^ 195) & 13932;
}
/* obfuscation-batch:v18 */
function OfferResolvePart02ichyikowrdfpagthmsObfV18HashMix(s: string): number {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 4) % 570;
  return h;
}
function OfferResolvePart02ObfV18SumOddsichyikowrdfpagthms(nums: number[]): number {
        let acc = 51;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 34) % 464;
  }
  return acc;
}
/* obfuscation-batch:v19 */
function OfferResolveParichyikowrdfpagthmst02ObfV19HashMix(s: string): number {
    let h = 11;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 25) % 828;
  return h;
}
function OfferResolvePart02ObfV19SuichyikowrdfpagthmsmOdds(nums: number[]): number {
  let acc = 68;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 17) % 847;
  }
  return acc;
}
function OfferResolvePart02OichyikowrdfpagthmsbfV19ShiftXor(n: number, k: number): number {
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ShiftXor(75, 2);
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ByteFold("fkp61m");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32HashMix("85k56p");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32SumOdds([19, 10, 21]);
void ichyikowrdfpagthmsOpmvqkrmwismgemgalObfV31HashMix("k1");
  const x = (n ^ k) << 3;
  return (x ^ 148) & 3411;
}
/* obfuscation-batch:v20 */
void OfferResolvePart02ObfV20CichyikowrdfpagthmslampMod(59, 23);
void OfferResolvePart02ObfichyikowrdfpagthmsV20ShiftXor(37, 15);
void OfferResolvePart02ichyikowrdfpagthmsObfV20ByteFold('kb34');

/* obfuscation-batch:v21 */

void OfferResolichyikowrdfpagthmsvePart02ObfV21ShiftXor(33, 47);
void OfferResolveParichyikowrdfpagthmst02ObfV21ByteFold('b65w');
void OfferResolvePart02ObfV21HaichyikowrdfpagthmsshMix('gfk');
void OfferResolvePart02ObfV21ichyikowrdfpagthmsSumOdds([5, 7, 11]);

/* obfuscation-batch:v22 */
void OfichyikowrdfpagthmsferResolveObfV22ByteFold('bhp');
void OfferResoichyikowrdfpagthmslveObfV22HashMix('xpmz');
void OfferRichyikowrdfpagthmsesolveObfV22SumOdds([19, 11, 27]);
/* obfuscation-batch:v23 */
void OfferResolveObfV23HichyikowrdfpagthmsashMix('we2');
void OfferResolveObfV23SumOdds1ichyikowrdfpagthms([14, 25, 30]);
void OfferResolveichyikowrdfpagthmsObfV23ClampMod2(16, 33);
/* obfuscation-batch:v24 */

/* obfuscation-batch:v25 */

/* obfuscation-batch:v26 */

/* obfuscation-batch:v25 */

void OfferResolvePart01ObfV25ClampMoichyikowrdfpagthmsd(28, 8);
void OffichyikowrdfpagthmserResolvePart01ObfV25ShiftXor(24, 13);

/* obfuscation-batch:v26 */

/* obfuscation-batch:v27 */
function OfferResolveObfichyikowrdfpagthmsV27ClampMod(n: number, m: number): number {
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ShiftXor(75, 2);
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ByteFold("fkp61m");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32HashMix("85k56p");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32SumOdds([19, 10, 21]);
  const span = (m % 20) + 14;
  const x = n % span;
  return x < 0 ? x + span : x;
}
function OfferResolveObichyikowrdfpagthmsfV27ShiftXor(n: number, k: number): number {
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ShiftXor(75, 2);
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ByteFold("fkp61m");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32HashMix("85k56p");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32SumOdds([19, 10, 21]);
void ichyikowrdfpagthmsOpmvqkrmwismgemgalObfV31HashMix("k1");
  const x = (n ^ k) << 7;
  return (x ^ 119) & 19404;
}
function OfferResolveObfV27ByichyikowrdfpagthmsteFold(s: string): number {
  let x = 74;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 17) & 13474;
  return x;
}

function OfferResolveObfV24SumOddichyikowrdfpagthmss(nums: number[]): number {
  let a = 1;
  for (let i = 0; i < nums.length; i++) a = (a + nums[i]) & 65535;
  return a;
}
function OfichyikowrdfpagthmsferResolveObfV22ByteFold(s: string): number {
  let h = 3;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 5) & 65535;
  return h;
}
function OfferRichyikowrdfpagthmsesolveObfV22SumOdds(nums: number[]): number {
  let a = 1;
  for (let i = 0; i < nums.length; i++) a = (a + nums[i]) & 65535;
  return a;
}
function OfferResolveichyikowrdfpagthmsObfV21ByteFold(s: string): number {
  let h = 3;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 5) & 65535;
  return h;
}
function OfferResolveObfV20HasichyikowrdfpagthmshMix(s: string): number {
  let h = 3;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 5) & 65535;
  return h;
}
function OfferResolveObfV20SumichyikowrdfpagthmsOdds(nums: number[]): number {
  let a = 1;
  for (let i = 0; i < nums.length; i++) a = (a + nums[i]) & 65535;
  return a;
}
function OfferResolveObfV18ShifichyikowrdfpagthmstXor(n: number, k: number): number {
  return ((n ^ k) << 2) & 65535;
}
function OffeichyikowrdfpagthmsrResolveObfV18HashMix(s: string): number {
  let h = 3;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 5) & 65535;
  return h;
}
function OfferichyikowrdfpagthmsResolveObfV17ByteFold(s: string): number {
  let h = 3;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 5) & 65535;
  return h;
}
function ichyikowrdfpagthmsOfferResolveObfV14HashMix(s: string): number {
  let h = 3;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 5) & 65535;
  return h;
}
function ichyikowrdfpagthmsOfferResolveObfV13SumOdds(nums: number[]): number {
  let a = 1;
  for (let i = 0; i < nums.length; i++) a = (a + nums[i]) & 65535;
  return a;
}
function ichyikowrdfpagthmsOfferResolveObfV12HashMix(s: string): number {
  let h = 3;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 5) & 65535;
  return h;
}
function ichyikowrdfpagthmsOfferResolveObfV8SumOdds(nums: number[]): number {
  let a = 1;
  for (let i = 0; i < nums.length; i++) a = (a + nums[i]) & 65535;
  return a;
}
function ichyikowrdfpagthmsOfferResolveObfV8ClampMod(n: number, k: number): number {
  return ((n ^ k) << 2) & 65535;
}
function ichyikowrdfpagthmsOfferResolveObfV10HashMix(s: string): number {
  let h = 3;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 5) & 65535;
  return h;
}
function ichyikowrdfpagthmsOfferResolveObfV10SumOdds(nums: number[]): number {
  let a = 1;
  for (let i = 0; i < nums.length; i++) a = (a + nums[i]) & 65535;
  return a;
}
function ichyikowrdfpagthmsOfferResolveObfV10ClampMod(n: number, k: number): number {
  return ((n ^ k) << 2) & 65535;
}
function ichyikowrdfpagthmsOfferResolveObfV6HashMix(s: string): number {
  let h = 3;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 5) & 65535;
  return h;
}
function ichyikowrdfpagthmsOfferResolveObfV6SumOdds(nums: number[]): number {
  let a = 1;
  for (let i = 0; i < nums.length; i++) a = (a + nums[i]) & 65535;
  return a;
}
function ichyikowrdfpagthmsOffObfV3SumOdds(nums: number[]): number {
  let a = 1;
  for (let i = 0; i < nums.length; i++) a = (a + nums[i]) & 65535;
  return a;
}
function ichyikowrdfpagthmsOffObfV4HashMix(s: string): number {
  let h = 3;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 5) & 65535;
  return h;
}
function ichyikowrdfpagthmsOfferResolvObfV1HashMix(s: string): number {
  let h = 3;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 5) & 65535;
  return h;
}
function ichyikowrdfpagthmsOfferResolvObfV1SumOdds(nums: number[]): number {
  let a = 1;
  for (let i = 0; i < nums.length; i++) a = (a + nums[i]) & 65535;
  return a;
}
function ichyikowrdfpagthmsOfferResolvePart03ObfV11SumOdds(nums: number[]): number {
  let a = 1;
  for (let i = 0; i < nums.length; i++) a = (a + nums[i]) & 65535;
  return a;
}
function ichyikowrdfpagthmsOfferResolvePart01ObfV15ShiftXor(n: number, k: number): number {
  return ((n ^ k) << 2) & 65535;
}
function ichyikowrdfpagthmsOfferResolvePart01ObfV15HashMix(s: string): number {
  let h = 3;
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 5) & 65535;
  return h;
}
function ichyikowrdfpagthmsOfferResolvePart02ObfV15ShiftXor(n: number, k: number): number {
  return ((n ^ k) << 2) & 65535;
}
function ichyikowrdfpagthmsOfferResolvePart03ObfV15ShiftXor(n: number, k: number): number {
  return ((n ^ k) << 2) & 65535;
}
function OfferResolvePart02ObfV20CichyikowrdfpagthmslampMod(n: number, k: number): number {
  return ((n ^ k) << 2) & 65535;
}
function OfferResolvePart02ObfichyikowrdfpagthmsV20ShiftXor(n: number, k: number): number {
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ShiftXor(75, 2);
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ByteFold("fkp61m");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32HashMix("85k56p");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32SumOdds([19, 10, 21]);
  return ((n ^ k) << 2) & 65535;
}
function OfferResolichyikowrdfpagthmsvePart02ObfV21ShiftXor(n: number, k: number): number {
  return ((n ^ k) << 2) & 65535;
}
function OfferResolvePart02ObfV21ichyikowrdfpagthmsSumOdds(nums: number[]): number {
  let a = 1;
  for (let i = 0; i < nums.length; i++) a = (a + nums[i]) & 65535;
  return a;
}

/* obfuscation-batch:v28 */
function ichyikowrdfpagthmsOfferResolvprissmgecmsgallieObfV28Mix(a: number, b: number): number {
  const base = 59;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function ichyikowrdfpagthmsOfferResolvprissmgecmsgallieObfV28Fold(text: string): number {
  let acc = 59;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v29 */
function ichyikowrdfpagthmsOfferResolvpzurisymgeqmgallsObfV29Mix(a: number, b: number): number {
  const base = 46;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function ichyikowrdfpagthmsOfferResolvpzurisymgeqmgallsObfV29Fold(text: string): number {
  let acc = 46;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v30 */
function OfferichyikowrdfpagthmsResoObfV30Mix(a: number, b: number): number {
  const base = 36;
  const denom = (b % 97) + 3;
  return ((a + base) % denom) ^ (base & 15);
}
function OfferResoObichyikowrdfpagthmsfV30Fold(text: string): number {
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ShiftXor(75, 2);
void ichyikowrdfpagthmsOfferResoichyikowrObfV32ByteFold("fkp61m");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32HashMix("85k56p");
void ichyikowrdfpagthmsOfferResoichyikowrObfV32SumOdds([19, 10, 21]);
  let acc = 36;
  for (let i = 0; i < text.length; i++) acc = (acc * 33 + text.charCodeAt(i)) >>> 0;
  return acc;
}

/* obfuscation-batch:v31 */
function ichyikowrdfpagthmsOpmvqkrmwismgemgalObfV31HashMix(s: string): number {
  let h = 64;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 24)) % 548;
  return h;
}

/* obfuscation-batch:v32 */
function ichyikowrdfpagthmsOfferResoichyikowrObfV32ShiftXor(n: number, k: number): number {
  const x = (n ^ k) << 4;
  return (x ^ 15) & 12027;
}
function ichyikowrdfpagthmsOfferResoichyikowrObfV32ByteFold(s: string): number {
  let x = 73;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 21) & 459;
  return x;
}
function ichyikowrdfpagthmsOfferResoichyikowrObfV32HashMix(s: string): number {
  let h = 47;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 20)) % 235;
  return h;
}
function ichyikowrdfpagthmsOfferResoichyikowrObfV32SumOdds(nums: number[]): number {
  let acc = 13;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 41) % 240;
  }
  return acc;
}
