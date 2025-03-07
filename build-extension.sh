
#!/bin/bash

# Build script for Chrome Extension
echo "Building Savi Finance Transaction Parser extension..."

# Build the React application
npm run build

# Create extension directory
mkdir -p extension/icons

# Copy build files to extension directory
cp -r dist/* extension/
cp public/manifest.json extension/
cp public/content.js extension/

# Make icons directory
mkdir -p extension/icons

# Copy icons
if [ -f public/icons/icon16.png ] && [ -f public/icons/icon48.png ] && [ -f public/icons/icon128.png ]; then
  echo "Copying icon files..."
  cp public/icons/icon16.png extension/icons/
  cp public/icons/icon48.png extension/icons/
  cp public/icons/icon128.png extension/icons/
else
  echo "Icon files not found, creating placeholder icons..."
  # Using the Savi Finance logo if available
  if [ -f public/lovable-uploads/267b7482-a65c-4de2-a9dc-052f913e68fd.png ]; then
    echo "Using Savi Finance logo as icon..."
    cp public/lovable-uploads/267b7482-a65c-4de2-a9dc-052f913e68fd.png extension/icons/icon16.png
    cp public/lovable-uploads/267b7482-a65c-4de2-a9dc-052f913e68fd.png extension/icons/icon48.png
    cp public/lovable-uploads/267b7482-a65c-4de2-a9dc-052f913e68fd.png extension/icons/icon128.png
  else
    # Or use favicon as fallback
    echo "Using favicon as fallback icon..."
    cp public/favicon.ico extension/icons/icon16.png
    cp public/favicon.ico extension/icons/icon48.png
    cp public/favicon.ico extension/icons/icon128.png
  fi
fi

echo "Extension built successfully!"
echo "To install in Chrome:"
echo "1. Go to chrome://extensions/"
echo "2. Enable Developer Mode"
echo "3. Click 'Load unpacked'"
echo "4. Select the 'extension' folder"
