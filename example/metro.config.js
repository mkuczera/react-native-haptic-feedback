const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const libraryRoot = path.resolve(__dirname, '..');

const config = {
  watchFolders: [libraryRoot],
  resolver: {
    extraNodeModules: {
      // When the library's own code imports react/react-native, resolve from the app
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
