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
import com.google.gson.JsonParser

object SoxojujotifoqPart01 {
    fun gevezumekemur(body: String): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsSoxojujotifoqPart0ObfV2ClampMod(29, 28) xor ichyikowrdfpagthmsSoxojujotifoqPart0ObfV2ShiftXor(71, 62)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsSoxojujotifoqPart0ObfV1ClampMod(32, 67)
    val element = JsonParser.parseString(body)
    return element.toString().length.toString()
}
}

/* obfuscation-batch:v1 */
private fun ichyikowrdfpagthmsSoxojujotifoqPart0ObfV1ClampMod(n: Int, m: Int): Int {
    val span = (m % 25) + 5
    val x = ((n xor 58) shl 1) % span
    return if (x < 0) x + span else x
}

/* obfuscation-batch:v2 */
private fun ichyikowrdfpagthmsSoxojujotifoqPart0ObfV2ClampMod(n: Int, m: Int): Int {
    val span = (m % 30) + 10
    val x = ((n xor 57) shl 4) % span
    return if (x < 0) x + span else x
}
private fun ichyikowrdfpagthmsSoxojujotifoqPart0ObfV2ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 2
    return (x xor 191) and 43670
}
