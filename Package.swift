// swift-tools-version: 6.0

import Foundation
import PackageDescription

let usedRootEntries: Set<String> = ["ios", "include", "Package.swift"]
let unusedRootEntries = try! FileManager.default.contentsOfDirectory(atPath: Context.packageDirectory)
    .filter { !usedRootEntries.contains($0) }
    .sorted()

let package = Package(
    name: "RNReactNativeHapticFeedback",
    platforms: [.iOS("15.1")],
    products: [
        .library(name: "RNReactNativeHapticFeedback", targets: ["RNReactNativeHapticFeedback"]),
    ],
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
    ],
    targets: [
        .target(
            name: "RNReactNativeHapticFeedback",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
                .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
            ],
            path: ".",
            exclude: ["ios/RNHapticFeedback.xcodeproj"] + unusedRootEntries,
            sources: ["ios/RNHapticFeedback"],
            publicHeadersPath: "include",
            cSettings: [
                .define("RCT_NEW_ARCH_ENABLED", to: "1"),
                .headerSearchPath("ios/RNHapticFeedback"),
            ],
            cxxSettings: [
                .define("RCT_NEW_ARCH_ENABLED", to: "1"),
                .headerSearchPath("ios/RNHapticFeedback"),
                .define("DEBUG", .when(configuration: .debug)),
                .define("NDEBUG", .when(configuration: .release)),
            ],
            linkerSettings: [
                .linkedFramework("CoreHaptics"),
                .linkedFramework("AudioToolbox"),
            ]
        ),
    ],
    cxxLanguageStandard: .cxx20
)
