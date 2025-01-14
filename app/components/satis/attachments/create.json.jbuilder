# frozen_string_literal: true

json.selector 'div.attachments'
json.html render partial: 'satis/attachments/index', layout: false, formats: [:html],
                 locals: { attachments: @model.images, upload_url: polymorphic_path([@model, :attachments]) }
