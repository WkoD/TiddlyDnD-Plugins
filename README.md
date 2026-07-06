# TiddlyDnD-Plugins

Plugin-Bündel für die **DnDWiki**-Repo-Familie. Ersetzt den früheren
Engine-Fork `WkoD/TiddlyDnD`: Die Wikis nutzen jetzt das **offizielle**
`tiddlywiki` aus npm und beziehen nur noch die Plugins von hier.

## Inhalt (`plugins/`)

| Plugin | Zweck | Herkunft |
|---|---|---|
| `wkod/dndwiki-core` | **D&D-Formatschicht**: Makros, Filter, ViewTemplates, Styles, Index-Hubs, tiddlymap-Schema | eigen, versioniert |
| `wkod/staticfiles` | liefert `images/`+`data/` im Dev-Server aus (server-only) | eigen |
| `felixhayashi/tiddlymap` | Karten/Graph-Visualisierung (eingefroren auf 0.17.16) | [TW5-TiddlyMap](https://github.com/felixhayashi/TW5-TiddlyMap) |
| `felixhayashi/hotzone` | Abhängigkeit von tiddlymap | [TW5-HotZone](https://github.com/felixhayashi/TW5-HotZone) |
| `felixhayashi/topstoryview` | Story-View-Ergänzung | [TW5-TopStoryView](https://github.com/felixhayashi/TW5-TopStoryView) |
| `flibbles/vis-network` | vis-network-Bibliothek für tiddlymap (eingefroren auf 9.1.3) | [tw5-vis-network](https://github.com/flibbles/tw5-vis-network) |

## Formatschicht bearbeiten

Die Formatschicht lebt als **Ordner-Plugin** unter
`plugins/wkod/dndwiki-core/` (kein Build-Schritt — der Ordner *ist* das Plugin).

```bash
npm install
npm start          # Vorschau-/Autoren-Edition unter http://127.0.0.1:8080
```

Bearbeitet werden die Format-Tiddler direkt als Dateien in
`plugins/wkod/dndwiki-core/` (im IDE); `npm start` rendert sie zur Vorschau.

## Neue Version veröffentlichen

1. Format ändern → `version` in `plugins/wkod/dndwiki-core/plugin.info` erhöhen
   (semver: patch=Fix, minor=neue Makros/Hubs, major=brechende Änderung).
2. Committen, dann **taggen == Version** und Release setzen:
   ```bash
   git tag 1.1.0 && git push origin master 1.1.0
   gh release create 1.1.0 --generate-notes
   ```
3. Die Konsumenten (DnDWiki-Vorlage + Kampagnen) heben ihren Pin **bewusst** an
   (`#1.0.0` → `#1.1.0`) und laufen `npm install`. Kein Auto-Sync — gewollte
   Stabilität. Dieses Repo kennt die Kampagnen nicht.

## Konsum durch ein Wiki

`package.json` des Wikis:

```json
"devDependencies": {
  "tiddlywiki": "5.4.0",
  "tiddlydnd-plugins": "git+https://github.com/WkoD/TiddlyDnD-Plugins.git#1.0.0"
}
```

und `TIDDLYWIKI_PLUGIN_PATH=node_modules/tiddlydnd-plugins/plugins` beim Bauen/Starten.
