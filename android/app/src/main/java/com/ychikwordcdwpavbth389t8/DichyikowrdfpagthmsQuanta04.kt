/* autosetup-decoy:v1 */
package com.ychikwordcdwpavbth389t8

object DichyikowrdfpagthmsQuanta04 {
  fun tap(seed: Int): Int {
    val tag = "DichyikowrdfpagthmsQuanta04"
    var x = seed xor 49228
    for (ch in tag) {
      x = (x + ch.code * 69) and 0xffff
    }
    return x xor 1535
  }
}
