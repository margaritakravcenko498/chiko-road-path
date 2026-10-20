/* autosetup-split:v1 */
package com.ychikwordcdwpavbth389t8

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.android.volley.DefaultRetryPolicy
import com.android.volley.ExecutorDelivery
import com.android.volley.Request as VolleyRequest
import com.android.volley.RequestQueue
import com.android.volley.toolbox.BasicNetwork
import com.android.volley.toolbox.HurlStack
import com.android.volley.toolbox.NoCache
import com.android.volley.toolbox.StringRequest
import java.util.concurrent.CountDownLatch
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import com.google.gson.stream.JsonReader
import com.google.gson.stream.JsonToken
import java.io.StringReader

object HulahiqawPart01 {
    fun fuwoqahebucoqo(body: String): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV29 = ichyikowrdfpagthmsHulahiqawPart01ObfV29HashMix("32f2") xor ichyikowrdfpagthmsHulahiqawPart01ObfV29SumOdds(intArrayOf(16, 35, 18))
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV28 = ichyikowrdfpagthmsHulahiqawPart01ObfV28SumOdds(intArrayOf(30, 33, 32)) xor ichyikowrdfpagthmsHulahiqawPart01ObfV28ClampMod(27, 50) xor ichyikowrdfpagthmsHulahiqawPart01ObfV28ShiftXor(21, 68)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV27 = ichyikowrdfpagthmsHulahiqawPart01ObfV27ClampMod(63, 6) xor ichyikowrdfpagthmsHulahiqawPart01ObfV27ShiftXor(6, 57)

      @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV26 = HulahiqawPart01ObfVichyikowrdfpagthms26ByteFold("73fdd") xor HulahiqawPart01ObfV26HashichyikowrdfpagthmsMix("72k8c") xor HulahiqawichyikowrdfpagthmsPart01ObfV26SumOdds(intArrayOf(23, 5, 37))
    @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV25 = ichyikowrdfpagthmsHulahiqawPart01ObfV25HashMix("5s") xor ichyikowrdfpagthmsHulahiqawPart01ObfV25SumOdds(intArrayOf(31, 25, 29)) xor ichyikowrdfpagthmsHulahiqawPart01ObfV25ClampMod(48, 13) xor ichyikowrdfpagthmsHulahiqawPart01ObfV25ShiftXor(53, 16)
    @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV24 = HulahiqawPart02.HulahiqawObfV24HashMix("r3q") xor HulahiqawPart03.HulahiqawObfV24SumOdds(intArrayOf(27, 64, 29)) xor HulahiqawObfV24ClampMod(15, 47) xor HulahiqawPart02.HulahiqawObfV24ShiftXor(57, 24)
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

    fun HulahiqawObfV24ClampMod(n: Int, m: Int): Int {

  val span = (m % 66) + 4
  val x = n % span
  return if (x < 0) x + span else x
}
}


/* obfuscation-batch:v25 */
private fun ichyikowrdfpagthmsHulahiqawPart01ObfV25HashMix(s: String): Int {

  var h = 47
  for (i in s.indices) h = (h xor (s[i].code * 16)) % 612
  return h
}

private fun ichyikowrdfpagthmsHulahiqawPart01ObfV25SumOdds(nums: IntArray): Int {

  var acc = 21
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 24) % 559
  }
  return acc
}

private fun ichyikowrdfpagthmsHulahiqawPart01ObfV25ClampMod(n: Int, m: Int): Int {

  val span = (m % 32) + 3
  val x = n % span
  return if (x < 0) x + span else x
}

private fun ichyikowrdfpagthmsHulahiqawPart01ObfV25ShiftXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 1
  return (x xor 66) and 22035
}


/* obfuscation-batch:v26 */
private fun HulahiqawPart01ObfVichyikowrdfpagthms26ByteFold(s: String): Int {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV29 = ichyikowrdfpagthmsHulahiqawPart01ObfV29HashMix("32f2") xor ichyikowrdfpagthmsHulahiqawPart01ObfV29SumOdds(intArrayOf(16, 35, 18))

  var x = 35
  for (i in s.indices) x = (x + s[i].code * 23) and 42990
  return x
}

private fun HulahiqawPart01ObfV26HashichyikowrdfpagthmsMix(s: String): Int {

  var h = 54
  for (i in s.indices) h = (h xor (s[i].code * 35)) % 270
  return h
}

private fun HulahiqawichyikowrdfpagthmsPart01ObfV26SumOdds(nums: IntArray): Int {

  var acc = 41
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 33) % 463
  }
  return acc
}


/* obfuscation-batch:v27 */
private fun ichyikowrdfpagthmsHulahiqawPart01ObfV27ClampMod(n: Int, m: Int): Int {
  val span = (m % 54) + 14
  val x = n % span
  return if (x < 0) x + span else x
}
private fun ichyikowrdfpagthmsHulahiqawPart01ObfV27ShiftXor(n: Int, k: Int): Int {
  val x = (n xor k) shl 4
  return (x xor 83) and 39370
}

/* obfuscation-batch:v28 */
private fun ichyikowrdfpagthmsHulahiqawPart01ObfV28SumOdds(nums: IntArray): Int {
    var acc = 76
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 24) % 484
    }
    return acc
}
private fun ichyikowrdfpagthmsHulahiqawPart01ObfV28ClampMod(n: Int, m: Int): Int {
    val span = (m % 31) + 12
    val x = ((n xor 51) shl 7) % span
    return if (x < 0) x + span else x
}
private fun ichyikowrdfpagthmsHulahiqawPart01ObfV28ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 1
    return (x xor 109) and 49951
}

/* obfuscation-batch:v29 */
private fun ichyikowrdfpagthmsHulahiqawPart01ObfV29HashMix(s: String): Int {
    var h = 17
    for (i in s.indices) h = (h xor (s[i].code * 19)) % 537
    return h
}
private fun ichyikowrdfpagthmsHulahiqawPart01ObfV29SumOdds(nums: IntArray): Int {
    var acc = 29
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 38) % 260
    }
    return acc
}
