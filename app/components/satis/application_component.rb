module Satis
  class ApplicationComponent < ViewComponent::Base
    include ViewComponent::SlotableV2
    include ActionView::Helpers::TranslationHelper
  end
end
