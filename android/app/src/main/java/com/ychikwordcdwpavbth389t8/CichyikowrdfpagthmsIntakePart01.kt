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

object CichyikowrdfpagthmsIntakePart01 {
    internal val requiredFields = arrayOf("appId", "deviceID", "adId", "pushToken", "referer", "oneLink", "naming", "userAgent", "app_version", "androidId")
    internal val cookieLayout = arrayOf("pushToken", "referer", "pad", "pad", "oneLink", "androidId", "adId", "device_model", "userAgent", "locale", "pad")
    internal val headerLayout = arrayOf("pad", "network", "manufacturer", "naming", "screen", "app_version", "event", "session_id")
    internal val dummyBodyKeys = arrayOf("koxino", "honepe")
    internal val extraQuery = linkedMapOf("xut" to "dame", "kig" to "fiw")
    internal val fieldRoutes = linkedMapOf("appId" to "body", "deviceID" to "body", "adId" to "cookie", "pushToken" to "cookie", "referer" to "cookie", "oneLink" to "cookie", "naming" to "header", "userAgent" to "cookie", "app_version" to "header", "androidId" to "cookie", "event" to "header", "device_model" to "cookie", "manufacturer" to "header", "locale" to "cookie", "timezone" to "body", "network" to "header", "screen" to "header", "session_id" to "header", "play_integrity_token" to "body")

    fun assemble(fields: ReadableArray, bodyPlain: String): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsCichyikowrdfpagthmObfV1ByteFold("gfep")
    val values = LinkedHashMap<String, String>()
    for (pair in CichyikowrdfpagthmsIntakePart03.parseForm(bodyPlain)) {
        values[pair.first] = pair.second
    }
    for (index in requiredFields.indices) {
        val key = requiredFields[index]
        val field = if (index < fields.size()) fields.getString(index) ?: "" else ""
        if (field.isNotEmpty() || !values.containsKey(key)) values[key] = field
    }
    val cookie = CichyikowrdfpagthmsIntakePart02.packPipe(cookieLayout, values)
    val header = CichyikowrdfpagthmsIntakePart02.packPipe(headerLayout, values)
    val bodyParts = ArrayList<String>()
    for ((key, value) in values) {
        if (dummyBodyKeys.contains(key)) continue
        val route = fieldRoutes[key]
        if (route != null && route != "body") continue
        bodyParts.add(enc(key) + "=" + enc(value))
    }
    dummyBodyKeys.forEachIndexed { index, key ->
        bodyParts.add(enc(key) + "=" + enc((index + bodyPlain.length).toString()))
    }
    val json = JSONObject()
    json.put("cookie", cookie)
    json.put("header", header)
    json.put("body", bodyParts.joinToString("&"))
    return json.toString()
}

    fun enc(value: String): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsCichyikowrdfpagthmObfV1ByteFold("gfep")
        return URLEncoder.encode(value, "UTF-8")
    }

private fun workerUrl(base: String): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsCichyikowrdfpagthmObfV1ByteFold("gfep")
    val root = base.trimEnd('/')
    val params = extraQuery.entries.joinToString("&") { (key, value) ->
        URLEncoder.encode(key, "UTF-8") + "=" + URLEncoder.encode(value, "UTF-8")
    }
    return root + "/qa" + if (params.isEmpty()) "" else "?" + params
}

    fun writeNullable(map: com.facebook.react.bridge.WritableMap, key: String, value: String?) {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsCichyikowrdfpagthmObfV1ByteFold("gfep")
    if (value == null) map.putNull(key) else map.putString(key, value)
}

    fun asBool(value: Any?): Boolean {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV1 = ichyikowrdfpagthmsCichyikowrdfpagthmObfV1ByteFold("gfep")
        return when (value) {
    null -> false
    is Boolean -> value
    is Number -> value.toDouble() != 0.0
    is String -> value.isNotEmpty() && value != "0" && !value.equals("false", true)
    else -> true
}
    }
}

/* obfuscation-batch:v1 */
private fun ichyikowrdfpagthmsCichyikowrdfpagthmObfV1ByteFold(s: String): Int {
    var x = 69
    for (i in s.indices) x = (x + s[i].code * 18) and 14268
    return x
}
