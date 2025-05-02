module Satis
  module Navigation
    class Component < Satis::ApplicationComponent
      # before_action :needed_objects, :extra_tables

      def search(term = nil)
        queries = []
        values = []

        queries << "name LIKE ?"
        values << "%#{term}%"

        needed_tables&.each do |table|
          queries << "#{table} LIKE ?"
          values << "%#{term}%"
        end

        query = queries.join(" OR ")

        needed_objects.where(query, *values)
      end

      private

      def needed_tables
        # Define any tables that should be included in the search
        [brands, users, projects]
      end

      def needed_objects(objects)
        # Define the objects that should be included in the search
        objects
      end

    end
  end
end