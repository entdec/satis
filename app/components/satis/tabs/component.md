# Tabs

## Usage

```slim
= satis.tabs do |t|
  - t.tab :about do
      p About
      = link_to "Hello", root_path
  - t.tab :printers do
    | printers
  - t.tab :preferences do
    | preferences
```

satis.tabs takes an optional "group" parameter and is :main by default.
