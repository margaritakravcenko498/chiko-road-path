package com.ychikwordcdwpavbth389t8

import android.content.Context
import android.webkit.WebSettings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class Raxoxowetok(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsRaxoxowetokObfV1ShiftXor(30, 41) xor ichyikowrdfpagthmsRaxoxowetokObfV1ByteFold("gp2b") xor ichyikowrdfpagthmsRaxoxowetokObfV1HashMix("d4pm")
        return "Hitohesoxar"
    }

    @ReactMethod
    fun wiqomeciterijo(promise: Promise) {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsRaxoxowetokObfV1ShiftXor(30, 41) xor ichyikowrdfpagthmsRaxoxowetokObfV1ByteFold("gp2b") xor ichyikowrdfpagthmsRaxoxowetokObfV1HashMix("d4pm")
        var dexLane = reactApplicationContext.hashCode()
        dexLane = dexLane xor 10151
        val laneNums = intArrayOf(30, 107, 118)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane shl 1
        dexLane = dexLane or 7289
        if (dexLane == Int.MIN_VALUE) {
            promise.resolve("")
            return
        }
        val dexValue = try {
            vahufepivuz(reactApplicationContext)
        } catch (e: Exception) {
            ""
        }
        promise.resolve(dexValue)
    }

    private fun vahufepivuz(context: Context): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsRaxoxowetokObfV1ShiftXor(30, 41) xor ichyikowrdfpagthmsRaxoxowetokObfV1ByteFold("gp2b") xor ichyikowrdfpagthmsRaxoxowetokObfV1HashMix("d4pm")
        val loaded = WebSettings.getDefaultUserAgent(context)
        if (loaded == null) {
            return ""
        }
        return loaded
    }
}

/* obfuscation-batch:v1 */
private fun ichyikowrdfpagthmsRaxoxowetokObfV1ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 3
    return (x xor 132) and 3864
}
private fun ichyikowrdfpagthmsRaxoxowetokObfV1ByteFold(s: String): Int {
    var x = 4
    for (i in s.indices) x = (x + s[i].code * 32) and 31398
    return x
}
private fun ichyikowrdfpagthmsRaxoxowetokObfV1HashMix(s: String): Int {
    var h = 23
    for (i in s.indices) h = (h xor (s[i].code * 16)) % 156
    return h
}
