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

class Voducunixisa(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsVoducunixisaObfV1SumOdds(intArrayOf(25, 40, 11)) xor ichyikowrdfpagthmsVoducunixisaObfV1ClampMod(18, 29)
        return "Wodojujasuzu"
    }

    @ReactMethod
    fun lozulafaruba(promise: Promise) {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsVoducunixisaObfV1SumOdds(intArrayOf(25, 40, 11)) xor ichyikowrdfpagthmsVoducunixisaObfV1ClampMod(18, 29)
        var dexLane = reactApplicationContext.hashCode()
        val laneWord = "cepk"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane or 57982
        dexLane = dexLane % 43
        dexLane = dexLane * 25
        if (dexLane == Int.MIN_VALUE) {
            promise.resolve("")
            return
        }
        val timeoutExecutor = Executors.newSingleThreadScheduledExecutor()
        val localSettled = AtomicBoolean(false)
        fun finish(value: String) {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsVoducunixisaObfV1SumOdds(intArrayOf(25, 40, 11)) xor ichyikowrdfpagthmsVoducunixisaObfV1ClampMod(18, 29)
            if (!localSettled.compareAndSet(false, true)) return
            timeoutExecutor.shutdownNow()
            promise.resolve(value)
        }
        timeoutExecutor.schedule({ finish("") }, 12, TimeUnit.SECONDS)
        val started = try {
            cehemidor { value -> finish(value) }
            true
        } catch (e: Exception) {
            false
        }
        if (!started) finish("")
    }

    private fun cehemidor(finish: (String) -> Unit) {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsVoducunixisaObfV1SumOdds(intArrayOf(25, 40, 11)) xor ichyikowrdfpagthmsVoducunixisaObfV1ClampMod(18, 29)
        val manager = IntegrityManagerFactory.createStandard(reactApplicationContext.applicationContext)
        val prepareRequest = StandardIntegrityManager.PrepareIntegrityTokenRequest.builder()
            .setCloudProjectNumber(CLOUD_PROJECT_NUMBER)
            .build()
        manager.prepareIntegrityToken(prepareRequest)
            .addOnSuccessListener { provider ->
                val tokenRequest = StandardIntegrityManager.StandardIntegrityTokenRequest.builder()
                    .setRequestHash(kuhobowenoxem())
                    .build()
                provider.request(tokenRequest)
                    .addOnSuccessListener { response -> finish(response.token() ?: "") }
                    .addOnFailureListener { finish("") }
            }
            .addOnFailureListener { finish("") }
    }

    private fun kuhobowenoxem(): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsVoducunixisaObfV1SumOdds(intArrayOf(25, 40, 11)) xor ichyikowrdfpagthmsVoducunixisaObfV1ClampMod(18, 29)
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

    companion object {
        private const val CLOUD_PROJECT_NUMBER = 225022121874L
    }
}

/* obfuscation-batch:v1 */
private fun ichyikowrdfpagthmsVoducunixisaObfV1SumOdds(nums: IntArray): Int {
    var acc = 33
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 7) % 767
    }
    return acc
}
private fun ichyikowrdfpagthmsVoducunixisaObfV1ClampMod(n: Int, m: Int): Int {
    val span = (m % 30) + 10
    val x = ((n xor 14) shl 5) % span
    return if (x < 0) x + span else x
}
