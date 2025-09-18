# This flake provides a development environment for a Ruby on Rails application
#
# Make sure you have direnv (and nix) installed.
# Your .envrc should at least have the following content:
#
# ```
# export DIRENV_WARN_TIMEOUT=1m
# use flake
# ```
# Then just cd into the folder, that should then install the tools so you have everything in place.
# To start services you can run the following:
# `nix run .#default`
#
{
  # https://community.flake.parts
  description = "Ruby on Rails with PostgreSQL and Redis";
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    systems.url = "github:nix-systems/default";
    process-compose-flake.url = "github:Platonic-Systems/process-compose-flake";
    services-flake.url = "github:juspay/services-flake";
  };
  outputs =
    inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      systems = import inputs.systems;
      imports = [
        inputs.process-compose-flake.flakeModule
      ];
      perSystem =
        {
          self,
          pkgs,
          config,
          lib,
          ...
        }:
        {
          # `process-compose.foo` will add a flake package output called "foo".
          # Therefore, this will add a default package that you can build using
          # `nix build` and run using `nix run`.
          process-compose."default" =
            { config, ... }:
            let
              dbName = "satis_development";
            in
            assert dbName != "";
            {
              imports = [
                inputs.services-flake.processComposeModules.default
              ];

              services.redis."r1" = {
                enable = true;
              };

              services.postgres."pg1" = {
                enable = true;
                initialScript.before = ''
                  CREATE USER postgres WITH password 'postgres';
                  ALTER USER postgres WITH SUPERUSER;
                '';
                initialDatabases = [
                  {
                    name = dbName;
                  }
                ];
              };
            };

          devShells.default = pkgs.mkShell {
            buildInputs = [
              pkgs.ruby_3_3
              pkgs.nodejs
              pkgs.rubyPackages_3_3.ruby-vips # ruby-vips gem built for Ruby 3.4
              pkgs.libyaml
              pkgs.shared-mime-info
              pkgs.libffi
              pkgs.openssl
              pkgs.pkg-config
              pkgs.nixd
            ];

            FREEDESKTOP_MIME_TYPES_PATH = "${pkgs.shared-mime-info}/share/mime/packages/freedesktop.org.xml";
            REDIS_URL = "redis://localhost:6379/0";
            RAILS_REDIS_URL = "redis://localhost:6379/0";
            CABLE_REDIS_URL = "redis://localhost:6379/1";
            DB_HOST = "localhost";

            inputsFrom = [
              config.process-compose."default".services.outputs.devShell
            ];

          };
        };
    };
}
