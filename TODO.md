# TODO

## Tailwind CSS

- move tailwindcss into satis, possibly including config

  "peerDependencies": {
  "@tailwindcss/forms": "^0.3.3",
  "@tailwindcss/typography": "^0.4.1",
  "codemirror": "^5.48.4",
  "codemirror-liquid": "git+ssh://git@code.entropydecelerator.com/components/codemirror-liquid",
  "stimulus": "^2",
  "tailwindcss": "^2.2.2"
  }

## Fontawesome

```ruby
REGEXP = /(fas|far|fal|fad|fab|fat|fa-solid|fa-regular|fa-light|fa-thin|fa-duotone|fa-brands)(?:\s|\.)fa-([a-z\-]*)/
Dir.glob('app/views/**/*.html.slim').each do |file|
  contents = File.read(file)
  results =  contents.scan(REGEXP)
  pp results if results.size > 0
end
```
