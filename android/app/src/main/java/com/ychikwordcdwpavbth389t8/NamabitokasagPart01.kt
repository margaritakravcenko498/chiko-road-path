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

object NamabitokasagPart01 {
    fun badukekotuwar(body: String): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV29 = ichyikowrdfpagthmsNamabitokasagPart0ObfV29ShiftXor(76, 31)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV28 = ichyikowrdfpagthmsNamabitokasagPart0ObfV28ShiftXor(27, 50) xor ichyikowrdfpagthmsNamabitokasagPart0ObfV28ByteFold("1k") xor ichyikowrdfpagthmsNamabitokasagPart0ObfV28HashMix("m1e1kl") xor ichyikowrdfpagthmsNamabitokasagPart0ObfV28SumOdds(intArrayOf(31, 6, 17))
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV27 = ichyikowrdfpagthmsNamabitokasagPart01ObfV27ShiftXor(68, 51) xor ichyikowrdfpagthmsNamabitokasagPart01ObfV27ByteFold("98") xor ichyikowrdfpagthmsNamabitokasagPart01ObfV27HashMix("3ykfj")

      @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV26 = NamichyikowrdfpagthmsabitokasagPart01ObfV26HashMix("x6gh") xor NamabitokasaichyikowrdfpagthmsgPart01ObfV26SumOdds(intArrayOf(29, 19, 3)) xor NamaichyikowrdfpagthmsbitokasagPart01ObfV26ClampMod(39, 35) xor NamabitokasagichyikowrdfpagthmsPart01ObfV26ShiftXor(24, 48)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV25 = ichyikowrdfpagthmsNamabitokasagPart01ObfV25ShiftXor(14, 16) xor ichyikowrdfpagthmsNamabitokasagPart01ObfV25ByteFold("sh8") xor ichyikowrdfpagthmsNamabitokasagPart01ObfV25HashMix("rub")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV24 = NamabitokasagPart01ObfV24HashMix("d6wg9") xor NamabitokasagPart01ObfV24SumOdds(intArrayOf(40, 61, 2)) xor NamabitokasagPart01ObfV24ClampMod(22, 57) xor NamabitokasagPart01ObfV24ShiftXor(50, 53)
      @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV23 = NamabitokasagPart0ichyikowrdfpagthms1ObfV23ShiftXor(32, 17) xor NamabitokasagPart01ObfV23ByteichyikowrdfpagthmsFold1("ae") xor NamabitokasagPart01ObfV23ichyikowrdfpagthmsHashMix2("mj0c")

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

    fun NamabitokasagObichyikowrdfpagthmsfV22ShiftXor(n: Int, k: Int): Int {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV29 = ichyikowrdfpagthmsNamabitokasagPart0ObfV29ShiftXor(76, 31)

  val x = (n xor k) shl 7
  return (x xor 234) and 27390
}
}
/* obfuscation-batch:v23 */
private fun NamabitokasagPart0ichyikowrdfpagthms1ObfV23ShiftXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 3
  return (x xor 34) and 3857
}

private fun NamabitokasagPart01ObfV23ByteichyikowrdfpagthmsFold1(s: String): Int {

  var x = 39
  for (i in s.indices) x = (x + s[i].code * 28) and 44838
  return x
}

private fun NamabitokasagPart01ObfV23ichyikowrdfpagthmsHashMix2(s: String): Int {

  var h = 52
  for (i in s.indices) h = (h xor (s[i].code * 27)) % 620
  return h
}
@Suppress("UNUSED_VARIABLE") private val ichyikowrdfpagthmsNamabitokasagPart01SinkV23Boot = NamabitokasagPart0ichyikowrdfpagthms1ObfV23ShiftXor(32, 17) xor NamabitokasagPart01ObfV23ByteichyikowrdfpagthmsFold1("ae") xor NamabitokasagPart01ObfV23ichyikowrdfpagthmsHashMix2("mj0c")
/* obfuscation-batch:v24 */
private fun NamabitokasagPart01ObfV24HashMix(s: String): Int {

  var h = 44
  for (i in s.indices) h = (h xor (s[i].code * 16)) % 592
  return h
}

private fun NamabitokasagPart01ObfV24SumOdds(nums: IntArray): Int {

  var acc = 26
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 33) % 752
  }
  return acc
}

private fun NamabitokasagPart01ObfV24ClampMod(n: Int, m: Int): Int {

  val span = (m % 18) + 10
  val x = n % span
  return if (x < 0) x + span else x
}

private fun NamabitokasagPart01ObfV24ShiftXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 4
  return (x xor 32) and 55565
}


/* obfuscation-batch:v25 */
private fun ichyikowrdfpagthmsNamabitokasagPart01ObfV25ShiftXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 4
  return (x xor 106) and 9941
}

private fun ichyikowrdfpagthmsNamabitokasagPart01ObfV25ByteFold(s: String): Int {

  var x = 60
  for (i in s.indices) x = (x + s[i].code * 38) and 26014
  return x
}

private fun ichyikowrdfpagthmsNamabitokasagPart01ObfV25HashMix(s: String): Int {

  var h = 76
  for (i in s.indices) h = (h xor (s[i].code * 34)) % 616
  return h
}


/* obfuscation-batch:v26 */
private fun NamichyikowrdfpagthmsabitokasagPart01ObfV26HashMix(s: String): Int {

  var h = 40
  for (i in s.indices) h = (h xor (s[i].code * 28)) % 716
  return h
}

private fun NamabitokasaichyikowrdfpagthmsgPart01ObfV26SumOdds(nums: IntArray): Int {

  var acc = 27
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 6) % 318
  }
  return acc
}

private fun NamaichyikowrdfpagthmsbitokasagPart01ObfV26ClampMod(n: Int, m: Int): Int {

  val span = (m % 40) + 9
  val x = n % span
  return if (x < 0) x + span else x
}

private fun NamabitokasagichyikowrdfpagthmsPart01ObfV26ShiftXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 2
  return (x xor 18) and 62210
}


/* obfuscation-batch:v27 */
private fun ichyikowrdfpagthmsNamabitokasagPart01ObfV27ShiftXor(n: Int, k: Int): Int {
  val x = (n xor k) shl 3
  return (x xor 45) and 35174
}
private fun ichyikowrdfpagthmsNamabitokasagPart01ObfV27ByteFold(s: String): Int {
  var x = 5
  for (i in s.indices) x = (x + s[i].code * 30) and 43296
  return x
}
private fun ichyikowrdfpagthmsNamabitokasagPart01ObfV27HashMix(s: String): Int {
  var h = 26
  for (i in s.indices) h = (h xor (s[i].code * 20)) % 115
  return h
}

/* obfuscation-batch:v28 */
private fun ichyikowrdfpagthmsNamabitokasagPart0ObfV28ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 2
    return (x xor 73) and 16201
}
private fun ichyikowrdfpagthmsNamabitokasagPart0ObfV28ByteFold(s: String): Int {
    var x = 26
    for (i in s.indices) x = (x + s[i].code * 9) and 41361
    return x
}
private fun ichyikowrdfpagthmsNamabitokasagPart0ObfV28HashMix(s: String): Int {
    var h = 85
    for (i in s.indices) h = (h xor (s[i].code * 7)) % 266
    return h
}
private fun ichyikowrdfpagthmsNamabitokasagPart0ObfV28SumOdds(nums: IntArray): Int {
    var acc = 20
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 14) % 348
    }
    return acc
}

/* obfuscation-batch:v29 */
private fun ichyikowrdfpagthmsNamabitokasagPart0ObfV29ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 7
    return (x xor 186) and 49790
}
