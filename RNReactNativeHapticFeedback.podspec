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
  s.platform     = :ios, "12.4"
  s.source       = { :git => "https://github.com/mkuczera/react-native-haptic-feedback.git", :tag => "v#{s.version.to_s}" }
  s.source_files  = "ios/**/*.{h,m,mm}"
  s.requires_arc = true


  # This guard prevent to install the dependencies when we run `pod install` in the old architecture.
  if defined?(install_modules_dependencies()) != nil
    install_modules_dependencies(s)
  else
    s.dependency 'React-Core'
  end
end


