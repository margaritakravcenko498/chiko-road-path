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

object RadiqesotijijPart01 {
    fun suwobupobok(): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsRadiqesotijijPart0ObfV2HashMix("ni") xor ichyikowrdfpagthmsRadiqesotijijPart0ObfV2SumOdds(intArrayOf(20, 7, 14)) xor ichyikowrdfpagthmsRadiqesotijijPart0ObfV2ClampMod(17, 16) xor ichyikowrdfpagthmsRadiqesotijijPart0ObfV2ShiftXor(43, 2)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsRadiqesotijijPart0ObfV1HashMix("il") xor ichyikowrdfpagthmsRadiqesotijijPart0ObfV1SumOdds(intArrayOf(39, 14, 25)) xor ichyikowrdfpagthmsRadiqesotijijPart0ObfV1ClampMod(40, 59)
    val alphabet = "0123456789abcdef"
    val rng = java.security.SecureRandom()
    val chars = CharArray(32)
    for (i in chars.indices) {
        chars[i] = alphabet[rng.nextInt(alphabet.length)]
    }
    return String(chars)
}
}

/* obfuscation-batch:v1 */
private fun ichyikowrdfpagthmsRadiqesotijijPart0ObfV1HashMix(s: String): Int {
    var h = 72
    for (i in s.indices) h = (h xor (s[i].code * 18)) % 544
    return h
}
private fun ichyikowrdfpagthmsRadiqesotijijPart0ObfV1SumOdds(nums: IntArray): Int {
    var acc = 88
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 5) % 292
    }
    return acc
}
private fun ichyikowrdfpagthmsRadiqesotijijPart0ObfV1ClampMod(n: Int, m: Int): Int {
    val span = (m % 24) + 5
    val x = ((n xor 18) shl 5) % span
    return if (x < 0) x + span else x
}

/* obfuscation-batch:v2 */
private fun ichyikowrdfpagthmsRadiqesotijijPart0ObfV2HashMix(s: String): Int {
    var h = 27
    for (i in s.indices) h = (h xor (s[i].code * 25)) % 146
    return h
}
private fun ichyikowrdfpagthmsRadiqesotijijPart0ObfV2SumOdds(nums: IntArray): Int {
    var acc = 79
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 19) % 517
    }
    return acc
}
private fun ichyikowrdfpagthmsRadiqesotijijPart0ObfV2ClampMod(n: Int, m: Int): Int {
    val span = (m % 60) + 3
    val x = ((n xor 7) shl 4) % span
    return if (x < 0) x + span else x
}
private fun ichyikowrdfpagthmsRadiqesotijijPart0ObfV2ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 3
    return (x xor 93) and 15286
}
