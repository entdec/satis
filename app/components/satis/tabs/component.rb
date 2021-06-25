module Satis
  module Tabs
    class Component < Satis::ApplicationComponent
      renders_many :tabs, Tab::Component
    end
  end
end
