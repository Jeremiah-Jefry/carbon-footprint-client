#!/bin/bash

# build.sh
# Bundles and minifies the Carbon Footprint Tracker into the dist/ directory.
# This zero-configuration script requires esbuild.

echo "Building Carbon Footprint Tracker..."

# Ensure dist directory exists
mkdir -p dist

# Bundle and minify JS
npx esbuild src/app.js --bundle --minify --outfile=dist/app.js

# Minify CSS
npx esbuild src/styles.css --minify --outfile=dist/styles.css

# Copy HTML
cp src/index.html dist/index.html

echo "Build complete. Assets generated in dist/."
