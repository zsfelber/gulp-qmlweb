## A Gulp plugin to produce pre-parsed assets for [QmlWeb](https://github.com/qmlweb/qmlweb)

[![Join the chat at https://gitter.im/qmlweb/qmlweb](https://badges.gitter.im/qmlweb/qmlweb.svg)](https://gitter.im/qmlweb/qmlweb)

[![npm](https://img.shields.io/npm/v/gulp-qmlweb.svg)](https://www.npmjs.com/package/gulp-qmlweb)
[![GitHub tag](https://img.shields.io/github/tag/qmlweb/gulp-qmlweb.svg)](https://github.com/qmlweb/gulp-qmlweb/releases)

## Installation

Add the following dependencies to your `package.json`:

```js
{
  "name": "QmlWebProject",
  "devDependencies": {
    "gulp": "~3.6.0",
    "gulp-concat": "~2.1.7",
    "gulp-qmlweb": "~0.0.7"
  }
}
```

## Usage
```js
var qml = require('gulp-qmlweb');
var concat = require('gulp-concat');

function myPathFilter(path) {
    return "/mynamespace/" + path;
}

gulp.task('scripts', function() {
  return gulp.src(['qml/**/*.qml', 'qml/**/*.js', 'qml/**/qmldir'])
    .pipe(qml({pathFilter: myPathFilter}))
    .pipe(concat('qrc.js'))
    .pipe(gulp.dest('./dist/'));
});
```

This will compile all your QML sources (qml and javascript) and concatenate them in the `/dist/qrc.js` file.


## This Fork/Branch

Intended to fix parse errors (like that of readonly property) and maybe another simple bugs which prevent my actual qml model to be compiled and used.

Added:
Understand my qmlweb-parser extensions:
[readonly]  [list<xxx> templates]   [var xxx = {"aaa:" : <expression>}  json like var property syntax ]

Changed output format to a much more logical (as-intended vs totally bad) form:
OLD:
<code>
QmlWeb.addQrc("tradepracticer/base", "ButtonModel.qml", ["toplevel", [
        ["qmlimport", "QtQuick", 2.1, "", true],
        ["qmlimport", "biz.greenzone", 1, "", true]
    ],
    ["qmlelem", "TextModel", null, [
        ["qmlsignaldef", "clicked", []],
        ["qmlpropdef", "icon", "string"],
        ["qmlpropdefro", "checked", "bool", ["stat", ["name", "false"]], "false;\n    "],
        ["qmlpropdefro", "checkable", "bool", ["stat", ["name", "false"]], "false;\n\n    "],
        ["qmlmethod", "click", ["defun", "click", [],
            [
                ["if", ["name", "enabled"],
                    ["block", [
                        ["stat", ["call", ["name", "clicked"],
                            []
                        ]]
                    ]], null
                ]
            ]
        ], "function click() {\n        if (enabled) {\n            clicked();\n        }\n    }\n"]
    ]]
]);
</code>

NEW:
<code>
QmlWeb.addQrc("tradepracticer/base", "ButtonModel.qml", {
    "$class": "Component",
    "$imports": [
        ["qmlimport", "QtQuick", 2.1, "", true],
        ["qmlimport", "biz.greenzone", 1, "", true]
    ],
    "$children": [e({
        "$class": "TextModel",
        clicked: s({}),
        icon: p({
            type: "string"
        }),
        checked: p({
            type: "bool",
            value: false,
            readonly: true
        }),
        checkable: p({
            type: "bool",
            value: false,
            readonly: true
        }),
        click: m({
            src: "(){enabled&&clicked()}"
        })
    })]
});
</code>
