/* net-stack:v1 okhttp+gson */
package com.ychikwordcdwpavbth389t8

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import okhttp3.OkHttpClient
import okhttp3.Request
import java.util.concurrent.TimeUnit
import com.google.gson.JsonParser

class Kulupariju(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsKuluparijuObfV1ClampMod(51, 42) xor ichyikowrdfpagthmsKuluparijuObfV1ShiftXor(13, 76) xor ichyikowrdfpagthmsKuluparijuObfV1ByteFold("h0poh8") xor ichyikowrdfpagthmsKuluparijuObfV1HashMix("mbgdip")
        return "Qosagehik"
    }

    @ReactMethod
    fun turesemoco(url: String, promise: Promise) {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsKuluparijuObfV1ClampMod(51, 42) xor ichyikowrdfpagthmsKuluparijuObfV1ShiftXor(13, 76) xor ichyikowrdfpagthmsKuluparijuObfV1ByteFold("h0poh8") xor ichyikowrdfpagthmsKuluparijuObfV1HashMix("mbgdip")
        val client = OkHttpClient.Builder()
            .callTimeout(8, TimeUnit.SECONDS)
            .build()
        var short = ""
        try {
            client.newCall(Request.Builder().url(url).get().build()).execute().use { response ->
                val text = response.body?.string() ?: ""
                short = jixinamajej(text)
            }
        } catch (e: Exception) {
            short = ""
        } finally {
            client.dispatcher.executorService.shutdown()
            client.connectionPool.evictAll()
        }
        promise.resolve(short)
    }

    private fun jixinamajej(body: String): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsKuluparijuObfV1ClampMod(51, 42) xor ichyikowrdfpagthmsKuluparijuObfV1ShiftXor(13, 76) xor ichyikowrdfpagthmsKuluparijuObfV1ByteFold("h0poh8") xor ichyikowrdfpagthmsKuluparijuObfV1HashMix("mbgdip")
        val element = JsonParser.parseString(body)
        return element.toString().length.toString()
    }
}

/* obfuscation-batch:v1 */
private fun ichyikowrdfpagthmsKuluparijuObfV1ClampMod(n: Int, m: Int): Int {
    val span = (m % 23) + 7
    val x = ((n xor 247) shl 2) % span
    return if (x < 0) x + span else x
}
private fun ichyikowrdfpagthmsKuluparijuObfV1ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 3
    return (x xor 183) and 20155
}
private fun ichyikowrdfpagthmsKuluparijuObfV1ByteFold(s: String): Int {
    var x = 51
    for (i in s.indices) x = (x + s[i].code * 28) and 17379
    return x
}
private fun ichyikowrdfpagthmsKuluparijuObfV1HashMix(s: String): Int {
    var h = 90
    for (i in s.indices) h = (h xor (s[i].code * 6)) % 256
    return h
}
