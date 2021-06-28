# Tabs

## Usage

```slim
= satis.tabs do |t|
  - t.tab :about
      p About
      = link_to "Hello", root_path
  - t.tab :printers
    | printers
  - t.tab :preferences
    | preferences
```

satis.tabs takes an optional "group" parameter and is :main by default.
