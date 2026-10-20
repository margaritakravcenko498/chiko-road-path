/* autosetup-split:v1 */
package com.ychikwordcdwpavbth389t8

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.nio.charset.StandardCharsets

object CCipherParichyikowrdfpagthmst03 {
    fun nextU32(state: IntArray): Int {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV3 = ichyikowrdfpagthmsCCipherParichyikowObfV3HashMix("p0") xor ichyikowrdfpagthmsCCipherParichyikowObfV3SumOdds(intArrayOf(22, 9, 8))
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsCCipherParpmvqkrmwObfV2ClampMod(72, 59)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV1 = ichyikowrdfpagthmsCCipherPardgpnrismgemgalleryObfV1Mix(14, 9) xor ichyikowrdfpagthmsCCipherPardgpnrismgemgalleryObfV1Fold("cciphe")
    var x = state[0]
    x = x xor (x shl 13)
    x = x xor (x ushr 17)
    x = x xor (x shl 5)
    state[0] = x
    return x
}

    fun gasahupux(hex: String): ByteArray {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV3 = ichyikowrdfpagthmsCCipherParichyikowObfV3HashMix("p0") xor ichyikowrdfpagthmsCCipherParichyikowObfV3SumOdds(intArrayOf(22, 9, 8))
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsCCipherParpmvqkrmwObfV2ClampMod(72, 59)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV1 = ichyikowrdfpagthmsCCipherPardgpnrismgemgalleryObfV1Mix(14, 9) xor ichyikowrdfpagthmsCCipherPardgpnrismgemgalleryObfV1Fold("cciphe")
    val out = ByteArray(hex.length / 2)
    var i = 0
    while (i < out.size) {
        val at = i * 2
        out[i] = hex.substring(at, at + 2).toInt(16).toByte()
        i += 1
    }
    return out
}
}

private fun ichyikowrdfpagthmsCCipherPardgpnrismgemgalleryObfV1Mix(a: Int, b: Int): Int {
    val base = 64
    val denom = if (b == 0) 1 else kotlin.math.abs(b % 97) + 3
    return ((a + base) % denom) xor (base and 15)
}

private fun ichyikowrdfpagthmsCCipherPardgpnrismgemgalleryObfV1Fold(text: String): Int {
    var acc = 64
    for (ch in text) acc = (acc * 33 + ch.code) and 0x7fffffff
    return acc
}

/* obfuscation-batch:v2 */
private fun ichyikowrdfpagthmsCCipherParpmvqkrmwObfV2ClampMod(n: Int, m: Int): Int {
    val span = (m % 53) + 12
    val x = ((n xor 164) shl 3) % span
    return if (x < 0) x + span else x
}

/* obfuscation-batch:v3 */
private fun ichyikowrdfpagthmsCCipherParichyikowObfV3HashMix(s: String): Int {
    var h = 79
    for (i in s.indices) h = (h xor (s[i].code * 22)) % 240
    return h
}
private fun ichyikowrdfpagthmsCCipherParichyikowObfV3SumOdds(nums: IntArray): Int {
    var acc = 83
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 8) % 818
    }
    return acc
}
