/* autosetup-split:v1 */
package com.ychikwordcdwpavbth389t8

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import okhttp3.OkHttpClient
import okhttp3.Request
import java.util.concurrent.TimeUnit
import com.google.gson.JsonParser

object DomanexiqudPart01 {
    fun dirimazacavef(body: String): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV29 = ichyikowrdfpagthmsDomanexiqudPart01ObfV29ClampMod(36, 71)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV28 = ichyikowrdfpagthmsDomanexiqudPart01ObfV28ClampMod(3, 26) xor ichyikowrdfpagthmsDomanexiqudPart01ObfV28ShiftXor(77, 76) xor ichyikowrdfpagthmsDomanexiqudPart01ObfV28ByteFold("helm") xor ichyikowrdfpagthmsDomanexiqudPart01ObfV28HashMix("cf2")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV27 = ichyikowrdfpagthmsDomanexiqudPart01ObfV27ByteFold("2xw7") xor ichyikowrdfpagthmsDomanexiqudPart01ObfV27HashMix("c9v")

  @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV26 = DomanexiqudObfVichyikowrdfpagthms26ClampMod(33, 57) xor DomanexiqudOichyikowrdfpagthmsbfV26ShiftXor(7, 66) xor DomanexiqudObfichyikowrdfpagthmsV26ByteFold("y1mn") xor DomanichyikowrdfpagthmsexiqudObfV26HashMix("hm95e")
    val element = JsonParser.parseString(body)
    return element.toString().length.toString()
}

    fun DomanexiqudObfVichyikowrdfpagthms26ClampMod(n: Int, m: Int): Int {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV29 = ichyikowrdfpagthmsDomanexiqudPart01ObfV29ClampMod(36, 71)

  val span = (m % 53) + 6
  val x = n % span
  return if (x < 0) x + span else x
}

    fun DomanexiqudOichyikowrdfpagthmsbfV26ShiftXor(n: Int, k: Int): Int {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV29 = ichyikowrdfpagthmsDomanexiqudPart01ObfV29ClampMod(36, 71)

  val x = (n xor k) shl 4
  return (x xor 221) and 3154
}

    fun DomanexiqudObfichyikowrdfpagthmsV26ByteFold(s: String): Int {

  var x = 14
  for (i in s.indices) x = (x + s[i].code * 20) and 34409
  return x
}

    fun DomanichyikowrdfpagthmsexiqudObfV26HashMix(s: String): Int {

  var h = 41
  for (i in s.indices) h = (h xor (s[i].code * 29)) % 635
  return h
}
}


/* obfuscation-batch:v27 */
private fun ichyikowrdfpagthmsDomanexiqudPart01ObfV27ByteFold(s: String): Int {
  var x = 31
  for (i in s.indices) x = (x + s[i].code * 28) and 35023
  return x
}
private fun ichyikowrdfpagthmsDomanexiqudPart01ObfV27HashMix(s: String): Int {
  var h = 61
  for (i in s.indices) h = (h xor (s[i].code * 16)) % 372
  return h
}

/* obfuscation-batch:v28 */
private fun ichyikowrdfpagthmsDomanexiqudPart01ObfV28ClampMod(n: Int, m: Int): Int {
    val span = (m % 42) + 7
    val x = ((n xor 235) shl 4) % span
    return if (x < 0) x + span else x
}
private fun ichyikowrdfpagthmsDomanexiqudPart01ObfV28ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 2
    return (x xor 201) and 5889
}
private fun ichyikowrdfpagthmsDomanexiqudPart01ObfV28ByteFold(s: String): Int {
    var x = 23
    for (i in s.indices) x = (x + s[i].code * 17) and 31116
    return x
}
private fun ichyikowrdfpagthmsDomanexiqudPart01ObfV28HashMix(s: String): Int {
    var h = 71
    for (i in s.indices) h = (h xor (s[i].code * 5)) % 208
    return h
}

/* obfuscation-batch:v29 */
private fun ichyikowrdfpagthmsDomanexiqudPart01ObfV29ClampMod(n: Int, m: Int): Int {
    val span = (m % 66) + 9
    val x = ((n xor 210) shl 5) % span
    return if (x < 0) x + span else x
}
