module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^react$": "<rootDir>/node_modules/react",
    "^react/jsx-runtime$": "<rootDir>/node_modules/react/jsx-runtime",
  },
  modulePathIgnorePatterns: ["<rootDir>/lib/", "<rootDir>/example/"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|my-project|react-native-button)/)",
  ],
  setupFiles: ["./setupTests.js"],
};
