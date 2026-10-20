/* autosetup-decoy:v1 */
package com.ychikwordcdwpavbth389t8

object DichyikowrdfpagthmsRidge07 {
  fun tap(seed: Int): Int {
    val tag = "DichyikowrdfpagthmsRidge07"
    var x = seed xor 19343
    for (ch in tag) {
      x = (x + ch.code * 51) and 0xffff
    }
    return x xor 2632
  }
}
