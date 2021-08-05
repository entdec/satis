# Satis

UI/UX Framework.
We use:

- [TailwindCSS](https://tailwindui.com)
- [FontAwesome 6](https://fontawesome.com/v6.0/)
- [ViewComponent](https://viewcomponent.org)
- [HotWired](https://hotwired.dev)

## Usage

You can use satis helpers in your own helpers:

```ruby
def mycard(&block)
  sts.card(icon: 'fad fa-user', title: "Profile", &block)
end
```

and then in your template:

```slim
= mycard do |card|
```

### Components

Each component has it's own documentation in the component folder

### Forms

```slim
  = sts.form_with model: @user, url: profile_url, class: 'mt-2' do |f|
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

## Dark

bg-gray-800 - hoofd achtergrond card/sidebar
bg-gray-700 - highlight card/sidebar / hover
text-gray-300 - tekst kleur
bg-gray-600 - body achtergrond kleur

## Known issues

- dropdown results will not overlap the card, they should, just like date-time picker
- dropdown triggers on-change upon initial population (for attributes), which is different from select's
- table state is not saved
- table columns removing is weird, you really need to be on the left part of the screen to drag
- table filters initially passed should not be editable
- sidebar has no small / collapsed version

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'satis'
```

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
