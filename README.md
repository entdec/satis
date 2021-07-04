# Satis

Short description and motivation.

## Usage

You can use satis helpers in your own helpers:

```ruby
def mycard(&block)
  satis.card(icon: 'fad fa-user', title: "Profile", &block)
end
```

and then in your template:

```slim
= smurrefluts do |card|
```

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'satis'
```

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
