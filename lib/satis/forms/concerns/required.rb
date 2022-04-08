# frozen_string_literal: true

require 'active_support/concern'

module Satis
  module Forms
    module Concerns
      module Required
        extend ActiveSupport::Concern

        included do
          def required?(method)
            result = if !options[:required].nil?
              options[:required]
            elsif @object.respond_to?("#{method}_required?".to_sym)
              @object.send("#{method}_required?".to_sym)
            elsif has_validators?(method)
              required_by_validators?(method)
            end

            result = required?(method.to_s.sub(/_id$/, '')) if !result && method.match(/_id$/)
            result
          end

          def has_validators?(method)
            @has_validators ||= method && @object.class.respond_to?(:validators_on)
          end

          def required_by_validators?(method)
            (attribute_validators(method) + reflection_validators(method)).any? do |v|
              v.kind == :presence && valid_validator?(v)
            end
          end

          def attribute_validators(method)
            @object.class.validators_on(method)
          end

          def reflection_validators(_method)
            []
            # reflection ? object.class.validators_on(reflection.name) : []
          end

          def valid_validator?(validator)
            !conditional_validators?(validator) && action_validator_match?(validator)
          end

          def conditional_validators?(validator)
            validator.options.include?(:if) || validator.options.include?(:unless)
          end

          def action_validator_match?(validator)
            return true unless validator.options.include?(:on)

            case validator.options[:on]
            when :save
              true
            when :create
              !object.persisted?
            when :update
              object.persisted?
            end
          end
        end
      end
    end
  end
end
