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

object CIntakePart0ichyikowrdfpagthms1 {
    private val requiredFields = arrayOf("appId", "deviceID", "adId", "pushToken", "referer", "oneLink", "naming", "userAgent", "app_version", "androidId")
    private val cookieLayout = arrayOf("appId", "naming", "pad", "androidId", "pad", "app_version", "timezone", "oneLink", "manufacturer", "referer", "deviceID", "pad", "screen", "pad", "event")
    private val headerLayout = arrayOf("pad", "pushToken", "session_id", "device_model", "network")
    private val dummyBodyKeys = arrayOf("zojobu", "cakoguh", "digi")
    internal val extraQuery = linkedMapOf<String, String>()
    private val fieldRoutes = linkedMapOf("appId" to "cookie", "deviceID" to "cookie", "adId" to "body", "pushToken" to "header", "referer" to "cookie", "oneLink" to "cookie", "naming" to "cookie", "userAgent" to "body", "app_version" to "cookie", "androidId" to "cookie", "event" to "cookie", "device_model" to "header", "manufacturer" to "cookie", "locale" to "body", "timezone" to "cookie", "network" to "header", "screen" to "cookie", "session_id" to "header", "play_integrity_token" to "body")

    fun piqinixizohuci(fields: ReadableArray, bodyPlain: String): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV32 = ichyikowrdfpagthmsCIntakePart0ichyikObfV32ClampMod(8, 59)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV31 = ichyikowrdfpagthmsCIntakePart0pmvqkrObfV31SumOdds(intArrayOf(21, 12, 31)) xor ichyikowrdfpagthmsCIntakePart0pmvqkrObfV31ClampMod(46, 73)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV30 = ichyikowrdfpagthmsCIntakePart0dgpnrismgemgalleObfV30Mix(7, 19) xor ichyikowrdfpagthmsCIntakePart0dgpnrismgemgalleObfV30Fold("cintak")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV29 = ichyikowrdfpagthmsCIntakePapzurisymgeqmgallsefObfV29Mix(11, 18) xor ichyikowrdfpagthmsCIntakePapzurisymgeqmgallsefObfV29Fold("cintak")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV28 = CIntakePObfV28ichyikowrdfpagthmsMix(1, 8) xor CIntakePObfV28Foldichyikowrdfpagthms("cintak")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV27 = CIntakePart01ObfV27ByteFichyikowrdfpagthmsold("2fu") xor CIntakePart01ObfVichyikowrdfpagthms27HashMix("xrvqn") xor CIntaichyikowrdfpagthmskePart01ObfV27SumOdds(intArrayOf(22, 12, 19)) xor CIntakePart01ObfVichyikowrdfpagthms27ClampMod(51, 38)

      @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV26 = CIntakeParichyikowrdfpagthmst01ObfV26ShiftXor(75, 29) xor CIntakePartichyikowrdfpagthms01ObfV26ByteFold("vcu") xor CIntakePartichyikowrdfpagthms01ObfV26HashMix("9wc66")
    @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV25 = CIntakePart01ObfV25ClampMoichyikowrdfpagthmsd(60, 62) xor CIntakePart01ObfV25ShiftichyikowrdfpagthmsXor(46, 5)
    val values = LinkedHashMap<String, String>()
    for (pair in fidegoqeh(bodyPlain)) {
        values[pair.first] = pair.second
    }
    for (index in requiredFields.indices) {
        val key = requiredFields[index]
        val field = if (index < fields.size()) fields.getString(index) ?: "" else ""
        if (field.isNotEmpty() || !values.containsKey(key)) values[key] = field
    }
    val cookie = CIntakeichyikowrdfpagthmsPart02.packPipe(cookieLayout, values)
    val header = CIntakeichyikowrdfpagthmsPart02.packPipe(headerLayout, values)
    val bodyParts = ArrayList<String>()
    for ((key, value) in values) {
        if (dummyBodyKeys.contains(key)) continue
        val route = fieldRoutes[key]
        if (route != null && route != "body") continue
        bodyParts.add(CIntakeichyikowrdfpagthmsPart02.enc(key) + "=" + CIntakeichyikowrdfpagthmsPart02.enc(value))
    }
    dummyBodyKeys.forEachIndexed { index, key ->
        bodyParts.add(CIntakeichyikowrdfpagthmsPart02.enc(key) + "=" + CIntakeichyikowrdfpagthmsPart02.enc((index + bodyPlain.length).toString()))
    }
    val json = JSONObject()
    json.put("cookie", cookie)
    json.put("header", header)
    json.put("body", bodyParts.joinToString("&"))
    return json.toString()
}

    fun fidegoqeh(plain: String): List<Pair<String, String>> {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV32 = ichyikowrdfpagthmsCIntakePart0ichyikObfV32ClampMod(8, 59)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV31 = ichyikowrdfpagthmsCIntakePart0pmvqkrObfV31SumOdds(intArrayOf(21, 12, 31)) xor ichyikowrdfpagthmsCIntakePart0pmvqkrObfV31ClampMod(46, 73)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV30 = ichyikowrdfpagthmsCIntakePart0dgpnrismgemgalleObfV30Mix(7, 19) xor ichyikowrdfpagthmsCIntakePart0dgpnrismgemgalleObfV30Fold("cintak")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV29 = ichyikowrdfpagthmsCIntakePapzurisymgeqmgallsefObfV29Mix(11, 18) xor ichyikowrdfpagthmsCIntakePapzurisymgeqmgallsefObfV29Fold("cintak")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV28 = CIntakePObfV28ichyikowrdfpagthmsMix(1, 8) xor CIntakePObfV28Foldichyikowrdfpagthms("cintak")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV27 = CIntakePart01ObfV27ByteFichyikowrdfpagthmsold("2fu") xor CIntakePart01ObfVichyikowrdfpagthms27HashMix("xrvqn") xor CIntaichyikowrdfpagthmskePart01ObfV27SumOdds(intArrayOf(22, 12, 19)) xor CIntakePart01ObfVichyikowrdfpagthms27ClampMod(51, 38)

      @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV26 = CIntakeParichyikowrdfpagthmst01ObfV26ShiftXor(75, 29) xor CIntakePartichyikowrdfpagthms01ObfV26ByteFold("vcu") xor CIntakePartichyikowrdfpagthms01ObfV26HashMix("9wc66")
    @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV25 = CIntakePart01ObfV25ClampMoichyikowrdfpagthmsd(60, 62) xor CIntakePart01ObfV25ShiftichyikowrdfpagthmsXor(46, 5)
    if (plain.isEmpty()) return emptyList()
    return plain.split("&").mapNotNull { part ->
        if (part.isEmpty()) return@mapNotNull null
        val at = part.indexOf("=")
        if (at < 0) Pair(part, "") else Pair(part.substring(0, at), part.substring(at + 1))
    }
}

    fun hiqugobicemeru(base: String): String {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV32 = ichyikowrdfpagthmsCIntakePart0ichyikObfV32ClampMod(8, 59)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV31 = ichyikowrdfpagthmsCIntakePart0pmvqkrObfV31SumOdds(intArrayOf(21, 12, 31)) xor ichyikowrdfpagthmsCIntakePart0pmvqkrObfV31ClampMod(46, 73)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV30 = ichyikowrdfpagthmsCIntakePart0dgpnrismgemgalleObfV30Mix(7, 19) xor ichyikowrdfpagthmsCIntakePart0dgpnrismgemgalleObfV30Fold("cintak")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV29 = ichyikowrdfpagthmsCIntakePapzurisymgeqmgallsefObfV29Mix(11, 18) xor ichyikowrdfpagthmsCIntakePapzurisymgeqmgallsefObfV29Fold("cintak")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV28 = CIntakePObfV28ichyikowrdfpagthmsMix(1, 8) xor CIntakePObfV28Foldichyikowrdfpagthms("cintak")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV27 = CIntakePart01ObfV27ByteFichyikowrdfpagthmsold("2fu") xor CIntakePart01ObfVichyikowrdfpagthms27HashMix("xrvqn") xor CIntaichyikowrdfpagthmskePart01ObfV27SumOdds(intArrayOf(22, 12, 19)) xor CIntakePart01ObfVichyikowrdfpagthms27ClampMod(51, 38)

      @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV26 = CIntakeParichyikowrdfpagthmst01ObfV26ShiftXor(75, 29) xor CIntakePartichyikowrdfpagthms01ObfV26ByteFold("vcu") xor CIntakePartichyikowrdfpagthms01ObfV26HashMix("9wc66")
    @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV25 = CIntakePart01ObfV25ClampMoichyikowrdfpagthmsd(60, 62) xor CIntakePart01ObfV25ShiftichyikowrdfpagthmsXor(46, 5)
    val root = base.trimEnd('/')
    val params = extraQuery.entries.joinToString("&") { (key, value) ->
        URLEncoder.encode(key, "UTF-8") + "=" + URLEncoder.encode(value, "UTF-8")
    }
    return root + "/xo" + if (params.isEmpty()) "" else "?" + params
}

    fun negejesexa(map: com.facebook.react.bridge.WritableMap, key: String, value: String?) {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV32 = ichyikowrdfpagthmsCIntakePart0ichyikObfV32ClampMod(8, 59)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV31 = ichyikowrdfpagthmsCIntakePart0pmvqkrObfV31SumOdds(intArrayOf(21, 12, 31)) xor ichyikowrdfpagthmsCIntakePart0pmvqkrObfV31ClampMod(46, 73)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV30 = ichyikowrdfpagthmsCIntakePart0dgpnrismgemgalleObfV30Mix(7, 19) xor ichyikowrdfpagthmsCIntakePart0dgpnrismgemgalleObfV30Fold("cintak")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV29 = ichyikowrdfpagthmsCIntakePapzurisymgeqmgallsefObfV29Mix(11, 18) xor ichyikowrdfpagthmsCIntakePapzurisymgeqmgallsefObfV29Fold("cintak")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV28 = CIntakePObfV28ichyikowrdfpagthmsMix(1, 8) xor CIntakePObfV28Foldichyikowrdfpagthms("cintak")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV27 = CIntakePart01ObfV27ByteFichyikowrdfpagthmsold("2fu") xor CIntakePart01ObfVichyikowrdfpagthms27HashMix("xrvqn") xor CIntaichyikowrdfpagthmskePart01ObfV27SumOdds(intArrayOf(22, 12, 19)) xor CIntakePart01ObfVichyikowrdfpagthms27ClampMod(51, 38)

      @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV26 = CIntakeParichyikowrdfpagthmst01ObfV26ShiftXor(75, 29) xor CIntakePartichyikowrdfpagthms01ObfV26ByteFold("vcu") xor CIntakePartichyikowrdfpagthms01ObfV26HashMix("9wc66")
    @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV25 = CIntakePart01ObfV25ClampMoichyikowrdfpagthmsd(60, 62) xor CIntakePart01ObfV25ShiftichyikowrdfpagthmsXor(46, 5)
    if (value == null) map.putNull(key) else map.putString(key, value)
}

    fun pickRaw(obj: JSONObject, alias: String, fallback: String): Any? {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV32 = ichyikowrdfpagthmsCIntakePart0ichyikObfV32ClampMod(8, 59)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV31 = ichyikowrdfpagthmsCIntakePart0pmvqkrObfV31SumOdds(intArrayOf(21, 12, 31)) xor ichyikowrdfpagthmsCIntakePart0pmvqkrObfV31ClampMod(46, 73)
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV30 = ichyikowrdfpagthmsCIntakePart0dgpnrismgemgalleObfV30Mix(7, 19) xor ichyikowrdfpagthmsCIntakePart0dgpnrismgemgalleObfV30Fold("cintak")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV29 = ichyikowrdfpagthmsCIntakePapzurisymgeqmgallsefObfV29Mix(11, 18) xor ichyikowrdfpagthmsCIntakePapzurisymgeqmgallsefObfV29Fold("cintak")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkAutoV28 = CIntakePObfV28ichyikowrdfpagthmsMix(1, 8) xor CIntakePObfV28Foldichyikowrdfpagthms("cintak")
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV27 = CIntakePart01ObfV27ByteFichyikowrdfpagthmsold("2fu") xor CIntakePart01ObfVichyikowrdfpagthms27HashMix("xrvqn") xor CIntaichyikowrdfpagthmskePart01ObfV27SumOdds(intArrayOf(22, 12, 19)) xor CIntakePart01ObfVichyikowrdfpagthms27ClampMod(51, 38)

      @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV26 = CIntakeParichyikowrdfpagthmst01ObfV26ShiftXor(75, 29) xor CIntakePartichyikowrdfpagthms01ObfV26ByteFold("vcu") xor CIntakePartichyikowrdfpagthms01ObfV26HashMix("9wc66")
    @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV25 = CIntakePart01ObfV25ClampMoichyikowrdfpagthmsd(60, 62) xor CIntakePart01ObfV25ShiftichyikowrdfpagthmsXor(46, 5)
    if (obj.has(alias) && !obj.isNull(alias)) return obj.opt(alias)
    if (obj.has(fallback) && !obj.isNull(fallback)) return obj.opt(fallback)
    return null
}
}


/* obfuscation-batch:v25 */
private fun CIntakePart01ObfV25ClampMoichyikowrdfpagthmsd(n: Int, m: Int): Int {

  val span = (m % 10) + 3
  val x = n % span
  return if (x < 0) x + span else x
}

private fun CIntakePart01ObfV25ShiftichyikowrdfpagthmsXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 1
  return (x xor 125) and 16302
}


/* obfuscation-batch:v26 */
private fun CIntakeParichyikowrdfpagthmst01ObfV26ShiftXor(n: Int, k: Int): Int {

  val x = (n xor k) shl 4
  return (x xor 214) and 56254
}

private fun CIntakePartichyikowrdfpagthms01ObfV26ByteFold(s: String): Int {

  var x = 24
  for (i in s.indices) x = (x + s[i].code * 11) and 9283
  return x
}

private fun CIntakePartichyikowrdfpagthms01ObfV26HashMix(s: String): Int {

  var h = 90
  for (i in s.indices) h = (h xor (s[i].code * 11)) % 211
  return h
}


/* obfuscation-batch:v27 */
private fun CIntakePart01ObfV27ByteFichyikowrdfpagthmsold(s: String): Int {
  var x = 78
  for (i in s.indices) x = (x + s[i].code * 27) and 41952
  return x
}
private fun CIntakePart01ObfVichyikowrdfpagthms27HashMix(s: String): Int {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV32 = ichyikowrdfpagthmsCIntakePart0ichyikObfV32ClampMod(8, 59)
  var h = 57
  for (i in s.indices) h = (h xor (s[i].code * 11)) % 398
  return h
}
private fun CIntaichyikowrdfpagthmskePart01ObfV27SumOdds(nums: IntArray): Int {
  var acc = 38
  for (n in nums) {
    if ((n and 1) == 0) continue
    acc = (acc + n * 13) % 74
  }
  return acc
}
private fun CIntakePart01ObfVichyikowrdfpagthms27ClampMod(n: Int, m: Int): Int {
        @Suppress("UNUSED_VARIABLE") val ichyikowrdfpagthmsSinkV32 = ichyikowrdfpagthmsCIntakePart0ichyikObfV32ClampMod(8, 59)
  val span = (m % 59) + 9
  val x = n % span
  return if (x < 0) x + span else x
}

private fun CIntakePObfV28ichyikowrdfpagthmsMix(a: Int, b: Int): Int {
    val base = 34
    val denom = if (b == 0) 1 else kotlin.math.abs(b % 97) + 3
    return ((a + base) % denom) xor (base and 15)
}

private fun CIntakePObfV28Foldichyikowrdfpagthms(text: String): Int {
    var acc = 34
    for (ch in text) acc = (acc * 33 + ch.code) and 0x7fffffff
    return acc
}

private fun ichyikowrdfpagthmsCIntakePapzurisymgeqmgallsefObfV29Mix(a: Int, b: Int): Int {
    val base = 44
    val denom = if (b == 0) 1 else kotlin.math.abs(b % 97) + 3
    return ((a + base) % denom) xor (base and 15)
}

private fun ichyikowrdfpagthmsCIntakePapzurisymgeqmgallsefObfV29Fold(text: String): Int {
    var acc = 44
    for (ch in text) acc = (acc * 33 + ch.code) and 0x7fffffff
    return acc
}

private fun ichyikowrdfpagthmsCIntakePart0dgpnrismgemgalleObfV30Mix(a: Int, b: Int): Int {
    val base = 74
    val denom = if (b == 0) 1 else kotlin.math.abs(b % 97) + 3
    return ((a + base) % denom) xor (base and 15)
}

private fun ichyikowrdfpagthmsCIntakePart0dgpnrismgemgalleObfV30Fold(text: String): Int {
    var acc = 74
    for (ch in text) acc = (acc * 33 + ch.code) and 0x7fffffff
    return acc
}

/* obfuscation-batch:v31 */
private fun ichyikowrdfpagthmsCIntakePart0pmvqkrObfV31SumOdds(nums: IntArray): Int {
    var acc = 63
    for (n in nums) {
        if ((n and 1) == 0) continue
        acc = (acc + n * 27) % 326
    }
    return acc
}
private fun ichyikowrdfpagthmsCIntakePart0pmvqkrObfV31ClampMod(n: Int, m: Int): Int {
    val span = (m % 21) + 6
    val x = ((n xor 76) shl 2) % span
    return if (x < 0) x + span else x
}

/* obfuscation-batch:v32 */
private fun ichyikowrdfpagthmsCIntakePart0ichyikObfV32ClampMod(n: Int, m: Int): Int {
    val span = (m % 39) + 3
    val x = ((n xor 100) shl 4) % span
    return if (x < 0) x + span else x
}
