# Card

## UI

https://tailwindui.com/components/application-ui/headings/card-headings

## Usage

```slim
= sts.card :your_profile, title: 'Your profile', description: 'Edit your profile information' do |c|
  - c.action
      button Save
  | Content here
```
