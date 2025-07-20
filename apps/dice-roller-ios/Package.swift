// swift-tools-version: 6.1
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "DnDDiceRoller",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "DnDDiceRoller",
            targets: ["DnDDiceRoller"])
    ],
    dependencies: [
        .package(path: "DiceModels")
    ],
    targets: [
        .target(
            name: "DnDDiceRoller",
            dependencies: ["DiceModels"],
            path: "DnDDiceRoller")
    ]
)

let package = Package(
    name: "DnDDiceRoller-iOS",
    targets: [
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .executableTarget(
            name: "DnDDiceRoller-iOS"),
    ]
)
