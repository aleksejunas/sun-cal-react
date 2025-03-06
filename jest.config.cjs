module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};

// module.exports = {
//   moduleNameMapper: {
//     "\\.(css|less|scss|sass)$": "identity-obj-proxy",
//   },
//   transform: {
//     "^.+\\.(ts|tsx)$": "ts-jest",
//   },
// };

// module.exports = {
//   preset: "ts-jest",
//   testEnvironment: "jsdom",
//   moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
// };
