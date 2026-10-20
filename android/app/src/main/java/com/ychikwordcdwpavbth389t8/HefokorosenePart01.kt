/* autosetup-split:v1 */
package com.ychikwordcdwpavbth389t8

import android.app.Activity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

object HefokorosenePart01 {
    fun ichyikowrdfpagthmsHefokoroseneObfV17HashMix(s: String): Int {

  var h = 83
  for (i in s.indices) h = (h xor (s[i].code * 32)) % 636
  return h
}

    fun ichyikowrdfpagthmsHefokoroseneObfV17ShiftXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 7
  return (x xor 172) and 24159
}
}
/* obfuscation-batch:v18 */
private fun ichyikowrdfpagthmsHefokorosenePart01ObfV18HashMix(s: String): Int {

  var h = 75
  for (i in s.indices) h = (h xor (s[i].code * 19)) % 303
  return h
}

private fun ichyikowrdfpagthmsHefokorosenePart01ObfV18SumOdds(nums: IntArray): Int {

  var acc = 7
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 19) % 233
  }
  return acc
}

private fun ichyikowrdfpagthmsHefokorosenePart01ObfV18ClampMod(n: Int, m: Int): Int {

  val span = (m % 7) + 2
  val x = n % span
  return if (x < 0) x + span else x
}
/* obfuscation-batch:v19 */
private fun HefichyikowrdfpagthmsokorosenePart01ObfV19ByteFold(s: String): Int {

  var x = 48
  for (i in s.indices) x = (x + s[i].code * 9) xor 171
  return x and 55823
}
/* obfuscation-batch:v20 */
private fun ichyikowrdfpagthmsHefokorosenePart01ObfV20ByteFold(s: String): Int {

  var x = 68
  for (i in s.indices) x = (x + s[i].code * 25) xor 209
  return x and 47798
}

private fun ichyikowrdfpagthmsHefokorosenePart01ObfV20HashMix(s: String): Int {

  var h = 56
  for (i in s.indices) h = (h xor (s[i].code * 11)) % 333
  return h
}

private fun ichyikowrdfpagthmsHefokorosenePart01ObfV20SumOdds(nums: IntArray): Int {

  var acc = 31
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 15) % 786
  }
  return acc
}

private fun ichyikowrdfpagthmsHefokorosenePart01ObfV20ClampMod(n: Int, m: Int): Int {

  val span = (m % 33) + 1
  val x = n % span
  return if (x < 0) x + span else x
}

/* obfuscation-batch:v21 */
private fun HefokorosenePart01ichyikowrdfpagthmsObfV21ShiftXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 6
  return (x xor 157) and 18262
}

private fun HefokorosenePart01ObfV21ByteFoldichyikowrdfpagthms(s: String): Int {

  var x = 55
  for (i in s.indices) x = (x + s[i].code * 13) and 65535
  return x
}
@Suppress("UNUSED_VARIABLE") private val ichyikowrdfpagthmsHefokorosenePart01SinkV21Boot = HefokorosenePart01ichyikowrdfpagthmsObfV21ShiftXor(41, 60) xor HefokorosenePart01ObfV21ByteFoldichyikowrdfpagthms("wh2")

/* obfuscation-batch:v22 */
private fun HefokorosenePart01ObfV22ShifichyikowrdfpagthmstXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 1
  return (x xor 212) and 43072
}

private fun HefoichyikowrdfpagthmskorosenePart01ObfV22ByteFold(s: String): Int {

  var x = 87
  for (i in s.indices) x = (x + s[i].code * 37) and 65535
  return x
}

private fun HefokorosenePichyikowrdfpagthmsart01ObfV22HashMix(s: String): Int {

  var h = 89
  for (i in s.indices) h = (h xor (s[i].code * 41)) % 552
  return h
}
@Suppress("UNUSED_VARIABLE") private val ichyikowrdfpagthmsHefokorosenePart01SinkV22Boot = HefokorosenePart01ObfV22ShifichyikowrdfpagthmstXor(11, 8) xor HefoichyikowrdfpagthmskorosenePart01ObfV22ByteFold("se") xor HefokorosenePichyikowrdfpagthmsart01ObfV22HashMix("ffh")
/* obfuscation-batch:v23 */
private fun HefokoroichyikowrdfpagthmssenePart01ObfV23ShiftXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 1
  return (x xor 54) and 16922
}

private fun HefokorosenePart01ObfV23ByteichyikowrdfpagthmsFold1(s: String): Int {

  var x = 62
  for (i in s.indices) x = (x + s[i].code * 17) and 2046
  return x
}

private fun HefokorosenePart01ObfV23HashMiichyikowrdfpagthmsx2(s: String): Int {

  var h = 71
  for (i in s.indices) h = (h xor (s[i].code * 30)) % 516
  return h
}

private fun HefokorosenePart01ObfVichyikowrdfpagthms23SumOdds3(nums: IntArray): Int {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV29 = ichyikowrdfpagthmsHefokorosenePart01ObfV29ShiftXor(3, 10) xor ichyikowrdfpagthmsHefokorosenePart01ObfV29ByteFold("387a") xor ichyikowrdfpagthmsHefokorosenePart01ObfV29HashMix("ahih6") xor ichyikowrdfpagthmsHefokorosenePart01ObfV29SumOdds(intArrayOf(38, 9, 16))

  var acc = 28
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 19) % 400
  }
  return acc
}
@Suppress("UNUSED_VARIABLE") private val ichyikowrdfpagthmsHefokorosenePart01SinkV23Boot = HefokoroichyikowrdfpagthmssenePart01ObfV23ShiftXor(50, 50) xor HefokorosenePart01ObfV23ByteichyikowrdfpagthmsFold1("2n3") xor HefokorosenePart01ObfV23HashMiichyikowrdfpagthmsx2("9s") xor HefokorosenePart01ObfVichyikowrdfpagthms23SumOdds3(intArrayOf(4, 21, 9))
/* obfuscation-batch:v24 */
private fun HefokorosenePart01ObfV24SumOdds(nums: IntArray): Int {

  var acc = 32
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 5) % 758
  }
  return acc
}

private fun HefokorosenePart01ObfV24ClampMod(n: Int, m: Int): Int {

  val span = (m % 46) + 7
  val x = n % span
  return if (x < 0) x + span else x
}
@Suppress("UNUSED_VARIABLE") private val ichyikowrdfpagthmsBootV24 = HefokorosenePart01ObfV24SumOdds(intArrayOf(44, 35, 11)) xor HefokorosenePart01ObfV24ClampMod(15, 64)


/* obfuscation-batch:v25 */
private fun ichyikowrdfpagthmsHefokorosenePart01ObfV25ShiftXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 1
  return (x xor 40) and 8962
}

private fun ichyikowrdfpagthmsHefokorosenePart01ObfV25ByteFold(s: String): Int {

  var x = 71
  for (i in s.indices) x = (x + s[i].code * 38) and 29172
  return x
}

private fun ichyikowrdfpagthmsHefokorosenePart01ObfV25HashMix(s: String): Int {

  var h = 64
  for (i in s.indices) h = (h xor (s[i].code * 11)) % 812
  return h
}

private fun ichyikowrdfpagthmsHefokorosenePart01ObfV25SumOdds(nums: IntArray): Int {

  var acc = 23
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 26) % 455
  }
  return acc
}
@Suppress("UNUSED_VARIABLE") private val ichyikowrdfpagthmsBootV25 = ichyikowrdfpagthmsHefokorosenePart01ObfV25ShiftXor(42, 3) xor ichyikowrdfpagthmsHefokorosenePart01ObfV25ByteFold("v7") xor ichyikowrdfpagthmsHefokorosenePart01ObfV25HashMix("w8") xor ichyikowrdfpagthmsHefokorosenePart01ObfV25SumOdds(intArrayOf(22, 29, 9))


/* obfuscation-batch:v26 */
private fun HefokorosenePart01ObfV26ClampMichyikowrdfpagthmsod(n: Int, m: Int): Int {

  val span = (m % 43) + 4
  val x = n % span
  return if (x < 0) x + span else x
}

private fun HefokorosenePart01ObfV26ShiftXoichyikowrdfpagthmsr(n: Int, k: Int): Int {

  val x = (n xor k) shl 6
  return (x xor 167) and 53176
}

private fun HefokorosenePart01ObfV26BichyikowrdfpagthmsyteFold(s: String): Int {

  var x = 64
  for (i in s.indices) x = (x + s[i].code * 47) and 3113
  return x
}


/* obfuscation-batch:v27 */
private fun ichyikowrdfpagthmsHefokorosenePart01ObfV27ClampMod(n: Int, m: Int): Int {
  val span = (m % 37) + 6
  val x = n % span
  return if (x < 0) x + span else x
}
private fun ichyikowrdfpagthmsHefokorosenePart01ObfV27ShiftXor(n: Int, k: Int): Int {
  val x = (n xor k) shl 5
  return (x xor 137) and 56255
}

/* obfuscation-batch:v28 */
private fun ichyikowrdfpagthmsHefokorosenePart01ObfV28ByteFold(s: String): Int {
    var x = 30
    for (i in s.indices) x = (x + s[i].code * 17) and 28977
    return x
}

/* obfuscation-batch:v29 */
private fun ichyikowrdfpagthmsHefokorosenePart01ObfV29ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 3
    return (x xor 199) and 31773
}
private fun ichyikowrdfpagthmsHefokorosenePart01ObfV29ByteFold(s: String): Int {
    var x = 13
    for (i in s.indices) x = (x + s[i].code * 3) and 23788
    return x
}
private fun ichyikowrdfpagthmsHefokorosenePart01ObfV29HashMix(s: String): Int {
    var h = 75
    for (i in s.indices) h = (h xor (s[i].code * 10)) % 384
    return h
}
private fun ichyikowrdfpagthmsHefokorosenePart01ObfV29SumOdds(nums: IntArray): Int {
    var acc = 21
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 11) % 640
    }
    return acc
}
