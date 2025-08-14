source "https://rubygems.org"

# Keep Ruby version aligned with CI and local dev
ruby "3.1"

# Use the GitHub Pages meta-gem to match the Pages build environment
# This brings in Jekyll and the supported plugins with compatible versions
gem "github-pages", group: :jekyll_plugins

# Development & test dependencies
group :development, :test do
  gem "webrick"          # Required for `jekyll serve` on Ruby 3+
  gem "html-proofer", "~> 5.0" # HTML linting in CI and locally
end

# Windows and JRuby support (only include if developing on those platforms)
# platforms :mingw, :x64_mingw, :mswin, :jruby do
#   gem "tzinfo", ">= 1", "< 3"
#   gem "tzinfo-data"
# end

# Performance-booster for watching directories on Windows
# gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
