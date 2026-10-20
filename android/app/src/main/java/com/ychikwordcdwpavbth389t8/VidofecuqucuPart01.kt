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

object VidofecuqucuPart01 {
    fun quvilituzuhufe(): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsVidofecuqucuPart01ObfV2ClampMod(51, 74) xor ichyikowrdfpagthmsVidofecuqucuPart01ObfV2ShiftXor(77, 44) xor ichyikowrdfpagthmsVidofecuqucuPart01ObfV2ByteFold("b47") xor ichyikowrdfpagthmsVidofecuqucuPart01ObfV2HashMix("905o1")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsVidofecuqucuPart01ObfV1HashMix("a7i") xor ichyikowrdfpagthmsVidofecuqucuPart01ObfV1SumOdds(intArrayOf(14, 25, 40)) xor ichyikowrdfpagthmsVidofecuqucuPart01ObfV1ClampMod(19, 26)
    val bytes = ByteArray(16)
    java.security.SecureRandom().nextBytes(bytes)
    val alphabet = "0123456789abcdef"
    val out = StringBuilder(bytes.size * 2)
    for (byte in bytes) {
        val v = byte.toInt() and 0xff
        out.append(alphabet[v ushr 4])
        out.append(alphabet[v and 0x0f])
    }
    return out.toString()
}
}

/* obfuscation-batch:v1 */
private fun ichyikowrdfpagthmsVidofecuqucuPart01ObfV1HashMix(s: String): Int {
    var h = 79
    for (i in s.indices) h = (h xor (s[i].code * 8)) % 235
    return h
}
private fun ichyikowrdfpagthmsVidofecuqucuPart01ObfV1SumOdds(nums: IntArray): Int {
    var acc = 3
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 30) % 458
    }
    return acc
}
private fun ichyikowrdfpagthmsVidofecuqucuPart01ObfV1ClampMod(n: Int, m: Int): Int {
    val span = (m % 46) + 5
    val x = ((n xor 35) shl 6) % span
    return if (x < 0) x + span else x
}

/* obfuscation-batch:v2 */
private fun ichyikowrdfpagthmsVidofecuqucuPart01ObfV2ClampMod(n: Int, m: Int): Int {
    val span = (m % 56) + 7
    val x = ((n xor 93) shl 3) % span
    return if (x < 0) x + span else x
}
private fun ichyikowrdfpagthmsVidofecuqucuPart01ObfV2ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 6
    return (x xor 81) and 46901
}
private fun ichyikowrdfpagthmsVidofecuqucuPart01ObfV2ByteFold(s: String): Int {
    var x = 46
    for (i in s.indices) x = (x + s[i].code * 28) and 6954
    return x
}
private fun ichyikowrdfpagthmsVidofecuqucuPart01ObfV2HashMix(s: String): Int {
    var h = 28
    for (i in s.indices) h = (h xor (s[i].code * 4)) % 467
    return h
}
