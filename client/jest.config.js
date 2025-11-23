module.exports = {
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest"
  },
  transformIgnorePatterns: ["/node_modules/(?!axios)/"]
};
