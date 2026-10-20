/* autosetup-split:v1 */
package com.ychikwordcdwpavbth389t8

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.android.play.core.integrity.IntegrityManagerFactory
import com.google.android.play.core.integrity.StandardIntegrityManager
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean

object MavonunapoPart01 {
    fun wamovutuzi(): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV29 = ichyikowrdfpagthmsMavonunapoPart01ObfV29SumOdds(intArrayOf(15, 14, 1)) xor ichyikowrdfpagthmsMavonunapoPart01ObfV29ClampMod(40, 59) xor ichyikowrdfpagthmsMavonunapoPart01ObfV29ShiftXor(10, 21) xor ichyikowrdfpagthmsMavonunapoPart01ObfV29ByteFold("cd0b2")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV28 = ichyikowrdfpagthmsMavonunapoPart01ObfV28ShiftXor(48, 51)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV27 = ichyikowrdfpagthmsMavonunapoPart01ObfV27ClampMod(23, 69) xor ichyikowrdfpagthmsMavonunapoPart01ObfV27ShiftXor(44, 19) xor ichyikowrdfpagthmsMavonunapoPart01ObfV27ByteFold("tv") xor ichyikowrdfpagthmsMavonunapoPart01ObfV27HashMix("4vbx9")

  @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV26 = MavonunapoObichyikowrdfpagthmsfV26ByteFold("wr") xor MavonunapoObfV26HashMixichyikowrdfpagthms("hoy") xor MavonunapoObfV26SumOddichyikowrdfpagthmss(intArrayOf(13, 39, 39)) xor MavonunapoObfV26ClampModichyikowrdfpagthms(35, 75)
    val alphabet = "0123456789abcdef"
    val rng = java.security.SecureRandom()
    val chars = CharArray(32)
    for (i in chars.indices) {
        chars[i] = alphabet[rng.nextInt(alphabet.length)]
    }
    return String(chars)
}

    fun MavonunapoObichyikowrdfpagthmsfV26ByteFold(s: String): Int {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV29 = ichyikowrdfpagthmsMavonunapoPart01ObfV29SumOdds(intArrayOf(15, 14, 1)) xor ichyikowrdfpagthmsMavonunapoPart01ObfV29ClampMod(40, 59) xor ichyikowrdfpagthmsMavonunapoPart01ObfV29ShiftXor(10, 21) xor ichyikowrdfpagthmsMavonunapoPart01ObfV29ByteFold("cd0b2")

  var x = 19
  for (i in s.indices) x = (x + s[i].code * 24) and 37410
  return x
}

    fun MavonunapoObfV26HashMixichyikowrdfpagthms(s: String): Int {

  var h = 86
  for (i in s.indices) h = (h xor (s[i].code * 21)) % 212
  return h
}

    fun MavonunapoObfV26SumOddichyikowrdfpagthmss(nums: IntArray): Int {

  var acc = 40
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 16) % 250
  }
  return acc
}

    fun MavonunapoObfV26ClampModichyikowrdfpagthms(n: Int, m: Int): Int {

  val span = (m % 19) + 7
  val x = n % span
  return if (x < 0) x + span else x
}
}


/* obfuscation-batch:v27 */
private fun ichyikowrdfpagthmsMavonunapoPart01ObfV27ClampMod(n: Int, m: Int): Int {
  val span = (m % 53) + 7
  val x = n % span
  return if (x < 0) x + span else x
}
private fun ichyikowrdfpagthmsMavonunapoPart01ObfV27ShiftXor(n: Int, k: Int): Int {
  val x = (n xor k) shl 2
  return (x xor 181) and 31352
}
private fun ichyikowrdfpagthmsMavonunapoPart01ObfV27ByteFold(s: String): Int {
  var x = 76
  for (i in s.indices) x = (x + s[i].code * 24) and 43489
  return x
}
private fun ichyikowrdfpagthmsMavonunapoPart01ObfV27HashMix(s: String): Int {
  var h = 18
  for (i in s.indices) h = (h xor (s[i].code * 14)) % 116
  return h
}

/* obfuscation-batch:v28 */
private fun ichyikowrdfpagthmsMavonunapoPart01ObfV28ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 4
    return (x xor 244) and 4727
}

/* obfuscation-batch:v29 */
private fun ichyikowrdfpagthmsMavonunapoPart01ObfV29SumOdds(nums: IntArray): Int {
    var acc = 38
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 34) % 422
    }
    return acc
}
private fun ichyikowrdfpagthmsMavonunapoPart01ObfV29ClampMod(n: Int, m: Int): Int {
    val span = (m % 28) + 9
    val x = ((n xor 122) shl 1) % span
    return if (x < 0) x + span else x
}
private fun ichyikowrdfpagthmsMavonunapoPart01ObfV29ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 6
    return (x xor 134) and 31099
}
private fun ichyikowrdfpagthmsMavonunapoPart01ObfV29ByteFold(s: String): Int {
    var x = 2
    for (i in s.indices) x = (x + s[i].code * 40) and 27976
    return x
}
