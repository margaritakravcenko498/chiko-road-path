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

object CichyikowrdfpagthmsIntakePart03 {
    fun parseForm(plain: String): List<Pair<String, String>> {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsCichyikowrdfpagthmObfV1ByteFold("gfep")
    if (plain.isEmpty()) return emptyList()
    return plain.split("&").mapNotNull { part ->
        if (part.isEmpty()) return@mapNotNull null
        val at = part.indexOf("=")
        if (at < 0) Pair(part, "") else Pair(part.substring(0, at), part.substring(at + 1))
    }
}

    fun mapResponse(obj: JSONObject): com.facebook.react.bridge.WritableMap {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsCichyikowrdfpagthmObfV1ByteFold("gfep")
    val map = Arguments.createMap()
    CichyikowrdfpagthmsIntakePart01.writeNullable(map, "redirectUrl", CichyikowrdfpagthmsIntakePart02.pick(obj, "bo", "redirectUrl"))
    CichyikowrdfpagthmsIntakePart01.writeNullable(map, "redirectUrlInitial", CichyikowrdfpagthmsIntakePart02.pick(obj, "cur", "redirectUrlInitial"))
    CichyikowrdfpagthmsIntakePart01.writeNullable(map, "error", CichyikowrdfpagthmsIntakePart02.pick(obj, "nuq", "error"))
    map.putBoolean("blockUser", CichyikowrdfpagthmsIntakePart01.asBool(pickRaw(obj, "bop", "blockUser")))
    return map
}

    fun pickRaw(obj: JSONObject, alias: String, fallback: String): Any? {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsCichyikowrdfpagthmObfV1ByteFold("gfep")
    if (obj.has(alias) && !obj.isNull(alias)) return obj.opt(alias)
    if (obj.has(fallback) && !obj.isNull(fallback)) return obj.opt(fallback)
    return null
}
}

/* obfuscation-batch:v1 */
private fun ichyikowrdfpagthmsCichyikowrdfpagthmObfV1ByteFold(s: String): Int {
    var x = 69
    for (i in s.indices) x = (x + s[i].code * 18) and 14268
    return x
}
