# TiddlyDnD-Plugins

Plugin-Bündel für die **DnDWiki**-Repo-Familie: **Eigenplugins** (`dndwiki-core`,
`staticfiles`) hier, der **flibbles-Graph-Stack** separat (siehe "Fremdplugins"
unten). Wikis nutzen das offizielle `tiddlywiki` aus npm und beziehen die Plugins
von hier.

## Inhalt (`plugins/`)

| Plugin | Ordner | Zweck | Herkunft |
|---|---|---|---|
| `$:/plugins/dndwiki-core` | `plugins/dndwiki-core` | **D&D-Formatschicht**: Makros, Filter, ViewTemplates, Styles, Index-Hubs, Graph-Schema | eigen, versioniert |
| `$:/plugins/staticfiles` | `plugins/staticfiles` | liefert `images/`+`data/` im Dev-Server aus (server-only) | eigen |

## Fremdplugins

Werden von jedem Wiki einzeln per Release-Tag als Git-Dependency bezogen:

- `flibbles/graph` ([tw5-graph](https://github.com/flibbles/tw5-graph))
- `flibbles/vis-network` ([tw5-vis-network](https://github.com/flibbles/tw5-vis-network))
- `flibbles/relink` ([tw5-relink](https://github.com/flibbles/tw5-relink))

## Einbinden in TiddlyWiki

`package.json` des Wikis pinnt das Bündel **und** den Graph-Stack je Release-Tag:

```json
"devDependencies": {
  "tiddlywiki": "5.4.0",
  "tiddlydnd-plugins": "git+https://github.com/WkoD/TiddlyDnD-Plugins.git#1.3.0",
  "tw5-graph": "git+https://github.com/flibbles/tw5-graph.git#v1.7.1",
  "tw5-vis-network": "git+https://github.com/flibbles/tw5-vis-network.git#v10.6.3",
  "tw5-relink": "git+https://github.com/flibbles/tw5-relink.git#v2.6.0"
}
```

Ein kleiner Launcher (`scripts/tw.js`) im Wiki setzt `TIDDLYWIKI_PLUGIN_PATH`
plattformneutral (`path.delimiter`) aus allen `node_modules/*/plugins` zusammen;
`tiddlywiki.info` listet die Plugins per Ordnername (`dndwiki-core`, `staticfiles`,
`graph`, `vis-network`, `relink`).

Bearbeitung und Release-Prozess dieses Repos: siehe `CLAUDE.md`.
