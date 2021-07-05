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

### Components

Each component has it's own documentation in the component folder

### Forms

```slim
  = satis.form_with model: @user, url: profile_url, class: 'mt-2' do |f|
    = f.input :id, as: :hidden
    = f.input :first_name
    = f.input :last_name
    = f.association :account, collection: policy_scope(Account).with(@user.account_id), as: :dropdown
    = f.input :location_id, url: select_locations_url(format: :html), as: :dropdown, hint: "The user's main location"

    = f.button
    = f.submit
    = f.reset
    = f.continue
```

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'satis'
```

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
