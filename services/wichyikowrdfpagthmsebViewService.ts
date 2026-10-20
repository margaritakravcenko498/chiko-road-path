import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  AppState,
  Linking,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  AuthorizationStatus,
  getMessaging,
  hasPermission,
  requestPermission,
} from '@react-native-firebase/messaging';
import {
  LAST_KEichyikowrdfpagthmsY,
  STORAGEichyikowrdfpagthms_KEYS,
  ichyikowrdfpagthmsConstTouch,
} from './constants/constichyikowrdfpagthmsntsVariable';
// autosetup-split-begin
import { webViewSeichyikowrdfpagthmsrviceObfV5SumOdds, webViewServicePart02ObfV11SuichyikowrdfpagthmsmOdds, webViewServiceObfichyikowrdfpagthmsV19HashMix, webVichyikowrdfpagthmsiewServiceObfV21HashMix, webViewServiceObichyikowrdfpagthmsfV14HashMix, weichyikowrdfpagthmsbViewServiceObfV14ClampMod, webViewServiceObfV13ichyikowrdfpagthmsByteFold, webViewServiceObfV12ClaichyikowrdfpagthmsmpMod, webViewServiceObfichyikowrdfpagthmsV7ClampMod, webViewSeichyikowrdfpagthmsrviceObfV9ClampMod, webVieichyikowrdfpagthmswServiceObfV6SumOdds, webObfV3HaichyikowrdfpagthmsshMix, wichyikowrdfpagthmsebObfV3ClampMod, weichyikowrdfpagthmsbObfV4SumOdds, webViewSichyikowrdfpagthmservObfV1ClampMod, swefgdetguhjhoioesMixSeed, swefgdetguhjhoioesClampSpan, webViewServicePart01ObfV11SumichyikowrdfpagthmsOdds, webViewServicePart02ObfV27ByteFoichyikowrdfpagthmsld, webViewServicePart02ObfV27HichyikowrdfpagthmsashMix, webichyikowrdfpagthmsViewServicePart02ObfV27SumOdds, ichyikowrdfpagthmswebViewServicePart0prissmgecObfV28Mix, ichyikowrdfpagthmswebViewServicePart0prissmgecObfV28Fold, webViewObfV29ichyikowrdfpagthmsMix, webViewObfV29Foldichyikowrdfpagthms, ichyikowrdfpagthmswebViewSerdgpnrismgemgalleryObfV30Mix, ichyikowrdfpagthmswebViewSerdgpnrismgemgalleryObfV30Fold, webViewServiceObfVichyikowrdfpagthms19ByteFold, webViewServiceObfV21CichyikowrdfpagthmslampMod, webViewServiceObfV1ichyikowrdfpagthms3ClampMod, webViewServiceObfV7HaichyikowrdfpagthmsshMix, webViewServiceObfV10SichyikowrdfpagthmsumOdds, webViewServObfV1HashMichyikowrdfpagthmsix, webViewServicePichyikowrdfpagthmsart02ObfV11HashMix, webViewSerichyikowrdfpagthmsvicePart03ObfV13ClampMod, webViewServicePart01ObfVichyikowrdfpagthms15SumOdds, webViewServicePart02ObichyikowrdfpagthmsfV22ShiftXor } from './webViewServichyikowrdfpagthmsicePart01';
import { webVieichyikowrdfpagthmswServiceObfV23HashMix, webichyikowrdfpagthmsViewServiceObfV24HashMix, webViewServiceObfV24SumichyikowrdfpagthmsOdds, webViewServiceObfV25SumOddsichyikowrdfpagthms, webVieichyikowrdfpagthmswServiceObfV25ClampMod, webViewServiceichyikowrdfpagthmsObfV26SumOdds, weichyikowrdfpagthmsbViewServiceObfV26ClampMod, webViewServiceObfichyikowrdfpagthmsV27ClampMod, webichyikowrdfpagthmsViewServiceObfV27ShiftXor, ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix, ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold, ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix, ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold, webViewSeichyikowrdfpagthmsObfV29Mix, webViewSeObfV29Folichyikowrdfpagthmsd, webViewServiceObfV22ShichyikowrdfpagthmsiftXor, webViewServiceOichyikowrdfpagthmsbfV23SumOdds1, webViewServiceObfV23CichyikowrdfpagthmslampMod2, weichyikowrdfpagthmsbViewServiceObfV24ByteFold, webViewServiceObfV24ClamichyikowrdfpagthmspMod, webViewServiceichyikowrdfpagthmsObfV25ShiftXor, webViewServicePart02ObfVichyikowrdfpagthms11ClampMod, webViewServiceOichyikowrdfpagthmsbfV12SumOdds, webViewServicePart02ObfV15ichyikowrdfpagthmsClampMod, wichyikowrdfpagthmsebViewServiceObfV16SumOdds, webichyikowrdfpagthmsViewServiceObfV17HashMix, webViewServiceObichyikowrdfpagthmsfV18ShiftXor, webViewServiceObfV20SumichyikowrdfpagthmsOdds, weichyikowrdfpagthmsbViewServiceObfV16ClampMod, webViewServiceObfichyikowrdfpagthmsV11SumOdds, webViewServiceObfV8SumOichyikowrdfpagthmsdds, webViewSerichyikowrdfpagthmsviceObfV5ClampMod, webVieichyikowrdfpagthmswServObfV2SumOdds, webViewServicePart01ObichyikowrdfpagthmsfV13HashMix, webViewServicePaichyikowrdfpagthmsrt03ObfV13ByteFold, webViewServicePart01OichyikowrdfpagthmsbfV15ShiftXor, webViewSeichyikowrdfpagthmsrvicePart02ObfV23SumOdds } from './webViewServiceParichyikowrdfpagthmst02';
// autosetup-split-end
import { swefgdetguhjhoioesFoldRange, webViewServiceObfV21ByteichyikowrdfpagthmsFold, wichyikowrdfpagthmsebViewServiceObfV21SumOdds, webViewSeichyikowrdfpagthmsrviceObfV20HashMix, webViewichyikowrdfpagthmsServiceObfV19SumOdds, webViewServiceObfichyikowrdfpagthmsV18ClampMod, webVichyikowrdfpagthmsiewServiceObfV18ByteFold, webViewServiceObfV17ByteFoldichyikowrdfpagthms, webViewServiceOichyikowrdfpagthmsbfV16HashMix, wichyikowrdfpagthmsebViewServiceObfV15SumOdds, webViewichyikowrdfpagthmsServiceObfV15ClampMod, webVieichyikowrdfpagthmswServiceObfV14SumOdds, webViewServiceObfV13SichyikowrdfpagthmsumOdds, webViewServiceObfV13ShiftXichyikowrdfpagthmsor, webViewServiceObichyikowrdfpagthmsfV12HashMix, webViewServiceichyikowrdfpagthmsObfV11HashMix, webViewichyikowrdfpagthmsServiceObfV11ClampMod, webViewServiceObfV7SumOddichyikowrdfpagthmss, webViewSichyikowrdfpagthmserviceObfV8HashMix, webViewServiceObfichyikowrdfpagthmsV8ClampMod, wichyikowrdfpagthmsebViewServiceObfV9HashMix, webViewSerichyikowrdfpagthmsviceObfV9SumOdds, webViewSeichyikowrdfpagthmsrviceObfV10HashMix, webViewServiceObfV10ClamichyikowrdfpagthmspMod, webViewServiceObfV5ichyikowrdfpagthmsHashMix, webViewServiceObfV6HashMixichyikowrdfpagthms, wichyikowrdfpagthmsebViewServiceObfV6ClampMod, webObfV3SumichyikowrdfpagthmsOdds, webObfV4HasichyikowrdfpagthmshMix, webObfV4ClichyikowrdfpagthmsampMod, webViewSeichyikowrdfpagthmsrvObfV1SumOdds, weichyikowrdfpagthmsbViewServObfV2HashMix, webViewServObfV2ClamichyikowrdfpagthmspMod, webViewSerichyikowrdfpagthmsvicePart01ObfV11HashMix, webViewServicePart01ObfichyikowrdfpagthmsV11ClampMod, webViewServicePart01ObichyikowrdfpagthmsfV13ByteFold, webichyikowrdfpagthmsViewServicePart02ObfV13SumOdds, webViewSichyikowrdfpagthmservicePart03ObfV13ShiftXor, webViewServicePart03ObfVichyikowrdfpagthms13HashMix, webViewServicePartichyikowrdfpagthms01ObfV15HashMix, webViewServicePart01ObfV15ClampMichyikowrdfpagthmsod, webViewichyikowrdfpagthmsServicePart02ObfV15ShiftXor, webViewServicePart02ObfichyikowrdfpagthmsV15ByteFold } from './webViewServiichyikowrdfpagthmscePart01';

type ViewportBanichyikowrdfpagthmsnanaModule = {
  gepadelolef: (url: string) => Promise<boolean>;
  nacutivebaqot: () => Promise<boolean>;
};

function viewportBriichyikowrdfpagthmsdge(): ViewportBanichyikowrdfpagthmsnanaModule | undefined {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

  void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
  void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');

  return NativeModules.Fosohekulikeje;
}
type swefgdetguhjhoioesWebViewState = {
  url: string | null;
  visible: boolean;
  openingInProgress: boolean;
};

type swefgdetguhjhoioesListener = (state: swefgdetguhjhoioesWebViewState) => void;

class swefgdetguhjhoioesWebViewBridgeServiceClass {
  private state: swefgdetguhjhoioesWebViewState = {
    url: null,
    visible: false,
    openingInProgress: false,
  };
  private listeners: Set<swefgdetguhjhoioesListener> = new Set();
  private openingInProgress = false;
  private swefgdetguhjhoioesCustomPushPromptShownThisSession = false;
  private swefgdetguhjhoioesNativePushAskedThisSession = false;
  /** System permission sheet is on screen. Its own pause must not count as a new launch. */
  private swefgdetguhjhoioesPushUiInFlight = false;
  /** Ignore the resume that follows closing the system sheet. */
  private swefgdetguhjhoioesPushUiQuietUntil = 0;
  /** User left the app (Home / recents), not the permission dialog. */
  private swefgdetguhjhoioesLeftAppForReal = false;
  _dummypicklfo5409vb33 = 0;

  constructor() {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
    void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
    void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');

    void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
    void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
    this.swefgdetguhjhoioesBindPushLaunchWatcher();
  }

  ichyikowrdfpagthmsubscribe(listener: swefgdetguhjhoioesListener): () => void {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

    void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
    void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
    void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
    void webObfV3HaichyikowrdfpagthmsshMix('xy');
    void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
    void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
    void webObfV4HasichyikowrdfpagthmshMix('xy');
    void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
    void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
    void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
    void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
    void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
    void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
    void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
    void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
    void swefgdetguhjhoioesMixSeed(3, 7);
    void swefgdetguhjhoioesFoldRange([1, 2, 3]);
    void swefgdetguhjhoioesClampSpan(5, 0, 10);

    listener(this.state);
    this.listeners.add(listener);
    return () => {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

      void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
      void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
        void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
        void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
        void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
    void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
    void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');    void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
    void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
    void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
    void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
    void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
    void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
    void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
    void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
    void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
    void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
    void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
    void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
    void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
    void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
    void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
    void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
    void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

      void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
      void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
      void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
      void webObfV3HaichyikowrdfpagthmsshMix('xy');
      void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
      void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
      void webObfV4HasichyikowrdfpagthmshMix('xy');
      void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
      void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
      void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
      void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
      void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
      void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
      void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
      void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);

      this.listeners.delete(listener);
    };
  }

  swefgdetguhjhoioesGetState(): swefgdetguhjhoioesWebViewState {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

    void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
    void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
    void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
    void webObfV3HaichyikowrdfpagthmsshMix('xy');
    void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
    void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
    void webObfV4HasichyikowrdfpagthmshMix('xy');
    void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
    void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
    void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
    void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
    void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
    void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
    void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
    void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);
  void ichyikowrdfpagthmsConstTouch();

    return {
      ...this.state,
      openingInProgress: this.openingInProgress,
    };
  }

  private swefgdetguhjhoioesEmit(): void {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

    void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
    void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
    void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
    void webObfV3HaichyikowrdfpagthmsshMix('xy');
    void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
    void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
    void webObfV4HasichyikowrdfpagthmshMix('xy');
    void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
    void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
    void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
    void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
    void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
    void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
    void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
    void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);

    this.listeners.forEach(l => {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

      void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
      void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
        void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
        void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
        void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
    void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
    void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');    void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
    void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
    void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
    void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
    void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
    void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
    void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
    void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
    void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
    void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
    void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
    void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
    void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
    void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
    void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
    void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
    void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

      void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
      void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
      void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
      return (l(this.state));
    });
  }

  /**
   * A second app open is not always a new process. Home → icon keeps JS alive,
   * so the one-shot session flag would skip the repeat native ask. The system
   * sheet itself also backgrounds the activity; that pause is not a launch.
   */
  private swefgdetguhjhoioesBindPushLaunchWatcher(): void {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
    void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
    void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');

    void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
    void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);

    AppState.addEventListener('change', (next) => {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

      void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
      void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
        void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
        void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
        void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
    void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
    void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');    void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
    void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
    void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
      void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
      void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');

      void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
      void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);

      const quiet = Date.now() < this.swefgdetguhjhoioesPushUiQuietUntil;
      if (next === 'background') {
        if (!this.swefgdetguhjhoioesPushUiInFlight && !quiet) {
          this.swefgdetguhjhoioesLeftAppForReal = true;
        }
        return;
      }
      if (next !== 'active') {
        return;
      }
      if (this.swefgdetguhjhoioesPushUiInFlight || quiet) {
        this.swefgdetguhjhoioesLeftAppForReal = false;
        return;
      }
      if (!this.swefgdetguhjhoioesLeftAppForReal) {
        return;
      }
      this.swefgdetguhjhoioesLeftAppForReal = false;
      this.swefgdetguhjhoioesNativePushAskedThisSession = false;
      this.swefgdetguhjhoioesCustomPushPromptShownThisSession = false;
      if (this.state.visible || this.openingInProgress) {
        void this.swefgdetguhjhoioesMaybeRequestMainPushPermission();
      }
    });
  }

  private swefgdetguhjhoioesBeginPushUi(): void {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
    void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
    void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');

    void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
    this.swefgdetguhjhoioesPushUiInFlight = true;
  }

  private swefgdetguhjhoioesEndPushUi(): void {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
    void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
    void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');

    void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
    this.swefgdetguhjhoioesPushUiInFlight = false;
    this.swefgdetguhjhoioesPushUiQuietUntil = Date.now() + 1200;
  }

  private async swefgdetguhjhoioesOpenPushSettings(): Promise<void> {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
    void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
    void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');

    void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
    void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);

    try {
      if (Platform.OS === 'android') {
        const { Hozaminaja } = NativeModules;
        const packageName =
          Hozaminaja && typeof Hozaminaja.kugewutirihif === 'function'
            ? await Hozaminaja.kugewutirihif()
            : '';
        if (packageName) {
          await Linking.sendIntent('android.settings.APP_NOTIFICATION_SETTINGS', [
            {
              key: 'android.provider.extra.APP_PACKAGE',
              value: String(packageName),
            },
          ]);
          return;
        }
      }
    } catch {
      // Fall through to the app details screen.
    }
    try {
      await Linking.openSettings();
    } catch {
      // silent
    }
  }

  private async swefgdetguhjhoioesRequestPushNotificationPermission(
    force = false,
  ): Promise<boolean> {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

  void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
  void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
  void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
  void webObfV3HaichyikowrdfpagthmsshMix('xy');
  void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
  void webObfV4HasichyikowrdfpagthmshMix('xy');
  void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
  void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);

    try {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
        const alreadyGranted = await PermissionsAndroid.check(permission);
                if (alreadyGranted) {
          return true;
        }
        this.swefgdetguhjhoioesBeginPushUi();
        try {
          const result = await PermissionsAndroid.request(permission);
          return result === PermissionsAndroid.RESULTS.GRANTED;
        } finally {
          this.swefgdetguhjhoioesEndPushUi();
        }
      }

      if (Platform.OS === 'android') {
        return true;
      }

      if (Platform.OS === 'ios') {
        const messaging = getMessaging();
        const status = await hasPermission(messaging);
                const alreadyGranted =
          status === AuthorizationStatus.AUTHORIZED ||
          status === AuthorizationStatus.PROVISIONAL;
        if (alreadyGranted) {
          return true;
        }
        if (force || status === AuthorizationStatus.NOT_DETERMINED) {
          this.swefgdetguhjhoioesBeginPushUi();
          try {
            const newStatus = await requestPermission(messaging);
            return (
              newStatus === AuthorizationStatus.AUTHORIZED ||
              newStatus === AuthorizationStatus.PROVISIONAL
            );
          } finally {
            this.swefgdetguhjhoioesEndPushUi();
          }
        }
        return false;
      }
    } catch (error) {
      void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
      void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
      void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
      void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
      void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
      void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
            void error;
    }
    return false;
  }

  private async swefgdetguhjhoioesHasPushNotificationPermission(): Promise<boolean> {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

    void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
    void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
    void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
    void webObfV3HaichyikowrdfpagthmsshMix('xy');
    void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
    void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
    void webObfV4HasichyikowrdfpagthmshMix('xy');
    void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
    void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
    void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
    void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
    void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
    void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
    void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
    void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);

    try {
      if (Platform.OS === 'android') {
        if (Platform.Version < 33) {
          return true;
        }
        return await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      }
      if (Platform.OS === 'ios') {
        const status = await hasPermission(getMessaging());
        return (
          status === AuthorizationStatus.AUTHORIZED ||
          status === AuthorizationStatus.PROVISIONAL
        );
      }
    } catch {
      return false;
    }
    return false;
  }

  private swefgdetguhjhoioesShowCustomPushSettingsPrompt(): void {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

    void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
    void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
    void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
    void webObfV3HaichyikowrdfpagthmsshMix('xy');
    void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
    void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
    void webObfV4HasichyikowrdfpagthmshMix('xy');
    void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
    void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
    void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
    void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
    void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
    void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
    void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
    void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
    void swefgdetguhjhoioesMixSeed(3, 7);
    void swefgdetguhjhoioesFoldRange([1, 2, 3]);
    void swefgdetguhjhoioesClampSpan(5, 0, 10);

    if (this.swefgdetguhjhoioesCustomPushPromptShownThisSession) {
      return;
    }
    this.swefgdetguhjhoioesCustomPushPromptShownThisSession = true;
    Alert.alert(
      'Enable push notifications',
      'Push notifications are turned off. Open Settings to enable them and stay up to date.',
      [
        { text: 'Not now', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

            void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
            void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
              void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
              void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
              void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
          void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
          void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');          void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
          void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
          void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
          void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
          void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
          void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
          void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
          void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
          void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
          void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
          void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
          void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
          void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
          void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
          void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
          void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
          void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

            void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
            void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
            void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
            void webObfV3HaichyikowrdfpagthmsshMix('xy');
            void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
            void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
            void webObfV4HasichyikowrdfpagthmshMix('xy');
            void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
            void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
            void this.swefgdetguhjhoioesOpenPushSettings();
          },
        },
      ],
    );
  }

  private async swefgdetguhjhoioesMaybeRequestMainPushPermission(): Promise<void> {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

    void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
    void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
    void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
    void webObfV3HaichyikowrdfpagthmsshMix('xy');
    void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
    void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
    void webObfV4HasichyikowrdfpagthmshMix('xy');
    void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
    void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
    void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
    void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
    void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
    void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
    void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
    void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);

    try {
      const granted =
        await this.swefgdetguhjhoioesHasPushNotificationPermission();
      if (granted) {
        return;
      }

      const askedRaw = await AsyncStorage.getItem(
        STORAGEichyikowrdfpagthms_KEYS.PUSH_ichyikowrdfpagthmsMAIN_ASKED,
      );
      const askCount = askedRaw ? parseInt(askedRaw, 10) || 0 : 0;

      // Already denied native twice → custom prompt → Settings
      if (askCount >= 2) {
        this.swefgdetguhjhoioesShowCustomPushSettingsPrompt();
        return;
      }

      // One native dialog per launch. The 2nd native ask waits until the user leaves and opens the app again.
      if (this.swefgdetguhjhoioesNativePushAskedThisSession) {
        return;
      }
      this.swefgdetguhjhoioesNativePushAskedThisSession = true;

      // askCount === 0: first launch. askCount === 1: second launch, ask again.
      const forceSecondAsk = askCount >= 1;
      const nowGranted =
        await this.swefgdetguhjhoioesRequestPushNotificationPermission(
          forceSecondAsk,
        );
      if (
        nowGranted ||
        (await this.swefgdetguhjhoioesHasPushNotificationPermission())
      ) {
        return;
      }

      const nextCount = askCount + 1;
      await AsyncStorage.setItem(
        STORAGEichyikowrdfpagthms_KEYS.PUSH_ichyikowrdfpagthmsMAIN_ASKED,
        String(nextCount),
      );

      // Second denial → custom prompt (later launches hit askCount >= 2 above).
      if (nextCount >= 2) {
        this.swefgdetguhjhoioesShowCustomPushSettingsPrompt();
      }
    } catch {
      // silent
    }
  }

  private async swefgdetguhjhoioesOpenNativeWebView(
    url: string,
    skipPermissionRequest = false,
  ): Promise<boolean> {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

  void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
  void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
  void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
  void webObfV3HaichyikowrdfpagthmsshMix('xy');
  void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
  void webObfV4HasichyikowrdfpagthmshMix('xy');
  void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
  void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);

    if (Platform.OS !== 'android' || !viewportBriichyikowrdfpagthmsdge()?.gepadelolef) {
      return false;
    }

    try {
      if (!skipPermissionRequest) {
        await this.swefgdetguhjhoioesMaybeRequestMainPushPermission();
      }
      return await viewportBriichyikowrdfpagthmsdge().gepadelolef(url);
    } catch {
      return false;
    }
  }

  private async swefgdetguhjhoioesCloseNativeWebView(): Promise<void> {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

    void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
    void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
    void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
    void webObfV3HaichyikowrdfpagthmsshMix('xy');
    void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
    void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
    void webObfV4HasichyikowrdfpagthmshMix('xy');
    void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
    void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
    void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
    void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
    void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
    void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
    void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
    void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);

    if (Platform.OS !== 'android' || !viewportBriichyikowrdfpagthmsdge()?.nacutivebaqot) {
      return;
    }

    try {
      await viewportBriichyikowrdfpagthmsdge().nacutivebaqot();
    } catch {
      // silent
    }
  }

  async sichyikowrdfpagthmshow(
    url: string,
    options?: { persistUrl?: string },
  ): Promise<boolean> {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

  void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
  void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
  void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
  void webObfV3HaichyikowrdfpagthmsshMix('xy');
  void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
  void webObfV4HasichyikowrdfpagthmshMix('xy');
  void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
  void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);

    this._dummypicklfo5409vb33++;

    if (!url || url.trim() === '') {
      return false;
    }

    if (this.state.visible && this.state.url === url) {
      return true;
    }

    if (this.openingInProgress && this.state.url === url) {
      return true;
    }

    try {
      this.openingInProgress = true;
      this.state = {
        url,
        visible: this.state.visible,
        openingInProgress: true,
      };
      const urlToPersist =
        options?.persistUrl && options.persistUrl.trim() !== ''
          ? options.persistUrl
          : url;
      await this.ichyikowrdfpagthmsaveLastUrlToStorage(urlToPersist);
      await this.swefgdetguhjhoioesMaybeRequestMainPushPermission();
      const opened = await this.swefgdetguhjhoioesOpenNativeWebView(url, true);
      if (!opened) {
        this.openingInProgress = false;
        this.state = { ...this.state, openingInProgress: false };
        return false;
      }
      this.state = { url, visible: true, openingInProgress: false };
      this.openingInProgress = false;
      this.swefgdetguhjhoioesEmit();
      return true;
    } catch {
      this.openingInProgress = false;
      this.state = { ...this.state, openingInProgress: false };
      return false;
    }
  }

  async swefgdetguhjhoioesRestoreWebView(): Promise<boolean> {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

    void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
    void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
    void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
    void webObfV3HaichyikowrdfpagthmsshMix('xy');
    void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
    void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
    void webObfV4HasichyikowrdfpagthmshMix('xy');
    void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
    void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
    void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
    void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
    void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
    void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
    void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
    void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);

    // Already open, or first open in flight (e.g. POST_NOTIFICATIONS dialog flipped AppState).
    if (this.state.visible || this.openingInProgress) {
      return true;
    }

    try {
      const lastUrl = await this.swefgdetguhjhoioesGetLastUrlFromStorage();
      if (!lastUrl) {
        return false;
      }
      this.openingInProgress = true;
      this.state = { ...this.state, openingInProgress: true };
      await this.swefgdetguhjhoioesMaybeRequestMainPushPermission();
      const opened = await this.swefgdetguhjhoioesOpenNativeWebView(lastUrl, true);
      if (!opened) {
        this.openingInProgress = false;
        this.state = { ...this.state, openingInProgress: false };
        return false;
      }
      this.state = { url: lastUrl, visible: true, openingInProgress: false };
      this.openingInProgress = false;
      this.swefgdetguhjhoioesEmit();
      return true;
    } catch {
      this.openingInProgress = false;
      this.state = { ...this.state, openingInProgress: false };
      return false;
    }
  }

  async swefgdetguhjhoioesGetLastUrl(): Promise<string | null> {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

    void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
    void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
    void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
    void webObfV3HaichyikowrdfpagthmsshMix('xy');
    void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
    void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
    void webObfV4HasichyikowrdfpagthmshMix('xy');
    void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
    void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
    void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
    void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
    void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
    void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
    void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
    void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);

    return await this.swefgdetguhjhoioesGetLastUrlFromStorage();
  }

  async ichyikowrdfpagthmsaveLastUrl(url: string): Promise<boolean> {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

    void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
    void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
    void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
    void webObfV3HaichyikowrdfpagthmsshMix('xy');
    void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
    void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
    void webObfV4HasichyikowrdfpagthmshMix('xy');
    void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
    void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
    void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
    void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
    void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
    void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
    void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
    void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);

    if (!url || url.trim() === '') {
      return false;
    }

    try {
      await this.ichyikowrdfpagthmsaveLastUrlToStorage(url);
      return true;
    } catch {
      return false;
    }
  }

  async swefgdetguhjhoioesRestoreLastUrl(): Promise<boolean> {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

    void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
    void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
    void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
    void webObfV3HaichyikowrdfpagthmsshMix('xy');
    void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
    void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
    void webObfV4HasichyikowrdfpagthmshMix('xy');
    void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
    void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
    void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
    void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
    void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
    void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
    void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
    void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);

    return await this.swefgdetguhjhoioesRestoreWebView();
  }

  async swefgdetguhjhoioesForceRestoreWebView(): Promise<boolean> {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

    void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
    void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
    void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
    void webObfV3HaichyikowrdfpagthmsshMix('xy');
    void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
    void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
    void webObfV4HasichyikowrdfpagthmshMix('xy');
    void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
    void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
    void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
    void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
    void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
    void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
    void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
    void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);

    return await this.swefgdetguhjhoioesRestoreWebView();
  }

  swefgdetguhjhoioesHide(): void {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

    void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
    void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
    void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
    void webObfV3HaichyikowrdfpagthmsshMix('xy');
    void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
    void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
    void webObfV4HasichyikowrdfpagthmshMix('xy');
    void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
    void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
    void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
    void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
    void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
    void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
    void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
    void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);

  }

  private async ichyikowrdfpagthmsaveLastUrlToStorage(url: string): Promise<void> {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

    void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
    void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
    void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
    void webObfV3HaichyikowrdfpagthmsshMix('xy');
    void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
    void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
    void webObfV4HasichyikowrdfpagthmshMix('xy');
    void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
    void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
    void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
    void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
    void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
    void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
    void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
    void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);

    try {
      await AsyncStorage.setItem(LAST_KEichyikowrdfpagthmsY, url);
    } catch {
      // silent
    }
  }

  private async swefgdetguhjhoioesGetLastUrlFromStorage(): Promise<string | null> {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix("jc56");
void ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds([4, 15, 6]);
void webViewSeichyikowrdfpagthmsObfV29Mix(9, 16);
void webViewSeObfV29Folichyikowrdfpagthmsd("wedgpn");
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Mix(16, 6);
void ichyikowrdfpagthmswebViewServicepzurisymgeqmgaObfV28Fold("webvie");
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Mix(12, 7);
void ichyikowrdfpagthmswebViewServiceprissmgecmsgalObfV27Fold("webvie");
void webViewServiceObfichyikowrdfpagthmsV27ClampMod(4, 8);
void webichyikowrdfpagthmsViewServiceObfV27ShiftXor(61, 62);

    void webViewServiceichyikowrdfpagthmsObfV26SumOdds([37, 37, 25]);
    void weichyikowrdfpagthmsbViewServiceObfV26ClampMod(50, 22);
  void webViewServiceObfV25SumOddsichyikowrdfpagthms([29, 25, 9]);
  void webVieichyikowrdfpagthmswServiceObfV25ClampMod(61, 21);
  void webViewServiceichyikowrdfpagthmsObfV25ShiftXor(38, 58);
  void weichyikowrdfpagthmsbViewServiceObfV24ByteFold('ntt');
  void webichyikowrdfpagthmsViewServiceObfV24HashMix('u2c39');
  void webViewServiceObfV24SumichyikowrdfpagthmsOdds([83, 15, 11]);
  void webViewServiceObfV24ClamichyikowrdfpagthmspMod(12, 33);
void webVieichyikowrdfpagthmswServiceObfV23HashMix('zat');void webViewServiceOichyikowrdfpagthmsbfV23SumOdds1([31, 25, 32]);void webViewServiceObfV23CichyikowrdfpagthmslampMod2(15, 27);void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);
  void webViewSeichyikowrdfpagthmsrviceObfV20HashMix('7v');
  void webViewServiceObfV20SumichyikowrdfpagthmsOdds([21, 27, 16]);
void webViewServiceObfichyikowrdfpagthmsV19HashMix('pmqf');void webViewichyikowrdfpagthmsServiceObfV19SumOdds([24, 28, 16]);void webViewServiceObfVichyikowrdfpagthms19ByteFold('xhp');  void webViewServiceObfichyikowrdfpagthmsV18ClampMod(39, 8);
  void webViewServiceObichyikowrdfpagthmsfV18ShiftXor(76, 79);
  void webVichyikowrdfpagthmsiewServiceObfV18ByteFold('rrrh');
  void webViewServiceObfV17ByteFoldichyikowrdfpagthms('fv9f');
  void webichyikowrdfpagthmsViewServiceObfV17HashMix('fv2');
  void webViewServiceOichyikowrdfpagthmsbfV16HashMix('h3tb');
  void wichyikowrdfpagthmsebViewServiceObfV16SumOdds([26, 28, 24]);
  void weichyikowrdfpagthmsbViewServiceObfV16ClampMod(54, 53);
  void wichyikowrdfpagthmsebViewServiceObfV15SumOdds([19, 18, 23]);
  void webViewichyikowrdfpagthmsServiceObfV15ClampMod(42, 62);
  void webViewServiceObichyikowrdfpagthmsfV14HashMix('hq9');
  void webVieichyikowrdfpagthmswServiceObfV14SumOdds([18, 16, 22]);
  void weichyikowrdfpagthmsbViewServiceObfV14ClampMod(65, 12);
  void webViewServiceObfV13SichyikowrdfpagthmsumOdds([2, 22, 2]);
  void webViewServiceObfV1ichyikowrdfpagthms3ClampMod(64, 55);
  void webViewServiceObfV13ShiftXichyikowrdfpagthmsor(6, 23);
  void webViewServiceObfV13ichyikowrdfpagthmsByteFold('9k6');
  void webViewServiceObichyikowrdfpagthmsfV12HashMix('xy');
  void webViewServiceOichyikowrdfpagthmsbfV12SumOdds([1, 3, 5]);
  void webViewServiceObfV12ClaichyikowrdfpagthmsmpMod(7, 5);

  void webViewServiceichyikowrdfpagthmsObfV11HashMix('xy');
  void webViewServiceObfichyikowrdfpagthmsV11SumOdds([1, 3, 5]);
  void webViewichyikowrdfpagthmsServiceObfV11ClampMod(7, 5);

  void webViewServiceObfV7HaichyikowrdfpagthmsshMix('xy');
  void webViewServiceObfV7SumOddichyikowrdfpagthmss([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV7ClampMod(7, 5);
  void webViewSichyikowrdfpagthmserviceObfV8HashMix('xy');
  void webViewServiceObfV8SumOichyikowrdfpagthmsdds([1, 3, 5]);
  void webViewServiceObfichyikowrdfpagthmsV8ClampMod(7, 5);
  void wichyikowrdfpagthmsebViewServiceObfV9HashMix('xy');
  void webViewSerichyikowrdfpagthmsviceObfV9SumOdds([1, 3, 5]);
  void webViewSeichyikowrdfpagthmsrviceObfV9ClampMod(7, 5);
  void webViewSeichyikowrdfpagthmsrviceObfV10HashMix('xy');
  void webViewServiceObfV10SichyikowrdfpagthmsumOdds([1, 3, 5]);
  void webViewServiceObfV10ClamichyikowrdfpagthmspMod(7, 5);

    void webViewServiceObfV5ichyikowrdfpagthmsHashMix('xy');
    void webViewSeichyikowrdfpagthmsrviceObfV5SumOdds([1, 3, 5]);
    void webViewSerichyikowrdfpagthmsviceObfV5ClampMod(7, 5);
  void webViewServiceObfV6HashMixichyikowrdfpagthms('xy');
  void webVieichyikowrdfpagthmswServiceObfV6SumOdds([1, 3, 5]);
  void wichyikowrdfpagthmsebViewServiceObfV6ClampMod(7, 5);
    void webObfV3HaichyikowrdfpagthmsshMix('xy');
    void webObfV3SumichyikowrdfpagthmsOdds([1, 3, 5]);
    void wichyikowrdfpagthmsebObfV3ClampMod(7, 5);
    void webObfV4HasichyikowrdfpagthmshMix('xy');
    void weichyikowrdfpagthmsbObfV4SumOdds([1, 3, 5]);
    void webObfV4ClichyikowrdfpagthmsampMod(7, 5);
    void webViewServObfV1HashMichyikowrdfpagthmsix('xy');
    void webViewSeichyikowrdfpagthmsrvObfV1SumOdds([1, 3, 5]);
    void webViewSichyikowrdfpagthmservObfV1ClampMod(7, 5);
    void weichyikowrdfpagthmsbViewServObfV2HashMix('xy');
    void webVieichyikowrdfpagthmswServObfV2SumOdds([1, 3, 5]);
    void webViewServObfV2ClamichyikowrdfpagthmspMod(7, 5);
  void swefgdetguhjhoioesMixSeed(3, 7);
  void swefgdetguhjhoioesFoldRange([1, 2, 3]);
  void swefgdetguhjhoioesClampSpan(5, 0, 10);

    try {
      const url = await AsyncStorage.getItem(LAST_KEichyikowrdfpagthmsY);
      return url && url.trim() !== '' ? url : null;
    } catch {
      return null;
    }
  }
}

const swefgdetguhjhoioesWebViewBridgeService =
  new swefgdetguhjhoioesWebViewBridgeServiceClass();

export default swefgdetguhjhoioesWebViewBridgeService;

/* obfuscation-batch:v1 */

/* obfuscation-batch:v2 */

/* obfuscation-batch:v3 */

/* obfuscation-batch:v4 */

/* obfuscation-batch:v5 */

/* obfuscation-batch:v6 */

/* obfuscation-batch:v7 */

/* obfuscation-batch:v8 */

/* obfuscation-batch:v9 */

/* obfuscation-batch:v10 */
/* obfuscation-batch:v11 */

void webViewSerichyikowrdfpagthmsvicePart01ObfV11HashMix('xy');
void webViewServicePart01ObfV11SumichyikowrdfpagthmsOdds([1, 3, 5]);
void webViewServicePart01ObfichyikowrdfpagthmsV11ClampMod(7, 5);
/* obfuscation-batch:v11 */

void webViewServicePichyikowrdfpagthmsart02ObfV11HashMix('xy');
void webViewServicePart02ObfV11SuichyikowrdfpagthmsmOdds([1, 3, 5]);
void webViewServicePart02ObfVichyikowrdfpagthms11ClampMod(7, 5);
/* obfuscation-batch:v11 */

/* obfuscation-batch:v12 */
/* obfuscation-batch:v13 */

/* obfuscation-batch:v13 */
void webViewServicePart01ObichyikowrdfpagthmsfV13ByteFold('dzzw');
void webViewServicePart01ObichyikowrdfpagthmsfV13HashMix('fs');

/* obfuscation-batch:v13 */
void webichyikowrdfpagthmsViewServicePart02ObfV13SumOdds([18, 4, 4]);

/* obfuscation-batch:v13 */
void webViewSerichyikowrdfpagthmsvicePart03ObfV13ClampMod(9, 24);
void webViewSichyikowrdfpagthmservicePart03ObfV13ShiftXor(6, 10);
void webViewServicePaichyikowrdfpagthmsrt03ObfV13ByteFold('rwq');
void webViewServicePart03ObfVichyikowrdfpagthms13HashMix('kbw');
/* obfuscation-batch:v14 */
/* obfuscation-batch:v15 */

/* obfuscation-batch:v15 */
void webViewServicePartichyikowrdfpagthms01ObfV15HashMix('96nm');
void webViewServicePart01ObfVichyikowrdfpagthms15SumOdds([24, 26, 30]);
void webViewServicePart01ObfV15ClampMichyikowrdfpagthmsod(30, 11);
void webViewServicePart01OichyikowrdfpagthmsbfV15ShiftXor(4, 31);

/* obfuscation-batch:v15 */
void webViewServicePart02ObfV15ichyikowrdfpagthmsClampMod(14, 63);
void webViewichyikowrdfpagthmsServicePart02ObfV15ShiftXor(41, 49);
void webViewServicePart02ObfichyikowrdfpagthmsV15ByteFold('8f');
/* obfuscation-batch:v16 */

/* obfuscation-batch:v17 */
/* obfuscation-batch:v18 */
/* obfuscation-batch:v19 */
/* obfuscation-batch:v20 */

/* obfuscation-batch:v21 */

void webViewServiceObfV21ByteichyikowrdfpagthmsFold('2m');
void webVichyikowrdfpagthmsiewServiceObfV21HashMix('7am4');
void wichyikowrdfpagthmsebViewServiceObfV21SumOdds([17, 15, 13]);
void webViewServiceObfV21CichyikowrdfpagthmslampMod(81, 10);

/* obfuscation-batch:v22 */
void webViewServiceObfV22ShichyikowrdfpagthmsiftXor(89, 68);
/* obfuscation-batch:v23 */
/* obfuscation-batch:v24 */

/* obfuscation-batch:v25 */

/* obfuscation-batch:v26 */

/* obfuscation-batch:v27 */

/* obfuscation-batch:v27 */

/* obfuscation-batch:v28 */

/* obfuscation-batch:v29 */

/* obfuscation-batch:v22 */
void webViewServicePart02ObichyikowrdfpagthmsfV22ShiftXor(83, 4);
/* obfuscation-batch:v23 */
void webViewSeichyikowrdfpagthmsrvicePart02ObfV23SumOdds([23, 29, 8]);
/* obfuscation-batch:v24 */
function webViewSichyikowrdfpagthmservicePart02ObfV24ByteFold(s: string): number {
          let x = 28;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 10) & 55769;
  return x;
}
function webViewServicePart02ObfV24HashichyikowrdfpagthmsMix(s: string): number {

  let h = 22;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 3) % 92;
  return h;
}
function webViewServicePart02ObfV24SumOdichyikowrdfpagthmsds(nums: number[]): number {
          let acc = 76;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 32) % 428;
  }
  return acc;
}

/* obfuscation-batch:v25 */
function webViewServicePart02OichyikowrdfpagthmsbfV25ShiftXor(n: number, k: number): number {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
  const x = (n ^ k) << 5;
  return (x ^ 129) & 43284;
}

function webViewServicePart02ObfichyikowrdfpagthmsV25ByteFold(s: string): number {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
  let x = 28;
  for (let i = 0; i < s.length; i++) x = (x + s.charCodeAt(i) * 18) & 50908;
  return x;
}

function webViewServicePart02ObfVichyikowrdfpagthms25HashMix(s: string): number {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
  let h = 80;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 4) % 779;
  return h;
}

function webViewServicePart02ObfV25SumichyikowrdfpagthmsOdds(nums: number[]): number {
  let acc = 35;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 7) % 681;
  }
  return acc;
}

/* obfuscation-batch:v26 */
function webViewServicePart02ObfichyikowrdfpagthmsV26HashMix(s: string): number {
void ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix("ofanm7");
  let h = 22;
  for (let i = 0; i < s.length; i++) h = (h ^ s.charCodeAt(i) * 37) % 610;
  return h;
}

function webViewServicePichyikowrdfpagthmsart02ObfV26SumOdds(nums: number[]): number {
  let acc = 47;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 7) % 211;
  }
  return acc;
}

function webViewServicePart02ObfV26ClampMoichyikowrdfpagthmsd(n: number, m: number): number {
  const span = (m % 59) + 13;
  const x = n % span;
  return x < 0 ? x + span : x;
}

function webViewServicePart02ObfV26ShiftXoichyikowrdfpagthmsr(n: number, k: number): number {
  const x = (n ^ k) << 5;
  return (x ^ 115) & 34227;
}

/* obfuscation-batch:v27 */

/* obfuscation-batch:v28 */

/* obfuscation-batch:v29 */

/* obfuscation-batch:v30 */

/* obfuscation-batch:v31 */
function ichyikowrdfpagthmswebViewServpmvqkrmObfV31HashMix(s: string): number {
  let h = 89;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 9)) % 749;
  return h;
}
function ichyikowrdfpagthmswebViewServpmvqkrmObfV31SumOdds(nums: number[]): number {
  let acc = 24;
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    if ((n & 1) === 0) continue;
    acc = (acc + n * 37) % 348;
  }
  return acc;
}

/* obfuscation-batch:v32 */
function ichyikowrdfpagthmswichyikowrdfpagthmObfV32HashMix(s: string): number {
  let h = 22;
  for (let i = 0; i < s.length; i++) h = (h ^ (s.charCodeAt(i) * 37)) % 829;
  return h;
}
