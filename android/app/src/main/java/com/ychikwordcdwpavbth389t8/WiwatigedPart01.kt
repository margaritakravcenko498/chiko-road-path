/* autosetup-split:v1 */
package com.ychikwordcdwpavbth389t8

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import okhttp3.OkHttpClient
import okhttp3.Request
import java.util.concurrent.TimeUnit
import com.google.gson.stream.JsonReader
import com.google.gson.stream.JsonToken
import java.io.StringReader

object WiwatigedPart01 {
    fun zavizukem(body: String): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV29 = ichyikowrdfpagthmsWiwatigedPart01ObfV29ShiftXor(32, 19)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV28 = ichyikowrdfpagthmsWiwatigedPart01ObfV28SumOdds(intArrayOf(39, 6, 33)) xor ichyikowrdfpagthmsWiwatigedPart01ObfV28ClampMod(8, 11) xor ichyikowrdfpagthmsWiwatigedPart01ObfV28ShiftXor(74, 21) xor ichyikowrdfpagthmsWiwatigedPart01ObfV28ByteFold("e76pk")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV27 = ichyikowrdfpagthmsWiwatigedPart01ObfV27ShiftXor(72, 70)

      @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV26 = WiwatigedPart01ObfichyikowrdfpagthmsV26ByteFold("va") xor WiwatigedPart0ichyikowrdfpagthms1ObfV26HashMix("6i")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV25 = ichyikowrdfpagthmsWiwatigedPart01ObfV25HashMix("mr") xor ichyikowrdfpagthmsWiwatigedPart01ObfV25SumOdds(intArrayOf(36, 33, 31))
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV24 = WiwatigedPart01ObfV24ShiftXor(41, 55)
      @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV23 = WiwatigedPartichyikowrdfpagthms01ObfV23ClampMod(10, 81) xor WiwatigedPart01ObfV23ShiftXor1ichyikowrdfpagthms(74, 13) xor WiwatigedPart01ObfichyikowrdfpagthmsV23ByteFold2("rbne") xor WiwatigedPart01ObfV23HashichyikowrdfpagthmsMix3("k49f")

    @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV22 = WiwatichyikowrdfpagthmsigedPart01ObfV22SumOdds(intArrayOf(31, 22, 18)) xor WiwatichyikowrdfpagthmsigedPart01ObfV22ClampMod(59, 57) xor WiwatigedPichyikowrdfpagthmsart01ObfV22ShiftXor(5, 80) xor WiwatigeichyikowrdfpagthmsdPart01ObfV22ByteFold("gqcn")

    @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV21 = WiwatigedPart01ObfV21BichyikowrdfpagthmsyteFold("fwhn") xor WiwatigedPart01ObfV21HasichyikowrdfpagthmshMix("8va") xor WiwatigedPart01ObfV21SumOddsichyikowrdfpagthms(intArrayOf(16, 8, 23))
    @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV20 = WiwatigedPart02.ichyikowrdfpagthmsWiwatigedObfV20HashMix("t6s") xor WiwatigedPart03.ichyikowrdfpagthmsWiwatigedObfV20SumOdds(intArrayOf(16, 8, 28)) xor ichyikowrdfpagthmsWiwatigedObfV20ClampMod(17, 47)
    val count = JsonReader(StringReader(body)).use { reader ->
        var tokens = 0
        while (reader.peek() != JsonToken.END_DOCUMENT) {
            when (reader.peek()) {
                JsonToken.BEGIN_OBJECT -> {
                    reader.beginObject()
                    tokens += 1
                }
                JsonToken.END_OBJECT -> {
                    reader.endObject()
                    tokens += 1
                }
                JsonToken.BEGIN_ARRAY -> {
                    reader.beginArray()
                    tokens += 1
                }
                JsonToken.END_ARRAY -> {
                    reader.endArray()
                    tokens += 1
                }
                JsonToken.NAME -> {
                    reader.nextName()
                    tokens += 1
                }
                JsonToken.STRING -> {
                    reader.nextString()
                    tokens += 1
                }
                JsonToken.NUMBER -> {
                    reader.nextDouble()
                    tokens += 1
                }
                JsonToken.BOOLEAN -> {
                    reader.nextBoolean()
                    tokens += 1
                }
                JsonToken.NULL -> {
                    reader.nextNull()
                    tokens += 1
                }
                else -> {
                    reader.skipValue()
                    tokens += 1
                }
            }
        }
        tokens
    }
    return count.toString()
}

    fun ichyikowrdfpagthmsWiwatigedObfV20ClampMod(n: Int, m: Int): Int {

  val span = (m % 22) + 5
  val x = n % span
  return if (x < 0) x + span else x
}
}

/* obfuscation-batch:v21 */
private fun WiwatigedPart01ObfV21BichyikowrdfpagthmsyteFold(s: String): Int {

  var x = 48
  for (i in s.indices) x = (x + s[i].code * 16) and 65535
  return x
}

private fun WiwatigedPart01ObfV21HasichyikowrdfpagthmshMix(s: String): Int {

  var h = 84
  for (i in s.indices) h = (h xor (s[i].code * 20)) % 313
  return h
}

private fun WiwatigedPart01ObfV21SumOddsichyikowrdfpagthms(nums: IntArray): Int {



  var acc = 37
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 32) % 369
  }
  return acc
}
@Suppress("UNUSED_VARIABLE") private val ichyikowrdfpagthmsWiwatigedPart01SinkV21Boot = WiwatigedPart01ObfV21BichyikowrdfpagthmsyteFold("fwhn") xor WiwatigedPart01ObfV21HasichyikowrdfpagthmshMix("8va") xor WiwatigedPart01ObfV21SumOddsichyikowrdfpagthms(intArrayOf(16, 8, 23))

/* obfuscation-batch:v22 */
private fun WiwatichyikowrdfpagthmsigedPart01ObfV22SumOdds(nums: IntArray): Int {

  var acc = 89
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 13) % 776
  }
  return acc
}

private fun WiwatichyikowrdfpagthmsigedPart01ObfV22ClampMod(n: Int, m: Int): Int {

  val span = (m % 30) + 3
  val x = n % span
  return if (x < 0) x + span else x
}

private fun WiwatigedPichyikowrdfpagthmsart01ObfV22ShiftXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 2
  return (x xor 92) and 19160
}

private fun WiwatigeichyikowrdfpagthmsdPart01ObfV22ByteFold(s: String): Int {

  var x = 79
  for (i in s.indices) x = (x + s[i].code * 39) and 65535
  return x
}
@Suppress("UNUSED_VARIABLE") private val ichyikowrdfpagthmsWiwatigedPart01SinkV22Boot = WiwatichyikowrdfpagthmsigedPart01ObfV22SumOdds(intArrayOf(31, 22, 18)) xor WiwatichyikowrdfpagthmsigedPart01ObfV22ClampMod(59, 57) xor WiwatigedPichyikowrdfpagthmsart01ObfV22ShiftXor(5, 80) xor WiwatigeichyikowrdfpagthmsdPart01ObfV22ByteFold("gqcn")
/* obfuscation-batch:v23 */
private fun WiwatigedPartichyikowrdfpagthms01ObfV23ClampMod(n: Int, m: Int): Int {

  val span = (m % 36) + 2
  val x = n % span
  return if (x < 0) x + span else x
}

private fun WiwatigedPart01ObfV23ShiftXor1ichyikowrdfpagthms(n: Int, k: Int): Int {

  val x = (n xor k) shl 4
  return (x xor 123) and 28889
}

private fun WiwatigedPart01ObfichyikowrdfpagthmsV23ByteFold2(s: String): Int {

  var x = 14
  for (i in s.indices) x = (x + s[i].code * 21) and 12223
  return x
}

private fun WiwatigedPart01ObfV23HashichyikowrdfpagthmsMix3(s: String): Int {

  var h = 29
  for (i in s.indices) h = (h xor (s[i].code * 4)) % 605
  return h
}
@Suppress("UNUSED_VARIABLE") private val ichyikowrdfpagthmsWiwatigedPart01SinkV23Boot = WiwatigedPartichyikowrdfpagthms01ObfV23ClampMod(10, 81) xor WiwatigedPart01ObfV23ShiftXor1ichyikowrdfpagthms(74, 13) xor WiwatigedPart01ObfichyikowrdfpagthmsV23ByteFold2("rbne") xor WiwatigedPart01ObfV23HashichyikowrdfpagthmsMix3("k49f")
/* obfuscation-batch:v24 */
private fun WiwatigedPart01ObfV24ShiftXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 2
  return (x xor 78) and 59002
}


/* obfuscation-batch:v25 */
private fun ichyikowrdfpagthmsWiwatigedPart01ObfV25HashMix(s: String): Int {

  var h = 64
  for (i in s.indices) h = (h xor (s[i].code * 7)) % 686
  return h
}

private fun ichyikowrdfpagthmsWiwatigedPart01ObfV25SumOdds(nums: IntArray): Int {

  var acc = 66
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 14) % 256
  }
  return acc
}


/* obfuscation-batch:v26 */
private fun WiwatigedPart01ObfichyikowrdfpagthmsV26ByteFold(s: String): Int {

  var x = 48
  for (i in s.indices) x = (x + s[i].code * 40) and 32025
  return x
}

private fun WiwatigedPart0ichyikowrdfpagthms1ObfV26HashMix(s: String): Int {

  var h = 82
  for (i in s.indices) h = (h xor (s[i].code * 23)) % 476
  return h
}


/* obfuscation-batch:v27 */
private fun ichyikowrdfpagthmsWiwatigedPart01ObfV27ShiftXor(n: Int, k: Int): Int {
  val x = (n xor k) shl 3
  return (x xor 184) and 17674
}

/* obfuscation-batch:v28 */
private fun ichyikowrdfpagthmsWiwatigedPart01ObfV28SumOdds(nums: IntArray): Int {
    var acc = 90
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 12) % 190
    }
    return acc
}
private fun ichyikowrdfpagthmsWiwatigedPart01ObfV28ClampMod(n: Int, m: Int): Int {
    val span = (m % 51) + 3
    val x = ((n xor 110) shl 4) % span
    return if (x < 0) x + span else x
}
private fun ichyikowrdfpagthmsWiwatigedPart01ObfV28ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 2
    return (x xor 198) and 4927
}
private fun ichyikowrdfpagthmsWiwatigedPart01ObfV28ByteFold(s: String): Int {
    var x = 78
    for (i in s.indices) x = (x + s[i].code * 3) and 48435
    return x
}

/* obfuscation-batch:v29 */
private fun ichyikowrdfpagthmsWiwatigedPart01ObfV29ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 2
    return (x xor 106) and 20817
}
