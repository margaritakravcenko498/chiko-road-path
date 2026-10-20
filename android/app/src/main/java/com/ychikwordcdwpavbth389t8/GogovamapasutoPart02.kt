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

object GogovamapasutoPart02 {
    fun GogovamapaichyikowrdfpagthmssutoObfV26ClampMod(n: Int, m: Int): Int {

  val span = (m % 23) + 7
  val x = n % span
  return if (x < 0) x + span else x
}
}


/* obfuscation-batch:v27 */
private fun ichyikowrdfpagthmsGogovamapasutoPart02ObfV27ByteFold(s: String): Int {
  var x = 42
  for (i in s.indices) x = (x + s[i].code * 25) and 17921
  return x
}
private fun ichyikowrdfpagthmsGogovamapasutoPart02ObfV27HashMix(s: String): Int {
  var h = 76
  for (i in s.indices) h = (h xor (s[i].code * 12)) % 424
  return h
}
private fun ichyikowrdfpagthmsGogovamapasutoPart02ObfV27SumOdds(nums: IntArray): Int {
  var acc = 3
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 29) % 105
  }
  return acc
}
