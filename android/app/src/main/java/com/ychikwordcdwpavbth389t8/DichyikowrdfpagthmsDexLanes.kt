/* dex-lanes:v1 */
package com.ychikwordcdwpavbth389t8

object DichyikowrdfpagthmsDexLanes {
    fun lane00(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane + 14962
        dexLane = dexLane.inv()
        dexLane = dexLane * 24
        dexLane = dexLane or 31090
        val laneWord = "hnjj"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        return dexLane
    }

    fun lane01(seed: Int): Int {
        var dexLane = seed
        val laneWord = "fjmk"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane and 6620
        dexLane = dexLane ushr 10
        dexLane = dexLane % 19
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        return dexLane
    }

    fun lane02(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane % 25
        dexLane = dexLane * 29
        dexLane = dexLane + 8612
        dexLane = dexLane or 23126
        val laneWord = "eklj"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        return dexLane
    }

    fun lane03(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane % 60
        dexLane = dexLane xor 25648
        if ((dexLane and 17) == 0) {
            dexLane = dexLane + 2451
        }
        dexLane = dexLane + 59034
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        return dexLane
    }

    fun lane04(seed: Int): Int {
        var dexLane = seed
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 3819
            1 -> dexLane + 379
            else -> dexLane + 445
        }
        if ((dexLane and 30) == 0) {
            dexLane = dexLane + 3748
        }
        dexLane = dexLane or 34863
        val laneNums = intArrayOf(156, 44, 6)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane % 53
        return dexLane
    }

    fun lane05(seed: Int): Int {
        var dexLane = seed
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 910
            1 -> dexLane + 886
            else -> dexLane + 242
        }
        dexLane = dexLane * 11
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane xor 55414
        dexLane = dexLane shl 2
        return dexLane
    }

    fun lane06(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane xor 35098
        dexLane = dexLane * 21
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane ushr 10
        dexLane = dexLane or 21827
        return dexLane
    }

    fun lane07(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane or 15228
        val laneNums = intArrayOf(142, 161, 188)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane xor 46463
        dexLane = dexLane + 34636
        dexLane = dexLane * 34
        return dexLane
    }

    fun lane08(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane or 14785
        dexLane = dexLane xor 33766
        dexLane = dexLane ushr 10
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 1173
            1 -> dexLane + 3409
            else -> dexLane + 622
        }
        val laneWord = "kfph"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        return dexLane
    }

    fun lane09(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane ushr 10
        dexLane = dexLane shl 6
        dexLane = dexLane or 59284
        dexLane = dexLane xor 38786
        dexLane = dexLane and 12881
        return dexLane
    }

    fun lane10(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane shl 12
        dexLane = dexLane.inv()
        dexLane = dexLane * 18
        dexLane = dexLane xor 14527
        val laneNums = intArrayOf(4, 195, 18)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        return dexLane
    }

    fun lane11(seed: Int): Int {
        var dexLane = seed
        if ((dexLane and 24) == 0) {
            dexLane = dexLane + 2822
        }
        dexLane = dexLane and 23600
        val laneNums = intArrayOf(159, 24, 100)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        val laneWord = "dnhh"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane ushr 9
        return dexLane
    }

    fun lane12(seed: Int): Int {
        var dexLane = seed
        if ((dexLane and 24) == 0) {
            dexLane = dexLane + 1331
        }
        dexLane = dexLane * 35
        dexLane = dexLane shl 10
        dexLane = dexLane ushr 8
        val laneNums = intArrayOf(201, 177, 53)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        return dexLane
    }

    fun lane13(seed: Int): Int {
        var dexLane = seed
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 2080
            1 -> dexLane + 1612
            else -> dexLane + 1898
        }
        dexLane = dexLane + 29460
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane or 2781
        val laneNums = intArrayOf(177, 110, 172)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        return dexLane
    }

    fun lane14(seed: Int): Int {
        var dexLane = seed
        if ((dexLane and 26) == 0) {
            dexLane = dexLane + 2481
        }
        val laneNums = intArrayOf(122, 181, 200)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        val laneWord = "eeii"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane * 32
        dexLane = dexLane shl 10
        return dexLane
    }

    fun lane15(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane ushr 6
        dexLane = dexLane or 34969
        val laneWord = "pmhl"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane shl 6
        dexLane = dexLane * 3
        return dexLane
    }

    fun lane16(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane or 17303
        if ((dexLane and 10) == 0) {
            dexLane = dexLane + 1152
        }
        val laneNums = intArrayOf(153, 192, 93)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane shl 5
        dexLane = dexLane % 18
        return dexLane
    }

    fun lane17(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane.inv()
        val laneWord = "dfbg"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane % 20
        dexLane = dexLane shl 8
        dexLane = dexLane * 11
        return dexLane
    }

    fun lane18(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane * 33
        val laneWord = "lmdf"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane ushr 5
        dexLane = dexLane or 17854
        dexLane = dexLane xor 52602
        return dexLane
    }

    fun lane19(seed: Int): Int {
        var dexLane = seed
        if ((dexLane and 28) == 0) {
            dexLane = dexLane + 2170
        }
        dexLane = dexLane.inv()
        dexLane = dexLane % 25
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane xor 35165
        return dexLane
    }

    fun lane20(seed: Int): Int {
        var dexLane = seed
        val laneNums = intArrayOf(39, 132, 64)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane shl 6
        dexLane = dexLane * 12
        dexLane = dexLane.inv()
        dexLane = dexLane ushr 1
        return dexLane
    }

    fun lane21(seed: Int): Int {
        var dexLane = seed
        val laneWord = "lfio"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane * 6
        dexLane = dexLane or 43585
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        if ((dexLane and 18) == 0) {
            dexLane = dexLane + 1264
        }
        return dexLane
    }

    fun lane22(seed: Int): Int {
        var dexLane = seed
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        val laneWord = "gibk"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane and 16456
        val laneNums = intArrayOf(73, 131, 141)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 3490
            1 -> dexLane + 2065
            else -> dexLane + 1188
        }
        return dexLane
    }

    fun lane23(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane shl 3
        val laneWord = "jocg"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane xor 51943
        dexLane = dexLane ushr 7
        dexLane = dexLane.inv()
        return dexLane
    }

    fun lane24(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane ushr 10
        dexLane = dexLane + 33652
        if ((dexLane and 26) == 0) {
            dexLane = dexLane + 401
        }
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 335
            1 -> dexLane + 641
            else -> dexLane + 1311
        }
        val laneWord = "ideh"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        return dexLane
    }

    fun lane25(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane % 47
        val laneNums = intArrayOf(171, 44, 9)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane.inv()
        dexLane = dexLane * 15
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        return dexLane
    }

    fun lane26(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane + 21482
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 2554
            1 -> dexLane + 2968
            else -> dexLane + 1496
        }
        dexLane = dexLane or 24828
        dexLane = dexLane.inv()
        dexLane = dexLane and 26072
        return dexLane
    }

    fun lane27(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane ushr 9
        val laneWord = "jkip"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        val laneNums = intArrayOf(143, 36, 168)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane.inv()
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        return dexLane
    }

    fun lane28(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane or 12102
        val laneWord = "bohb"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane ushr 12
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        val laneNums = intArrayOf(41, 166, 18)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        return dexLane
    }

    fun lane29(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane ushr 10
        dexLane = dexLane * 36
        val laneNums = intArrayOf(43, 82, 154)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 2051
            1 -> dexLane + 3663
            else -> dexLane + 3478
        }
        dexLane = dexLane or 5605
        return dexLane
    }

    fun lane30(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane xor 25182
        dexLane = dexLane or 17224
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane and 17415
        dexLane = dexLane.inv()
        return dexLane
    }

    fun lane31(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane.inv()
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 1742
            1 -> dexLane + 304
            else -> dexLane + 2634
        }
        if ((dexLane and 25) == 0) {
            dexLane = dexLane + 3991
        }
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane or 34269
        return dexLane
    }

    fun lane32(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane shl 12
        val laneNums = intArrayOf(64, 76, 176)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane.inv()
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane ushr 2
        return dexLane
    }

    fun lane33(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane or 11144
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 2718
            1 -> dexLane + 3700
            else -> dexLane + 1541
        }
        dexLane = dexLane * 7
        val laneNums = intArrayOf(82, 93, 32)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane xor 40841
        return dexLane
    }

    fun lane34(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane * 23
        dexLane = dexLane or 50591
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 1527
            1 -> dexLane + 1401
            else -> dexLane + 2651
        }
        dexLane = dexLane ushr 3
        val laneWord = "adon"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        return dexLane
    }

    fun lane35(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane ushr 7
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 2024
            1 -> dexLane + 244
            else -> dexLane + 3921
        }
        val laneNums = intArrayOf(191, 49, 117)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane or 47963
        dexLane = dexLane % 18
        return dexLane
    }

    fun lane36(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane % 47
        val laneWord = "oice"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane * 27
        dexLane = dexLane or 56496
        dexLane = dexLane and 14179
        return dexLane
    }

    fun lane37(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane ushr 5
        dexLane = dexLane shl 8
        dexLane = dexLane and 1642
        dexLane = dexLane * 27
        if ((dexLane and 24) == 0) {
            dexLane = dexLane + 2263
        }
        return dexLane
    }

    fun lane38(seed: Int): Int {
        var dexLane = seed
        val laneWord = "lgei"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 2226
            1 -> dexLane + 1217
            else -> dexLane + 3876
        }
        dexLane = dexLane % 50
        dexLane = dexLane.inv()
        dexLane = dexLane shl 2
        return dexLane
    }

    fun lane39(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane * 16
        dexLane = dexLane ushr 9
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane xor 45659
        dexLane = dexLane and 12952
        return dexLane
    }

    fun lane40(seed: Int): Int {
        var dexLane = seed
        if ((dexLane and 24) == 0) {
            dexLane = dexLane + 3518
        }
        dexLane = dexLane xor 7364
        dexLane = dexLane ushr 9
        dexLane = dexLane * 16
        dexLane = dexLane or 53269
        return dexLane
    }

    fun lane41(seed: Int): Int {
        var dexLane = seed
        val laneWord = "bmjd"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane * 20
        dexLane = dexLane + 41332
        dexLane = dexLane and 1693
        dexLane = dexLane.inv()
        return dexLane
    }

    fun lane42(seed: Int): Int {
        var dexLane = seed
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane.inv()
        if ((dexLane and 14) == 0) {
            dexLane = dexLane + 2917
        }
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 3059
            1 -> dexLane + 1175
            else -> dexLane + 1617
        }
        dexLane = dexLane ushr 1
        return dexLane
    }

    fun lane43(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane % 67
        dexLane = dexLane and 6511
        dexLane = dexLane or 47112
        val laneWord = "oiof"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane ushr 2
        return dexLane
    }

    fun lane44(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane and 24910
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 2924
            1 -> dexLane + 905
            else -> dexLane + 2457
        }
        dexLane = dexLane or 20854
        dexLane = dexLane.inv()
        if ((dexLane and 20) == 0) {
            dexLane = dexLane + 910
        }
        return dexLane
    }

    fun lane45(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane * 9
        dexLane = dexLane shl 9
        val laneNums = intArrayOf(32, 47, 51)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        val laneWord = "moom"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 2824
            1 -> dexLane + 1085
            else -> dexLane + 3076
        }
        return dexLane
    }

    fun lane46(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane ushr 8
        val laneNums = intArrayOf(130, 17, 59)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        val laneWord = "acpm"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane + 32007
        if ((dexLane and 25) == 0) {
            dexLane = dexLane + 848
        }
        return dexLane
    }

    fun lane47(seed: Int): Int {
        var dexLane = seed
        val laneNums = intArrayOf(56, 119, 159)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane.inv()
        dexLane = dexLane and 6831
        dexLane = dexLane + 55628
        dexLane = dexLane or 46017
        return dexLane
    }

    fun lane48(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane % 76
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 3144
            1 -> dexLane + 2884
            else -> dexLane + 275
        }
        dexLane = dexLane.inv()
        val laneNums = intArrayOf(183, 118, 124)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane or 26329
        return dexLane
    }

    fun lane49(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane + 3874
        dexLane = dexLane % 35
        dexLane = dexLane.inv()
        dexLane = dexLane and 22569
        dexLane = dexLane * 34
        return dexLane
    }

    fun lane50(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane.inv()
        dexLane = dexLane shl 6
        if ((dexLane and 7) == 0) {
            dexLane = dexLane + 641
        }
        dexLane = dexLane and 6654
        dexLane = dexLane or 20997
        return dexLane
    }

    fun lane51(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane.inv()
        dexLane = dexLane % 57
        dexLane = dexLane + 23822
        dexLane = dexLane ushr 9
        dexLane = dexLane * 24
        return dexLane
    }

    fun lane52(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane and 27650
        dexLane = dexLane * 5
        dexLane = dexLane.inv()
        dexLane = dexLane % 37
        dexLane = dexLane xor 41336
        return dexLane
    }

    fun lane53(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane or 22261
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane shl 9
        dexLane = dexLane ushr 3
        val laneNums = intArrayOf(69, 98, 36)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        return dexLane
    }

    fun lane54(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane shl 8
        dexLane = dexLane % 76
        dexLane = dexLane * 30
        dexLane = dexLane or 6331
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 1368
            1 -> dexLane + 1243
            else -> dexLane + 1710
        }
        return dexLane
    }

    fun lane55(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane and 7545
        dexLane = dexLane shl 2
        val laneWord = "ohpk"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane ushr 7
        dexLane = dexLane + 17125
        return dexLane
    }

    fun lane56(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane or 35726
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 684
            1 -> dexLane + 2858
            else -> dexLane + 1337
        }
        dexLane = dexLane % 35
        dexLane = dexLane xor 5086
        if ((dexLane and 5) == 0) {
            dexLane = dexLane + 3478
        }
        return dexLane
    }

    fun lane57(seed: Int): Int {
        var dexLane = seed
        if ((dexLane and 12) == 0) {
            dexLane = dexLane + 3477
        }
        dexLane = dexLane.inv()
        dexLane = dexLane or 43753
        val laneNums = intArrayOf(168, 110, 170)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane + 20050
        return dexLane
    }

    fun lane58(seed: Int): Int {
        var dexLane = seed
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 1139
            1 -> dexLane + 254
            else -> dexLane + 805
        }
        dexLane = dexLane shl 9
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane or 15943
        val laneWord = "ebdd"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        return dexLane
    }

    fun lane59(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane shl 6
        val laneNums = intArrayOf(90, 189, 65)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane xor 29719
        dexLane = dexLane ushr 5
        dexLane = dexLane.inv()
        return dexLane
    }

    fun lane60(seed: Int): Int {
        var dexLane = seed
        val laneNums = intArrayOf(55, 47, 169)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane shl 4
        dexLane = dexLane and 14466
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 2431
            1 -> dexLane + 3567
            else -> dexLane + 716
        }
        return dexLane
    }

    fun lane61(seed: Int): Int {
        var dexLane = seed
        val laneWord = "lecc"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        val laneNums = intArrayOf(6, 197, 24)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane + 40960
        dexLane = dexLane ushr 7
        if ((dexLane and 25) == 0) {
            dexLane = dexLane + 3160
        }
        return dexLane
    }

    fun lane62(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane or 55116
        val laneWord = "pnce"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane and 7149
        dexLane = dexLane.inv()
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 1433
            1 -> dexLane + 2574
            else -> dexLane + 3478
        }
        return dexLane
    }

    fun lane63(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane % 7
        if ((dexLane and 15) == 0) {
            dexLane = dexLane + 994
        }
        dexLane = dexLane xor 36092
        dexLane = dexLane and 950
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 3389
            1 -> dexLane + 413
            else -> dexLane + 3743
        }
        return dexLane
    }

    fun lane64(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane or 17650
        dexLane = dexLane ushr 10
        dexLane = dexLane + 1187
        dexLane = dexLane and 5395
        dexLane = dexLane * 17
        return dexLane
    }

    fun lane65(seed: Int): Int {
        var dexLane = seed
        val laneWord = "jamg"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        if ((dexLane and 12) == 0) {
            dexLane = dexLane + 3026
        }
        dexLane = dexLane shl 5
        dexLane = dexLane xor 9086
        dexLane = dexLane + 14941
        return dexLane
    }

    fun lane66(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane or 7311
        dexLane = dexLane % 39
        dexLane = dexLane.inv()
        dexLane = dexLane xor 55037
        dexLane = dexLane shl 5
        return dexLane
    }

    fun lane67(seed: Int): Int {
        var dexLane = seed
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 2362
            1 -> dexLane + 1918
            else -> dexLane + 2581
        }
        dexLane = dexLane * 14
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane.inv()
        dexLane = dexLane + 24917
        return dexLane
    }

    fun lane68(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane shl 9
        dexLane = dexLane.inv()
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 3290
            1 -> dexLane + 2124
            else -> dexLane + 2276
        }
        dexLane = dexLane + 59301
        dexLane = dexLane and 24221
        return dexLane
    }

    fun lane69(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane shl 9
        dexLane = dexLane or 37347
        dexLane = dexLane.inv()
        dexLane = dexLane ushr 12
        dexLane = dexLane * 25
        return dexLane
    }

    fun lane70(seed: Int): Int {
        var dexLane = seed
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 1189
            1 -> dexLane + 3611
            else -> dexLane + 1554
        }
        dexLane = dexLane.inv()
        dexLane = dexLane + 13416
        if ((dexLane and 4) == 0) {
            dexLane = dexLane + 2858
        }
        dexLane = dexLane ushr 3
        return dexLane
    }

    fun lane71(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane + 18263
        if ((dexLane and 27) == 0) {
            dexLane = dexLane + 430
        }
        dexLane = dexLane.inv()
        dexLane = dexLane xor 28442
        val laneNums = intArrayOf(146, 13, 56)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        return dexLane
    }

    fun lane72(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane and 23651
        val laneWord = "nhep"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane or 28236
        if ((dexLane and 12) == 0) {
            dexLane = dexLane + 821
        }
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        return dexLane
    }

    fun lane73(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane + 49453
        dexLane = dexLane * 42
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane.inv()
        dexLane = dexLane and 589
        return dexLane
    }

    fun lane74(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane or 58804
        dexLane = dexLane + 38416
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane ushr 9
        dexLane = dexLane xor 46707
        return dexLane
    }

    fun lane75(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane ushr 3
        dexLane = dexLane shl 8
        dexLane = dexLane.inv()
        val laneNums = intArrayOf(66, 122, 196)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        if ((dexLane and 22) == 0) {
            dexLane = dexLane + 3238
        }
        return dexLane
    }

    fun lane76(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane % 15
        dexLane = dexLane or 49875
        val laneWord = "mmac"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane ushr 2
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        return dexLane
    }

    fun lane77(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane and 14588
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 3249
            1 -> dexLane + 1768
            else -> dexLane + 3968
        }
        dexLane = dexLane or 29031
        dexLane = dexLane shl 3
        dexLane = dexLane xor 19165
        return dexLane
    }

    fun lane78(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane + 38771
        dexLane = dexLane or 19553
        dexLane = dexLane.inv()
        dexLane = dexLane * 20
        dexLane = dexLane ushr 11
        return dexLane
    }

    fun lane79(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane ushr 1
        dexLane = dexLane * 3
        dexLane = dexLane + 15289
        dexLane = dexLane xor 14049
        val laneWord = "ogfg"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        return dexLane
    }

    fun lane80(seed: Int): Int {
        var dexLane = seed
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane shl 7
        dexLane = dexLane and 24382
        dexLane = dexLane + 8810
        dexLane = dexLane or 35820
        return dexLane
    }

    fun lane81(seed: Int): Int {
        var dexLane = seed
        val laneNums = intArrayOf(29, 11, 20)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane % 71
        dexLane = dexLane and 20778
        val laneWord = "cmep"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane ushr 5
        return dexLane
    }

    fun lane82(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane shl 7
        dexLane = dexLane ushr 7
        dexLane = dexLane or 43058
        dexLane = dexLane * 26
        dexLane = dexLane and 5301
        return dexLane
    }

    fun lane83(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane * 28
        if ((dexLane and 25) == 0) {
            dexLane = dexLane + 1153
        }
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        dexLane = dexLane.inv()
        dexLane = dexLane shl 3
        return dexLane
    }

    fun lane84(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane and 9051
        dexLane = dexLane or 35303
        val laneWord = "gfpf"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 822
            1 -> dexLane + 2394
            else -> dexLane + 187
        }
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        return dexLane
    }

    fun lane85(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane ushr 5
        val laneNums = intArrayOf(130, 196, 31)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = dexLane xor 2924
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 1000
            1 -> dexLane + 601
            else -> dexLane + 2651
        }
        dexLane = dexLane + 9227
        return dexLane
    }

    fun lane86(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane ushr 10
        val laneNums = intArrayOf(17, 202, 187)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 3972
            1 -> dexLane + 3065
            else -> dexLane + 3190
        }
        dexLane = dexLane shl 3
        dexLane = dexLane.inv()
        return dexLane
    }

    fun lane87(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane and 9364
        dexLane = dexLane * 26
        val laneNums = intArrayOf(191, 157, 83)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 150
            1 -> dexLane + 451
            else -> dexLane + 1749
        }
        dexLane = dexLane ushr 6
        return dexLane
    }

    fun lane88(seed: Int): Int {
        var dexLane = seed
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 3151
            1 -> dexLane + 781
            else -> dexLane + 2716
        }
        dexLane = dexLane ushr 2
        dexLane = dexLane and 27486
        dexLane = dexLane * 23
        dexLane = dexLane or 28137
        return dexLane
    }

    fun lane89(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane % 74
        dexLane = dexLane * 39
        dexLane = dexLane xor 34214
        var laneSpin = (dexLane and 1) + 1
        while (laneSpin > 0) {
            dexLane = dexLane xor laneSpin
            laneSpin -= 1
        }
        if ((dexLane and 30) == 0) {
            dexLane = dexLane + 1740
        }
        return dexLane
    }

    fun lane90(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane or 13579
        dexLane = dexLane ushr 12
        dexLane = dexLane.inv()
        dexLane = dexLane % 7
        val laneNums = intArrayOf(27, 156, 160)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        return dexLane
    }

    fun lane91(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane xor 11975
        val laneNums = intArrayOf(132, 169, 76)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 82
            1 -> dexLane + 1508
            else -> dexLane + 3181
        }
        dexLane = dexLane ushr 12
        dexLane = dexLane and 2216
        return dexLane
    }

    fun lane92(seed: Int): Int {
        var dexLane = seed
        if ((dexLane and 30) == 0) {
            dexLane = dexLane + 2775
        }
        dexLane = dexLane + 51784
        dexLane = dexLane xor 43921
        dexLane = dexLane ushr 1
        dexLane = dexLane or 24202
        return dexLane
    }

    fun lane93(seed: Int): Int {
        var dexLane = seed
        val laneWord = "dahd"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane shl 11
        dexLane = dexLane ushr 8
        dexLane = dexLane % 77
        val laneNums = intArrayOf(162, 74, 201)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        return dexLane
    }

    fun lane94(seed: Int): Int {
        var dexLane = seed
        dexLane = when (dexLane and 3) {
            0 -> dexLane + 3387
            1 -> dexLane + 1813
            else -> dexLane + 3485
        }
        dexLane = dexLane shl 8
        dexLane = dexLane.inv()
        dexLane = dexLane + 22908
        dexLane = dexLane * 21
        return dexLane
    }

    fun lane95(seed: Int): Int {
        var dexLane = seed
        dexLane = dexLane ushr 3
        dexLane = dexLane * 19
        val laneNums = intArrayOf(90, 24, 99)
        var laneIx = 0
        while (laneIx < laneNums.size) {
            dexLane += laneNums[laneIx]
            laneIx += 1
        }
        val laneWord = "dijm"
        var laneAt = 0
        while (laneAt < laneWord.length) {
            dexLane = dexLane xor laneWord[laneAt].code
            laneAt += 1
        }
        dexLane = dexLane + 10046
        return dexLane
    }

    fun touch(seed: Int) {
        var acc = seed
        acc = lane00(acc)
        acc = lane01(acc)
        acc = lane02(acc)
        acc = lane03(acc)
        acc = lane04(acc)
        acc = lane05(acc)
        acc = lane06(acc)
        acc = lane07(acc)
        acc = lane08(acc)
        acc = lane09(acc)
        acc = lane10(acc)
        acc = lane11(acc)
        acc = lane12(acc)
        acc = lane13(acc)
        acc = lane14(acc)
        acc = lane15(acc)
        acc = lane16(acc)
        acc = lane17(acc)
        acc = lane18(acc)
        acc = lane19(acc)
        acc = lane20(acc)
        acc = lane21(acc)
        acc = lane22(acc)
        acc = lane23(acc)
        acc = lane24(acc)
        acc = lane25(acc)
        acc = lane26(acc)
        acc = lane27(acc)
        acc = lane28(acc)
        acc = lane29(acc)
        acc = lane30(acc)
        acc = lane31(acc)
        acc = lane32(acc)
        acc = lane33(acc)
        acc = lane34(acc)
        acc = lane35(acc)
        acc = lane36(acc)
        acc = lane37(acc)
        acc = lane38(acc)
        acc = lane39(acc)
        acc = lane40(acc)
        acc = lane41(acc)
        acc = lane42(acc)
        acc = lane43(acc)
        acc = lane44(acc)
        acc = lane45(acc)
        acc = lane46(acc)
        acc = lane47(acc)
        acc = lane48(acc)
        acc = lane49(acc)
        acc = lane50(acc)
        acc = lane51(acc)
        acc = lane52(acc)
        acc = lane53(acc)
        acc = lane54(acc)
        acc = lane55(acc)
        acc = lane56(acc)
        acc = lane57(acc)
        acc = lane58(acc)
        acc = lane59(acc)
        acc = lane60(acc)
        acc = lane61(acc)
        acc = lane62(acc)
        acc = lane63(acc)
        acc = lane64(acc)
        acc = lane65(acc)
        acc = lane66(acc)
        acc = lane67(acc)
        acc = lane68(acc)
        acc = lane69(acc)
        acc = lane70(acc)
        acc = lane71(acc)
        acc = lane72(acc)
        acc = lane73(acc)
        acc = lane74(acc)
        acc = lane75(acc)
        acc = lane76(acc)
        acc = lane77(acc)
        acc = lane78(acc)
        acc = lane79(acc)
        acc = lane80(acc)
        acc = lane81(acc)
        acc = lane82(acc)
        acc = lane83(acc)
        acc = lane84(acc)
        acc = lane85(acc)
        acc = lane86(acc)
        acc = lane87(acc)
        acc = lane88(acc)
        acc = lane89(acc)
        acc = lane90(acc)
        acc = lane91(acc)
        acc = lane92(acc)
        acc = lane93(acc)
        acc = lane94(acc)
        acc = lane95(acc)
        if (acc == Int.MIN_VALUE) {
            android.util.Log.v("DichyikowrdfpagthmsDexLanes", "lane")
        }
    }
}
