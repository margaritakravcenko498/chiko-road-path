/* autosetup-split:v1 */
package com.ychikwordcdwpavbth389t8

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

object CichyikowrdfpagthmsIntakePart02 {
    fun packPipe(layout: Array<String>, values: Map<String, String>): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsCichyikowrdfpagthmObfV2SumOdds(intArrayOf(9, 16, 35)) xor ichyikowrdfpagthmsCichyikowrdfpagthmObfV2ClampMod(58, 21)
    if (layout.isEmpty()) return ""
    val out = ArrayList<String>(layout.size)
    var pad = 0
    for (slot in layout) {
        if (slot == "pad") {
            out.add("p" + pad.toString(16) + values.size)
            pad += 1
        } else {
            out.add(values[slot] ?: "")
        }
    }
    return out.joinToString("|")
}

    fun workerUrl(base: String): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsCichyikowrdfpagthmObfV2SumOdds(intArrayOf(9, 16, 35)) xor ichyikowrdfpagthmsCichyikowrdfpagthmObfV2ClampMod(58, 21)
    val root = base.trimEnd('/')
    val params = CichyikowrdfpagthmsIntakePart01.extraQuery.entries.joinToString("&") { (key, value) ->
        URLEncoder.encode(key, "UTF-8") + "=" + URLEncoder.encode(value, "UTF-8")
    }
    return root + "/qa" + if (params.isEmpty()) "" else "?" + params
}

    fun pick(obj: JSONObject, alias: String, fallback: String): String? {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsCichyikowrdfpagthmObfV2SumOdds(intArrayOf(9, 16, 35)) xor ichyikowrdfpagthmsCichyikowrdfpagthmObfV2ClampMod(58, 21)
    val raw = CichyikowrdfpagthmsIntakePart03.pickRaw(obj, alias, fallback) ?: return null
    val text = raw.toString()
    return if (text.isEmpty()) null else text
}
}

/* obfuscation-batch:v2 */
private fun ichyikowrdfpagthmsCichyikowrdfpagthmObfV2SumOdds(nums: IntArray): Int {
    var acc = 88
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 11) % 213
    }
    return acc
}
private fun ichyikowrdfpagthmsCichyikowrdfpagthmObfV2ClampMod(n: Int, m: Int): Int {
    val span = (m % 29) + 3
    val x = ((n xor 172) shl 1) % span
    return if (x < 0) x + span else x
}
