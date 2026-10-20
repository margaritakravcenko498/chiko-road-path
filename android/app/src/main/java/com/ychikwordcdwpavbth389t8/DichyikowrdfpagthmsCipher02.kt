/* autosetup-decoy:v1 */
package com.ychikwordcdwpavbth389t8

object DichyikowrdfpagthmsCipher02 {
  fun tap(seed: Int): Int {
    var x = seed + 44560
    x = x shl 1
    x = x xor 3960
    return x and 0xffff
  }
}
