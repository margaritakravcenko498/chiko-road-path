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

object SacunonidPart02 {
    fun ichyikowrdfpagthmsSacunonidObfV25HashMix(s: String): Int {

  var h = 82
  for (i in s.indices) h = (h xor (s[i].code * 37)) % 776
  return h
}

    fun VofovimafogObfV24SumOdds(nums: IntArray): Int {

  var acc = 13
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 7) % 443
  }
  return acc
}
}


/* obfuscation-batch:v26 */
private fun SacunonidPart02ObfV26SumOdichyikowrdfpagthmsds(nums: IntArray): Int {

  var acc = 68
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 35) % 463
  }
  return acc
}

private fun SacunonidPart02ObfV26ClampichyikowrdfpagthmsMod(n: Int, m: Int): Int {

  val span = (m % 31) + 12
  val x = n % span
  return if (x < 0) x + span else x
}

private fun SacunonidPart02ObfV26ShiftXichyikowrdfpagthmsor(n: Int, k: Int): Int {

  val x = (n xor k) shl 1
  return (x xor 44) and 11965
}
@Suppress("UNUSED_VARIABLE")
private val ichyikowrdfpagthmsBootV26 = SacunonidPart02ObfV26SumOdichyikowrdfpagthmsds(intArrayOf(17, 30, 37)) xor SacunonidPart02ObfV26ClampichyikowrdfpagthmsMod(88, 42) xor SacunonidPart02ObfV26ShiftXichyikowrdfpagthmsor(10, 47)


/* obfuscation-batch:v27 */
private fun ichyikowrdfpagthmsSacunonidPart02ObfV27ClampMod(n: Int, m: Int): Int {
  val span = (m % 40) + 5
  val x = n % span
  return if (x < 0) x + span else x
}
private fun ichyikowrdfpagthmsSacunonidPart02ObfV27ShiftXor(n: Int, k: Int): Int {
  val x = (n xor k) shl 6
  return (x xor 125) and 9598
}

/* obfuscation-batch:v28 */
private fun ichyikowrdfpagthmsSacunonidPart02ObfV28HashMix(s: String): Int {
    var h = 68
    for (i in s.indices) h = (h xor (s[i].code * 24)) % 766
    return h
}
private fun ichyikowrdfpagthmsSacunonidPart02ObfV28SumOdds(nums: IntArray): Int {
    var acc = 68
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 20) % 142
    }
    return acc
}
