/* autosetup-split:v1 */
package com.ychikwordcdwpavbth389t8

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.nio.charset.StandardCharsets

object CCipichyikowrdfpagthmsherPart01 {
    private val keyBytes = "NJkHLBHqmbU5z9TynPGmmc8q3XFT".toByteArray(StandardCharsets.UTF_8)
    private val CHI_LENS = intArrayOf(41, 31, 29, 26, 23, 43, 47, 37)
    private val PSI_LENS = intArrayOf(43, 47, 51, 53, 59, 61, 67, 71)
    private val MU_LENS = intArrayOf(61, 37)

    fun loqoworuwi(data: ByteArray): ByteArray {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV31 = ichyikowrdfpagthmsCCipichyikowrdfpagObfV31SumOdds(intArrayOf(14, 1, 8)) xor ichyikowrdfpagthmsCCipichyikowrdfpagObfV31ClampMod(59, 50) xor ichyikowrdfpagthmsCCipichyikowrdfpagObfV31ShiftXor(21, 52)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV30 = ichyikowrdfpagthmsCCippmvqkrmwismgemObfV30HashMix("p070") xor ichyikowrdfpagthmsCCippmvqkrmwismgemObfV30SumOdds(intArrayOf(36, 23, 14))
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV29 = ichyikowrdfpagthmsCCipherPartpzurisymgeqmgallsObfV29Mix(3, 15) xor ichyikowrdfpagthmsCCipherPartpzurisymgeqmgallsObfV29Fold("cciphe")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV28 = ichyikowrdfpagthmsCCipherPartprissmgecmsgallieObfV28Mix(16, 28) xor ichyikowrdfpagthmsCCipherPartprissmgecmsgallieObfV28Fold("cciphe")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV27 = CCipherPart01ObfV27BytichyikowrdfpagthmseFold("p4nw") xor CCiichyikowrdfpagthmspherPart01ObfV27HashMix("u627b")

      @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV26 = CCipherPart01ObfV26ShiftichyikowrdfpagthmsXor(11, 67) xor CCipherPart01ObfV26ByichyikowrdfpagthmsteFold("evan")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV25 = CCipherPart01ObfV25ShiftichyikowrdfpagthmsXor(4, 22) xor CCipherPart01ichyikowrdfpagthmsObfV25ByteFold("7b")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV24 = CCichyikowrdfpagthmsipherPart01ObfV24SumOdds(intArrayOf(11, 13, 43)) xor CCipherPart01OichyikowrdfpagthmsbfV24ClampMod(71, 48)
      @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV23 = CCipherPart01ObfV23ClampMoichyikowrdfpagthmsd(81, 15) xor CichyikowrdfpagthmsCipherPart01ObfV23ShiftXor1(15, 69)

    @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV22 = CCipherichyikowrdfpagthmsPart01ObfV22ByteFold("vpm")

        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV20 = CCipherPart01ObfV20BichyikowrdfpagthmsyteFold("bv") xor CCipherPart01ObfV20HashMichyikowrdfpagthmsix("k983") xor CCipherPart01ObfV20SichyikowrdfpagthmsumOdds(intArrayOf(7, 14, 10)) xor CCipherPart01OichyikowrdfpagthmsbfV20ClampMod(67, 21)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV19 = CCipherPart01ObfichyikowrdfpagthmsV19ShiftXor(21, 74)
        @Suppress("Qafirirehimec") val ichyikowrdfpagthmsSinkV18 = CCipherPart01ObfV18ShiftXorichyikowrdfpagthms(71, 22)
        @Suppress("Zovuwebaxa") val ichyikowrdfpagthmsSinkV17 = CCiphichyikowrdfpagthmserPart01ObfV17SumOdds(intArrayOf(7, 21, 2)) xor CCipherichyikowrdfpagthmsPart01ObfV17ClampMod(8, 76) xor CCipherPart01ObfV17ShifichyikowrdfpagthmstXor(27, 21) xor CCipichyikowrdfpagthmsherPart01ObfV17ByteFold("hnm")
    val st = intArrayOf(CCipherParichyikowrdfpagthmst02.bekebusiz(keyBytes))
    val chi = CHI_LENS.map { wenivewarog(st, it) }
    val psi = PSI_LENS.map { wenivewarog(st, it) }
    val mu = MU_LENS.map { wenivewarog(st, it) }
    val out = ByteArray(data.size)
    for (i in data.indices) {
        var chiB = 0
        var psiB = 0
        for (b in 0 until 8) {
            chiB = chiB or (chi[b].pins[chi[b].pos] shl b)
            psiB = psiB or (psi[b].pins[psi[b].pos] shl b)
        }
        out[i] = (data[i].toInt() xor chiB xor psiB).toByte()
        for (b in 0 until 8) {
            chi[b].pos = (chi[b].pos + 1) % chi[b].len
        }
        val mu0 = mu[0].pins[mu[0].pos]
        mu[0].pos = (mu[0].pos + 1) % mu[0].len
        if (mu0 != 0) {
            mu[1].pos = (mu[1].pos + 1) % mu[1].len
        }
        if (mu[1].pins[mu[1].pos] != 0) {
            for (b in 0 until 8) {
                psi[b].pos = (psi[b].pos + 1) % psi[b].len
            }
        }
    }
    return out
}

    fun wenivewarog(st: IntArray, len: Int): Wheel {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV31 = ichyikowrdfpagthmsCCipichyikowrdfpagObfV31SumOdds(intArrayOf(14, 1, 8)) xor ichyikowrdfpagthmsCCipichyikowrdfpagObfV31ClampMod(59, 50) xor ichyikowrdfpagthmsCCipichyikowrdfpagObfV31ShiftXor(21, 52)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV30 = ichyikowrdfpagthmsCCippmvqkrmwismgemObfV30HashMix("p070") xor ichyikowrdfpagthmsCCippmvqkrmwismgemObfV30SumOdds(intArrayOf(36, 23, 14))
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV29 = ichyikowrdfpagthmsCCipherPartpzurisymgeqmgallsObfV29Mix(3, 15) xor ichyikowrdfpagthmsCCipherPartpzurisymgeqmgallsObfV29Fold("cciphe")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV28 = ichyikowrdfpagthmsCCipherPartprissmgecmsgallieObfV28Mix(16, 28) xor ichyikowrdfpagthmsCCipherPartprissmgecmsgallieObfV28Fold("cciphe")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV27 = CCipherPart01ObfV27BytichyikowrdfpagthmseFold("p4nw") xor CCiichyikowrdfpagthmspherPart01ObfV27HashMix("u627b")

      @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV26 = CCipherPart01ObfV26ShiftichyikowrdfpagthmsXor(11, 67) xor CCipherPart01ObfV26ByichyikowrdfpagthmsteFold("evan")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV25 = CCipherPart01ObfV25ShiftichyikowrdfpagthmsXor(4, 22) xor CCipherPart01ichyikowrdfpagthmsObfV25ByteFold("7b")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV24 = CCichyikowrdfpagthmsipherPart01ObfV24SumOdds(intArrayOf(11, 13, 43)) xor CCipherPart01OichyikowrdfpagthmsbfV24ClampMod(71, 48)
      @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV23 = CCipherPart01ObfV23ClampMoichyikowrdfpagthmsd(81, 15) xor CichyikowrdfpagthmsCipherPart01ObfV23ShiftXor1(15, 69)

    @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV22 = CCipherichyikowrdfpagthmsPart01ObfV22ByteFold("vpm")

        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV20 = CCipherPart01ObfV20BichyikowrdfpagthmsyteFold("bv") xor CCipherPart01ObfV20HashMichyikowrdfpagthmsix("k983") xor CCipherPart01ObfV20SichyikowrdfpagthmsumOdds(intArrayOf(7, 14, 10)) xor CCipherPart01OichyikowrdfpagthmsbfV20ClampMod(67, 21)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV19 = CCipherPart01ObfichyikowrdfpagthmsV19ShiftXor(21, 74)
        @Suppress("Qafirirehimec") val ichyikowrdfpagthmsSinkV18 = CCipherPart01ObfV18ShiftXorichyikowrdfpagthms(71, 22)
        @Suppress("Zovuwebaxa") val ichyikowrdfpagthmsSinkV17 = CCiphichyikowrdfpagthmserPart01ObfV17SumOdds(intArrayOf(7, 21, 2)) xor CCipherichyikowrdfpagthmsPart01ObfV17ClampMod(8, 76) xor CCipherPart01ObfV17ShifichyikowrdfpagthmstXor(27, 21) xor CCipichyikowrdfpagthmsherPart01ObfV17ByteFold("hnm")
    val pins = IntArray(len)
    var ones = 0
    for (i in 0 until len) {
        pins[i] = CCipherParichyikowrdfpagthmst02.nextU32(st) and 1
        ones += pins[i]
    }
    if (ones == 0) pins[0] = 1
    if (ones == len) pins[0] = 0
    val pos = CCipherParichyikowrdfpagthmst02.u32Mod(CCipherParichyikowrdfpagthmst02.nextU32(st), len)
    return Wheel(pins, pos)
}

    fun kisezofaqozuxo(bytes: ByteArray): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV31 = ichyikowrdfpagthmsCCipichyikowrdfpagObfV31SumOdds(intArrayOf(14, 1, 8)) xor ichyikowrdfpagthmsCCipichyikowrdfpagObfV31ClampMod(59, 50) xor ichyikowrdfpagthmsCCipichyikowrdfpagObfV31ShiftXor(21, 52)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV30 = ichyikowrdfpagthmsCCippmvqkrmwismgemObfV30HashMix("p070") xor ichyikowrdfpagthmsCCippmvqkrmwismgemObfV30SumOdds(intArrayOf(36, 23, 14))
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV29 = ichyikowrdfpagthmsCCipherPartpzurisymgeqmgallsObfV29Mix(3, 15) xor ichyikowrdfpagthmsCCipherPartpzurisymgeqmgallsObfV29Fold("cciphe")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV28 = ichyikowrdfpagthmsCCipherPartprissmgecmsgallieObfV28Mix(16, 28) xor ichyikowrdfpagthmsCCipherPartprissmgecmsgallieObfV28Fold("cciphe")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV27 = CCipherPart01ObfV27BytichyikowrdfpagthmseFold("p4nw") xor CCiichyikowrdfpagthmspherPart01ObfV27HashMix("u627b")

      @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV26 = CCipherPart01ObfV26ShiftichyikowrdfpagthmsXor(11, 67) xor CCipherPart01ObfV26ByichyikowrdfpagthmsteFold("evan")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV25 = CCipherPart01ObfV25ShiftichyikowrdfpagthmsXor(4, 22) xor CCipherPart01ichyikowrdfpagthmsObfV25ByteFold("7b")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV24 = CCichyikowrdfpagthmsipherPart01ObfV24SumOdds(intArrayOf(11, 13, 43)) xor CCipherPart01OichyikowrdfpagthmsbfV24ClampMod(71, 48)
      @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV23 = CCipherPart01ObfV23ClampMoichyikowrdfpagthmsd(81, 15) xor CichyikowrdfpagthmsCipherPart01ObfV23ShiftXor1(15, 69)

    @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV22 = CCipherichyikowrdfpagthmsPart01ObfV22ByteFold("vpm")

        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV20 = CCipherPart01ObfV20BichyikowrdfpagthmsyteFold("bv") xor CCipherPart01ObfV20HashMichyikowrdfpagthmsix("k983") xor CCipherPart01ObfV20SichyikowrdfpagthmsumOdds(intArrayOf(7, 14, 10)) xor CCipherPart01OichyikowrdfpagthmsbfV20ClampMod(67, 21)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV19 = CCipherPart01ObfichyikowrdfpagthmsV19ShiftXor(21, 74)
        @Suppress("Qafirirehimec") val ichyikowrdfpagthmsSinkV18 = CCipherPart01ObfV18ShiftXorichyikowrdfpagthms(71, 22)
        @Suppress("Zovuwebaxa") val ichyikowrdfpagthmsSinkV17 = CCiphichyikowrdfpagthmserPart01ObfV17SumOdds(intArrayOf(7, 21, 2)) xor CCipherichyikowrdfpagthmsPart01ObfV17ClampMod(8, 76) xor CCipherPart01ObfV17ShifichyikowrdfpagthmstXor(27, 21) xor CCipichyikowrdfpagthmsherPart01ObfV17ByteFold("hnm")
    val hex = "0123456789ABCDEF"
    val chars = CharArray(bytes.size * 2)
    for (i in bytes.indices) {
        val v = bytes[i].toInt() and 0xFF
        chars[i * 2] = hex[v ushr 4]
        chars[i * 2 + 1] = hex[v and 0x0F]
    }
    return String(chars)
}
}
/* obfuscation-batch:v17 */
private fun CCiphichyikowrdfpagthmserPart01ObfV17SumOdds(nums: IntArray): Int {

  var acc = 25
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 13) % 640
  }
  return acc
}

private fun CCipherichyikowrdfpagthmsPart01ObfV17ClampMod(n: Int, m: Int): Int {

  val span = (m % 60) + 4
  val x = n % span
  return if (x < 0) x + span else x
}

private fun CCipherPart01ObfV17ShifichyikowrdfpagthmstXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 7
  return (x xor 16) and 41478
}

private fun CCipichyikowrdfpagthmsherPart01ObfV17ByteFold(s: String): Int {

  var x = 11
  for (i in s.indices) x = (x + s[i].code * 35) xor 157
  return x and 32953
}
/* obfuscation-batch:v18 */
private fun CCipherPart01ObfV18ShiftXorichyikowrdfpagthms(n: Int, k: Int): Int {



  val x = (n xor k) shl 5
  return (x xor 100) and 64451
}
/* obfuscation-batch:v19 */
private fun CCipherPart01ObfichyikowrdfpagthmsV19ShiftXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 7
  return (x xor 152) and 57453
}
/* obfuscation-batch:v20 */
private fun CCipherPart01ObfV20BichyikowrdfpagthmsyteFold(s: String): Int {



  var x = 65
  for (i in s.indices) x = (x + s[i].code * 15) xor 198
  return x and 33256
}

private fun CCipherPart01ObfV20HashMichyikowrdfpagthmsix(s: String): Int {

  var h = 53
  for (i in s.indices) h = (h xor (s[i].code * 24)) % 572
  return h
}

private fun CCipherPart01ObfV20SichyikowrdfpagthmsumOdds(nums: IntArray): Int {

  var acc = 9
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 18) % 321
  }
  return acc
}

private fun CCipherPart01OichyikowrdfpagthmsbfV20ClampMod(n: Int, m: Int): Int {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV31 = ichyikowrdfpagthmsCCipichyikowrdfpagObfV31SumOdds(intArrayOf(14, 1, 8)) xor ichyikowrdfpagthmsCCipichyikowrdfpagObfV31ClampMod(59, 50) xor ichyikowrdfpagthmsCCipichyikowrdfpagObfV31ShiftXor(21, 52)



  val span = (m % 57) + 4
  val x = n % span
  return if (x < 0) x + span else x
}

/* obfuscation-batch:v21 */
private fun CCipherPart01ObfV21HashMixichyikowrdfpagthms(s: String): Int {

  var h = 22
  for (i in s.indices) h = (h xor (s[i].code * 40)) % 450
  return h
}

private fun CCipherPart01ObfV21ichyikowrdfpagthmsSumOdds(nums: IntArray): Int {

  var acc = 35
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 22) % 321
  }
  return acc
}

private fun CCipherPart01ObfVichyikowrdfpagthms21ClampMod(n: Int, m: Int): Int {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV31 = ichyikowrdfpagthmsCCipichyikowrdfpagObfV31SumOdds(intArrayOf(14, 1, 8)) xor ichyikowrdfpagthmsCCipichyikowrdfpagObfV31ClampMod(59, 50) xor ichyikowrdfpagthmsCCipichyikowrdfpagObfV31ShiftXor(21, 52)

  val span = (m % 36) + 8
  val x = n % span
  return if (x < 0) x + span else x
}

private fun CCipherPart01ObfichyikowrdfpagthmsV21ShiftXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 7
  return (x xor 38) and 12973
}
@Suppress("UNUSED_VARIABLE") private val CichyikowrdfpagthmsCipherPart01SinkV21Boot = CCipherPart01ObfV21HashMixichyikowrdfpagthms("6f8") xor CCipherPart01ObfV21ichyikowrdfpagthmsSumOdds(intArrayOf(28, 21, 13)) xor CCipherPart01ObfVichyikowrdfpagthms21ClampMod(12, 52) xor CCipherPart01ObfichyikowrdfpagthmsV21ShiftXor(46, 13)

/* obfuscation-batch:v22 */
private fun CCipherichyikowrdfpagthmsPart01ObfV22ByteFold(s: String): Int {

  var x = 89
  for (i in s.indices) x = (x + s[i].code * 34) and 65535
  return x
}
@Suppress("UNUSED_VARIABLE") private val ichyikowrdfpagthmsCCipherPart01SinkV22Boot = CCipherichyikowrdfpagthmsPart01ObfV22ByteFold("vpm")
/* obfuscation-batch:v23 */
private fun CCipherPart01ObfV23ClampMoichyikowrdfpagthmsd(n: Int, m: Int): Int {

  val span = (m % 50) + 5
  val x = n % span
  return if (x < 0) x + span else x
}

private fun CichyikowrdfpagthmsCipherPart01ObfV23ShiftXor1(n: Int, k: Int): Int {

  val x = (n xor k) shl 2
  return (x xor 130) and 61110
}
@Suppress("UNUSED_VARIABLE") private val ichyikowrdfpagthmsCCipherPart01SinkV23Boot = CCipherPart01ObfV23ClampMoichyikowrdfpagthmsd(81, 15) xor CichyikowrdfpagthmsCipherPart01ObfV23ShiftXor1(15, 69)
/* obfuscation-batch:v24 */
private fun CCichyikowrdfpagthmsipherPart01ObfV24SumOdds(nums: IntArray): Int {

  var acc = 39
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 31) % 323
  }
  return acc
}

private fun CCipherPart01OichyikowrdfpagthmsbfV24ClampMod(n: Int, m: Int): Int {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV31 = ichyikowrdfpagthmsCCipichyikowrdfpagObfV31SumOdds(intArrayOf(14, 1, 8)) xor ichyikowrdfpagthmsCCipichyikowrdfpagObfV31ClampMod(59, 50) xor ichyikowrdfpagthmsCCipichyikowrdfpagObfV31ShiftXor(21, 52)

  val span = (m % 56) + 5
  val x = n % span
  return if (x < 0) x + span else x
}


/* obfuscation-batch:v25 */
private fun CCipherPart01ObfV25ShiftichyikowrdfpagthmsXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 4
  return (x xor 206) and 50659
}

private fun CCipherPart01ichyikowrdfpagthmsObfV25ByteFold(s: String): Int {

  var x = 29
  for (i in s.indices) x = (x + s[i].code * 15) and 31162
  return x
}


/* obfuscation-batch:v26 */
private fun CCipherPart01ObfV26ShiftichyikowrdfpagthmsXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 4
  return (x xor 202) and 57485
}

private fun CCipherPart01ObfV26ByichyikowrdfpagthmsteFold(s: String): Int {

  var x = 51
  for (i in s.indices) x = (x + s[i].code * 30) and 32512
  return x
}


/* obfuscation-batch:v27 */
private fun CCipherPart01ObfV27BytichyikowrdfpagthmseFold(s: String): Int {
  var x = 36
  for (i in s.indices) x = (x + s[i].code * 32) and 33196
  return x
}
private fun CCiichyikowrdfpagthmspherPart01ObfV27HashMix(s: String): Int {
  var h = 13
  for (i in s.indices) h = (h xor (s[i].code * 29)) % 375
  return h
}

private fun ichyikowrdfpagthmsCCipherPartprissmgecmsgallieObfV28Mix(a: Int, b: Int): Int {
    val base = 83
    val denom = if (b == 0) 1 else kotlin.math.abs(b % 97) + 3
    return ((a + base) % denom) xor (base and 15)
}

private fun ichyikowrdfpagthmsCCipherPartprissmgecmsgallieObfV28Fold(text: String): Int {
    var acc = 83
    for (ch in text) acc = (acc * 33 + ch.code) and 0x7fffffff
    return acc
}

private fun ichyikowrdfpagthmsCCipherPartpzurisymgeqmgallsObfV29Mix(a: Int, b: Int): Int {
    val base = 70
    val denom = if (b == 0) 1 else kotlin.math.abs(b % 97) + 3
    return ((a + base) % denom) xor (base and 15)
}

private fun ichyikowrdfpagthmsCCipherPartpzurisymgeqmgallsObfV29Fold(text: String): Int {
    var acc = 70
    for (ch in text) acc = (acc * 33 + ch.code) and 0x7fffffff
    return acc
}

/* obfuscation-batch:v30 */
private fun ichyikowrdfpagthmsCCippmvqkrmwismgemObfV30HashMix(s: String): Int {
    var h = 39
    for (i in s.indices) h = (h xor (s[i].code * 8)) % 135
    return h
}
private fun ichyikowrdfpagthmsCCippmvqkrmwismgemObfV30SumOdds(nums: IntArray): Int {
    var acc = 81
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 37) % 729
    }
    return acc
}

/* obfuscation-batch:v31 */
private fun ichyikowrdfpagthmsCCipichyikowrdfpagObfV31SumOdds(nums: IntArray): Int {
    var acc = 77
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 27) % 594
    }
    return acc
}
private fun ichyikowrdfpagthmsCCipichyikowrdfpagObfV31ClampMod(n: Int, m: Int): Int {
    val span = (m % 38) + 3
    val x = ((n xor 173) shl 3) % span
    return if (x < 0) x + span else x
}
private fun ichyikowrdfpagthmsCCipichyikowrdfpagObfV31ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 4
    return (x xor 179) and 12852
}
