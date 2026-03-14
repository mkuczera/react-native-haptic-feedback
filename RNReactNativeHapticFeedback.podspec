require 'json'
package = JSON.parse(File.read(File.join(File.dirname(__FILE__), 'package.json')))

# The library's own minimum: Core Haptics requires iOS 13.0.
# The host app's RN version enforces its own higher minimum via its podspec
# (e.g. RN 0.76+ → iOS 15.1, RN 0.84+ → iOS 16.0), so we don't duplicate that here.
min_ios_version = '13.0'

Pod::Spec.new do |s|
  s.name         = "RNReactNativeHapticFeedback"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-haptic-feedback
                   DESC
  s.homepage     = "https://github.com/mkuczera/react-native-haptic-feedback"
  s.license      = { :type => "MIT" }
  s.author       = { "Michael Kuczera" => "m.kuczera@gmail.com" }
  s.platform     = :ios, min_ios_version
  s.source       = { :git => "https://github.com/mkuczera/react-native-haptic-feedback.git", :tag => "v#{s.version.to_s}" }
  s.source_files = "ios/**/*.{h,m,mm}"
  s.requires_arc = true
  s.frameworks   = 'CoreHaptics', 'AudioToolbox'

  if defined?(install_modules_dependencies) != nil
    install_modules_dependencies(s)
  else
    s.dependency 'React-Core'
  end
end
