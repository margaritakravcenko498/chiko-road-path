/**
 * Единый список команд autosetup / release.
 * Источник описаний для `npm run cmds`.
 * Скрипты в package.json должны совпадать с полем `npm`.
 */
module.exports = [
  {
    group: "справка",
    npm: "cmds",
    description: "Показать весь список команд в терминале",
  },
  {
    group: "полный сетап",
    npm: "autosetup",
    description:
      "Полный цикл: Jira (поля+вложения+Worker URL из комментариев) + path-check + npm + checklist (иконка вручную)",
  },
  {
    group: "полный сетап",
    npm: "autosetup:assets",
    description:
      "Только keystore/google-services/game из Jira + path-check (без npm и checklist)",
  },
  {
    group: "полный сетап",
    npm: "autosetup:checklist",
    description: "Показать итоговый summary (без изменений)",
  },
  {
    group: "частичные шаги",
    npm: "autosetup:meta",
    description:
      "Jira → appName/package + Worker URL в li{fragment}nk",
  },
  {
    group: "частичные шаги",
    npm: "autosetup:keystore",
    description: "Только keystore из Jira *.tar.gz + gradle.properties",
  },
  {
    group: "частичные шаги",
    npm: "autosetup:google-services",
    description: "Только google-services.json из Jira",
  },
  {
    group: "частичные шаги",
    npm: "autosetup:game",
    description:
      "Код игры из Jira *_source.zip → assets + Layouts/Game (+ штамп fragment)",
  },
  {
    group: "частичные шаги",
    npm: "autosetup:game-stamp",
    description:
      "Вшить fragment в Layouts/Game (имена файлов + идентификаторы + helpers для split)",
  },
  {
    group: "частичные шаги",
    npm: "autosetup:fragment",
    description:
      "Замена фрагмента (как в Helper) + пакет активности com.{hostFragment}",
  },
  {
    group: "частичные шаги",
    npm: "autosetup:rotate",
    description: "Только обновление шифрования (как в Helper)",
  },
  {
    group: "частичные шаги",
    npm: "autosetup:colossus",
    description: "Colossus cipher + новый seed (апка ↔ Cloudflare Worker)",
  },
  {
    group: "частичные шаги",
    npm: "autosetup:protocol",
    description: "Уникальный Cloudflare протокол в Kotlin (DEX) и в worker",
  },
  {
    group: "частичные шаги",
    npm: "autosetup:reshuffle",
    description: "Случайные позиции фрагмента в именах",
  },
  {
    group: "частичные шаги",
    npm: "autosetup:touch",
    description: "Пересоздать файлы (сменить дату создания)",
  },
  {
    group: "частичные шаги",
    npm: "autosetup:decoy",
    description:
      "Мусорные файлы android/services (без Noise в имени) + нарезка существующих классов на Part",
  },
  {
    group: "частичные шаги",
    npm: "autosetup:dex",
    description:
      "Словарь R8, opcode-сниппеты в живых модулях, DexLanes и net stack (okhttp/volley + gson/moshi)",
  },
  {
    group: "частичные шаги",
    npm: "autosetup:paths",
    description: "Только проверка путей в Layouts/Game и App.tsx",
  },
  {
    group: "частичные шаги",
    npm: "autosetup:npm",
    description: "Только npm install",
  },
  {
    group: "частичные шаги",
    npm: "autosetup:clean-android",
    description: "Удалить android/build и android/app/build",
  },
  {
    group: "хвост",
    npm: "autosetup:tail",
    description:
      "Loader, helpers, описание в комментарий Jira, .git из GitHub, AAB workflow, FB hash и Class Name",
  },
  {
    group: "релиз",
    npm: "release",
    description: "assembleRelease + bundleRelease → ReadyBuilds (имя как в Helper)",
  },
  {
    group: "релиз",
    npm: "release:apk",
    description: "Только APK (assembleRelease) → ReadyBuilds",
  },
  {
    group: "релиз",
    npm: "release:aab",
    description: "Только AAB (bundleRelease) → ReadyBuilds",
  },
];
