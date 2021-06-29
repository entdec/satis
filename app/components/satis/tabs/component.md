# Tabs

## UI

https://tailwindui.com/components/application-ui/navigation/tabs

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

satis.tabs takes an optional "group" parameter and is :main by default. So you could do:
`satis.tabs group: :second`
