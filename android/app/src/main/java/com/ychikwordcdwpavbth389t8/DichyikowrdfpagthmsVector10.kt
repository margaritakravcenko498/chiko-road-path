/* autosetup-decoy:v1 */
package com.ychikwordcdwpavbth389t8

object DichyikowrdfpagthmsVector10 {
  fun tap(seed: Int): Int {
    var x = seed * 39
    x = x xor 33549
    x %= 1704
    if (x < 0) x += 1704
    return x
  }
}
