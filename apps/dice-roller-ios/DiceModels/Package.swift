// swift-tools-version: 5.8
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "DiceModels",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "DiceModels",
            targets: ["DiceModels"])
    ],
    targets: [
        .target(
            name: "DiceModels",
            dependencies: [])
    ]
)
