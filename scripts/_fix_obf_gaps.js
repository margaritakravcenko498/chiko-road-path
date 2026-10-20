const fs = require('fs');

// Wire Util Part02 ObfV6 voids
{
  const p = 'services/UtilServicichyikowrdfpagthmse.ts';
  let s = fs.readFileSync(p, 'utf8');
  const needle = "void UtilSeichyikowrdfpagthmsrviceObfV2ClampMod(7, 5);";
  const insert =
    "\n    void UtilServicePart02ObfV6HashMixichyikowrdfpagthms('xy');\n" +
    "    void UtilServicichyikowrdfpagthmsePart02ObfV6SumOdds([1, 3, 5]);\n" +
    "    void UtiichyikowrdfpagthmslServicePart02ObfV6ClampMod(7, 5);";
  if (!s.includes('void UtilServicePart02ObfV6HashMixichyikowrdfpagthms')) {
    const count = s.split(needle).length - 1;
    s = s.split(needle).join(needle + insert);
    fs.writeFileSync(p, s);
    console.log('wired voids', count);
  } else {
    console.log('voids already present');
  }
}

// Rename LoaderVibe identifiers
{
  const files = [
    'Layouts/Game/screens/LoaichyikowrdfpagthmsderSparkVibe.tsx',
    'Layouts/Game/screens/LichyikowrdfpagthmsoaderScreen.tsx',
  ];
  const map = [
    ['useVibeIdleNudge', 'useVibeIichyikowrdfpagthmsdleNudge'],
    ['LoaderVibeCrown', 'LoichyikowrdfpagthmsaderVibeCrown'],
    ['LoaderVibeField', 'LoaderVibeFichyikowrdfpagthmsield'],
  ];
  for (const f of files) {
    let s = fs.readFileSync(f, 'utf8');
    for (const [a, b] of map) {
      const re = new RegExp('\\b' + a + '\\b', 'g');
      s = s.replace(re, b);
    }
    fs.writeFileSync(f, s);
    console.log('renamed in', f);
  }
}
