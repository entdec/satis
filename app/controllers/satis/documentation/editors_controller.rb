module Satis
  class Documentation::EditorsController < ApplicationController

    class Document
      include ActiveModel::Model
      attr_accessor :code
    end
    def index
      @document = Document.new(code: "<html>\n<head>\n<title>Test</title>\n</head>\n<body>\n Test\n</body>\n</html>\n")
    end
  end
end
