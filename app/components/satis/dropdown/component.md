# Dropdown

## UI

https://tailwindcomponents.com/component/select-with-custom-list

## Usage

### Simple, without custom HTML

```slim
= f.input :account_id, collection: policy_scope(Account).with(@user.account_id), as: :dropdown
```

### Simple, with custom HTML

```slim
= f.input :account_id, collection: policy_scope(Account).with(@user.account_id), as: :dropdown do |account|
    .cursor-pointer.w-full.border-gray-100.border-b.hover:bg-blue-200
      .flex.w-full.items-center.p-2.pl-2.border-transparent.border-l-2.relative.hover:border-teal-100
        .w-full.items-center.flex
          .mx-2.-mt-1
            span = account.name
            .text-xs.truncate.w-full.normal-case.font-normal.-mt-1.text-gray-500 = account.name
```

### Remote select, which always needs custom HTML

```
  = f.input :location_id, url: select_locations_url(format: :html), as: :dropdown
```

This `select.html.slim` should look like this:

```
- @locations.each do |location|
  div data-satis-dropdown-item-value=location.id data-satis-dropdown-item-text=location.name 
    .cursor-pointer.w-full.border-gray-100.rounded-t.border-b.hover:bg-blue-200
      .flex.w-full.items-center.p-2.pl-2.border-transparent.border-l-2.relative.hover:border-teal-100
        .w-full.items-center.flex
          .mx-2.-mt-1
            span = location.name
```
