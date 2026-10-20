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

object HulahiqawPart03 {
    fun HulahiqawObfV24SumOdds(nums: IntArray): Int {

  var acc = 88
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 27) % 787
  }
  return acc
}
}


/* obfuscation-batch:v25 */
private fun ichyikowrdfpagthmsHulahiqawPart03ObfV25ShiftXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 3
  return (x xor 37) and 32415
}

private fun ichyikowrdfpagthmsHulahiqawPart03ObfV25ByteFold(s: String): Int {

  var x = 42
  for (i in s.indices) x = (x + s[i].code * 31) and 52897
  return x
}

private fun ichyikowrdfpagthmsHulahiqawPart03ObfV25HashMix(s: String): Int {

  var h = 23
  for (i in s.indices) h = (h xor (s[i].code * 40)) % 372
  return h
}
@Suppress("UNUSED_VARIABLE") private val ichyikowrdfpagthmsBootV25 = ichyikowrdfpagthmsHulahiqawPart03ObfV25ShiftXor(10, 21) xor ichyikowrdfpagthmsHulahiqawPart03ObfV25ByteFold("d5") xor ichyikowrdfpagthmsHulahiqawPart03ObfV25HashMix("s8")


/* obfuscation-batch:v26 */
private fun HulahiqawPichyikowrdfpagthmsart03ObfV26ClampMod(n: Int, m: Int): Int {

  val span = (m % 44) + 5
  val x = n % span
  return if (x < 0) x + span else x
}

private fun HulahiqawPart03ObfichyikowrdfpagthmsV26ShiftXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 1
  return (x xor 193) and 34412
}
@Suppress("UNUSED_VARIABLE")
private val ichyikowrdfpagthmsBootV26 = HulahiqawPichyikowrdfpagthmsart03ObfV26ClampMod(73, 35) xor HulahiqawPart03ObfichyikowrdfpagthmsV26ShiftXor(46, 72)


/* obfuscation-batch:v27 */
private fun ichyikowrdfpagthmsHulahiqawPart03ObfV27SumOdds(nums: IntArray): Int {
  var acc = 73
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 23) % 412
  }
  return acc
}
private fun ichyikowrdfpagthmsHulahiqawPart03ObfV27ClampMod(n: Int, m: Int): Int {
  val span = (m % 21) + 7
  val x = n % span
  return if (x < 0) x + span else x
}

/* obfuscation-batch:v28 */
private fun ichyikowrdfpagthmsHulahiqawPart03ObfV28ClampMod(n: Int, m: Int): Int {
    val span = (m % 28) + 3
    val x = ((n xor 104) shl 6) % span
    return if (x < 0) x + span else x
}
