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

object CIntakeichyikowrdfpagthmsPart02 {
    fun packPipe(layout: Array<String>, values: Map<String, String>): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV3 = ichyikowrdfpagthmsCIntakeichyikowrdfObfV3SumOdds(intArrayOf(21, 20, 15)) xor ichyikowrdfpagthmsCIntakeichyikowrdfObfV3ClampMod(38, 49)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ClampMod(3, 58) xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ShiftXor(45, 60) xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ByteFold("dk") xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2HashMix("2f4")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV1 = CIntakePichyikowrdfpagthmsaObfV1Mix(7, 31) xor CIntakePaObfV1ichyikowrdfpagthmsFold("cdgpnr")
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

    fun enc(value: String): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV3 = ichyikowrdfpagthmsCIntakeichyikowrdfObfV3SumOdds(intArrayOf(21, 20, 15)) xor ichyikowrdfpagthmsCIntakeichyikowrdfObfV3ClampMod(38, 49)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ClampMod(3, 58) xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ShiftXor(45, 60) xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ByteFold("dk") xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2HashMix("2f4")
        return URLEncoder.encode(value, "UTF-8")
    }

private fun workerUrl(base: String): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV3 = ichyikowrdfpagthmsCIntakeichyikowrdfObfV3SumOdds(intArrayOf(21, 20, 15)) xor ichyikowrdfpagthmsCIntakeichyikowrdfObfV3ClampMod(38, 49)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ClampMod(3, 58) xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ShiftXor(45, 60) xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ByteFold("dk") xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2HashMix("2f4")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV1 = CIntakePichyikowrdfpagthmsaObfV1Mix(7, 31) xor CIntakePaObfV1ichyikowrdfpagthmsFold("cdgpnr")
    val root = base.trimEnd('/')
    val params = CIntakePart0ichyikowrdfpagthms1.extraQuery.entries.joinToString("&") { (key, value) ->
        URLEncoder.encode(key, "UTF-8") + "=" + URLEncoder.encode(value, "UTF-8")
    }
    return root + "/bonag" + if (params.isEmpty()) "" else "?" + params
}
    

    fun mapResponse(obj: JSONObject): com.facebook.react.bridge.WritableMap {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV3 = ichyikowrdfpagthmsCIntakeichyikowrdfObfV3SumOdds(intArrayOf(21, 20, 15)) xor ichyikowrdfpagthmsCIntakeichyikowrdfObfV3ClampMod(38, 49)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ClampMod(3, 58) xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ShiftXor(45, 60) xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ByteFold("dk") xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2HashMix("2f4")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV1 = CIntakePichyikowrdfpagthmsaObfV1Mix(7, 31) xor CIntakePaObfV1ichyikowrdfpagthmsFold("cdgpnr")
    val map = Arguments.createMap()
    CIntakePart0ichyikowrdfpagthms1.negejesexa(map, "redirectUrl", pick(obj, "to", "redirectUrl"))
    CIntakePart0ichyikowrdfpagthms1.negejesexa(map, "redirectUrlInitial", pick(obj, "rema", "redirectUrlInitial"))
    CIntakePart0ichyikowrdfpagthms1.negejesexa(map, "error", pick(obj, "kaw", "error"))
    map.putBoolean("blockUser", asBool(CIntakePart0ichyikowrdfpagthms1.pickRaw(obj, "ti", "blockUser")))
    return map
}

    fun pick(obj: JSONObject, alias: String, fallback: String): String? {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV3 = ichyikowrdfpagthmsCIntakeichyikowrdfObfV3SumOdds(intArrayOf(21, 20, 15)) xor ichyikowrdfpagthmsCIntakeichyikowrdfObfV3ClampMod(38, 49)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ClampMod(3, 58) xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ShiftXor(45, 60) xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ByteFold("dk") xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2HashMix("2f4")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV1 = CIntakePichyikowrdfpagthmsaObfV1Mix(7, 31) xor CIntakePaObfV1ichyikowrdfpagthmsFold("cdgpnr")
    val raw = CIntakePart0ichyikowrdfpagthms1.pickRaw(obj, alias, fallback) ?: return null
    val text = raw.toString()
    return if (text.isEmpty()) null else text
}

    fun asBool(value: Any?): Boolean {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV3 = ichyikowrdfpagthmsCIntakeichyikowrdfObfV3SumOdds(intArrayOf(21, 20, 15)) xor ichyikowrdfpagthmsCIntakeichyikowrdfObfV3ClampMod(38, 49)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV2 = ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ClampMod(3, 58) xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ShiftXor(45, 60) xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ByteFold("dk") xor ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2HashMix("2f4")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV1 = CIntakePichyikowrdfpagthmsaObfV1Mix(7, 31) xor CIntakePaObfV1ichyikowrdfpagthmsFold("cdgpnr")
        return when (value) {
    null -> false
    is Boolean -> value
    is Number -> value.toDouble() != 0.0
    is String -> value.isNotEmpty() && value != "0" && !value.equals("false", true)
    else -> true
}
    }
}

private fun CIntakePichyikowrdfpagthmsaObfV1Mix(a: Int, b: Int): Int {
    val base = 57
    val denom = if (b == 0) 1 else kotlin.math.abs(b % 97) + 3
    return ((a + base) % denom) xor (base and 15)
}

private fun CIntakePaObfV1ichyikowrdfpagthmsFold(text: String): Int {
    var acc = 57
    for (ch in text) acc = (acc * 33 + ch.code) and 0x7fffffff
    return acc
}

/* obfuscation-batch:v2 */
private fun ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ClampMod(n: Int, m: Int): Int {
    val span = (m % 59) + 7
    val x = ((n xor 181) shl 2) % span
    return if (x < 0) x + span else x
}
private fun ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ShiftXor(n: Int, k: Int): Int {
    val x = (n xor k) shl 6
    return (x xor 85) and 46001
}
private fun ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2ByteFold(s: String): Int {
    var x = 7
    for (i in s.indices) x = (x + s[i].code * 5) and 26818
    return x
}
private fun ichyikowrdfpagthmsCIntakepmvqkrmwismObfV2HashMix(s: String): Int {
    var h = 46
    for (i in s.indices) h = (h xor (s[i].code * 30)) % 380
    return h
}

/* obfuscation-batch:v3 */
private fun ichyikowrdfpagthmsCIntakeichyikowrdfObfV3SumOdds(nums: IntArray): Int {
    var acc = 44
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 8) % 878
    }
    return acc
}
private fun ichyikowrdfpagthmsCIntakeichyikowrdfObfV3ClampMod(n: Int, m: Int): Int {
    val span = (m % 34) + 12
    val x = ((n xor 10) shl 6) % span
    return if (x < 0) x + span else x
}
