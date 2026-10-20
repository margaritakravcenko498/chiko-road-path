/* autosetup-split:v1 */
package com.ychikwordcdwpavbth389t8

import android.opengl.GLES20
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import javax.microedition.khronos.egl.EGL10
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.egl.EGLContext
import javax.microedition.khronos.egl.EGLDisplay

object SacunonidPart01 {
    fun ichyikowrdfpagthmsSacunonidObfV25ByteFold(s: String): Int {

  var x = 18
  for (i in s.indices) x = (x + s[i].code * 5) and 9739
  return x
}

    fun VofovimafogObfV24HashMix(s: String): Int {

  var h = 17
  for (i in s.indices) h = (h xor (s[i].code * 9)) % 509
  return h
}
}


/* obfuscation-batch:v26 */
private fun SacunonidPart01ObfVichyikowrdfpagthms26ByteFold(s: String): Int {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV28 = ichyikowrdfpagthmsSacunonidPart01ObfV28HashMix("4nap0") xor ichyikowrdfpagthmsSacunonidPart01ObfV28SumOdds(intArrayOf(32, 27, 18)) xor ichyikowrdfpagthmsSacunonidPart01ObfV28ClampMod(77, 60)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV27 = ichyikowrdfpagthmsSacunonidPart01ObfV27ShiftXor(44, 23) xor ichyikowrdfpagthmsSacunonidPart01ObfV27ByteFold("cfy") xor ichyikowrdfpagthmsSacunonidPart01ObfV27HashMix("8j") xor ichyikowrdfpagthmsSacunonidPart01ObfV27SumOdds(intArrayOf(6, 15, 18))

  var x = 69
  for (i in s.indices) x = (x + s[i].code * 32) and 31907
  return x
}

private fun SichyikowrdfpagthmsacunonidPart01ObfV26HashMix(s: String): Int {

  var h = 59
  for (i in s.indices) h = (h xor (s[i].code * 43)) % 448
  return h
}

private fun SacunonidParichyikowrdfpagthmst01ObfV26SumOdds(nums: IntArray): Int {

  var acc = 18
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 20) % 921
  }
  return acc
}

private fun SichyikowrdfpagthmsacunonidPart01ObfV26ClampMod(n: Int, m: Int): Int {

  val span = (m % 26) + 14
  val x = n % span
  return if (x < 0) x + span else x
}
@Suppress("UNUSED_VARIABLE")
private val ichyikowrdfpagthmsBootV26 = SacunonidPart01ObfVichyikowrdfpagthms26ByteFold("5fuhb") xor SichyikowrdfpagthmsacunonidPart01ObfV26HashMix("pf") xor SacunonidParichyikowrdfpagthmst01ObfV26SumOdds(intArrayOf(29, 32, 37)) xor SichyikowrdfpagthmsacunonidPart01ObfV26ClampMod(63, 6)


/* obfuscation-batch:v27 */
private fun ichyikowrdfpagthmsSacunonidPart01ObfV27ShiftXor(n: Int, k: Int): Int {
  val x = (n xor k) shl 3
  return (x xor 90) and 57299
}
private fun ichyikowrdfpagthmsSacunonidPart01ObfV27ByteFold(s: String): Int {
  var x = 15
  for (i in s.indices) x = (x + s[i].code * 11) and 10979
  return x
}
private fun ichyikowrdfpagthmsSacunonidPart01ObfV27HashMix(s: String): Int {
  var h = 23
  for (i in s.indices) h = (h xor (s[i].code * 17)) % 173
  return h
}
private fun ichyikowrdfpagthmsSacunonidPart01ObfV27SumOdds(nums: IntArray): Int {
  var acc = 29
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 21) % 212
  }
  return acc
}

/* obfuscation-batch:v28 */
private fun ichyikowrdfpagthmsSacunonidPart01ObfV28HashMix(s: String): Int {
    var h = 22
    for (i in s.indices) h = (h xor (s[i].code * 28)) % 873
    return h
}
private fun ichyikowrdfpagthmsSacunonidPart01ObfV28SumOdds(nums: IntArray): Int {
    var acc = 79
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 7) % 169
    }
    return acc
}
private fun ichyikowrdfpagthmsSacunonidPart01ObfV28ClampMod(n: Int, m: Int): Int {
    val span = (m % 51) + 8
    val x = ((n xor 149) shl 2) % span
    return if (x < 0) x + span else x
}
