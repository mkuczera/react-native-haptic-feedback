
Pod::Spec.new do |s|
  s.name         = "RNReactNativeHapticFeedback"
  s.version      = "1.0.0"
  s.summary      = "RNReactNativeHapticFeedback"
  s.description  = <<-DESC
                  RNReactNativeHapticFeedback
                   DESC
  s.homepage     = "https://github.com/mkuczera/react-native-haptic-feedback"
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/author/RNReactNativeHapticFeedback.git", :tag => "master" }
  s.source_files  = "ios/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  