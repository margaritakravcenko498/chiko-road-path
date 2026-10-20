/* autosetup-decoy:v1 */
package com.ychikwordcdwpavbth389t8

object DichyikowrdfpagthmsVale09 {
  fun tap(seed: Int): Int {
    val tag = "DichyikowrdfpagthmsVale09"
    var x = seed xor 5322
    for (ch in tag) {
      x = (x + ch.code * 29) and 0xffff
    }
    return x xor 2320
  }
}
