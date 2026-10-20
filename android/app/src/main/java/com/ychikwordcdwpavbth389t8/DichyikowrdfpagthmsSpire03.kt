/* autosetup-decoy:v1 */
package com.ychikwordcdwpavbth389t8

object DichyikowrdfpagthmsSpire03 {
  fun tap(seed: Int): Int {
    var x = seed
    x = x xor 6115
    x = (x ushr 5) xor 2010
    x = (x * 9) and 0xffff
    return x
  }
}
