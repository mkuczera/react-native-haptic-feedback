require 'json'
package = JSON.parse(File.read(File.join(File.dirname(__FILE__), 'package.json')))

Pod::Spec.new do |s|
  s.name         = "RNReactNativeHapticFeedback"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-haptic-feedback
                   DESC
  s.homepage     = "https://github.com/mkuczera/react-native-haptic-feedback"
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "m.kuczera@gmail.com" }
  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/mkuczera/react-native-haptic-feedback.git", :tag => "master" }
  s.source_files  = "ios/*.{h,m}"
  s.requires_arc = true

  s.dependency 'React-Core'
end

  
