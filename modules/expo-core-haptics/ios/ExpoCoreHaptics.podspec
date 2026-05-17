Pod::Spec.new do |s|
  s.name           = 'ExpoCoreHaptics'
  s.version        = '1.0.0'
  s.summary        = 'Expo module for Core Haptics on iOS'
  s.description    = 'Native module exposing Core Haptics API for advanced haptic feedback'
  s.author         = 'TotalTraining'
  s.homepage       = 'https://github.com/user/TotalTraining'
  s.platforms      = { :ios => '13.0' }
  s.source         = { :git => '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = '**/*.{h,m,mm,swift}'
  s.swift_version = '5.4'

  s.frameworks = 'CoreHaptics'
end
