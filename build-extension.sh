
#!/bin/bash

# Build script for Chrome Extension
echo "Building Savi Finance Transaction Parser extension..."

# Create extension directory
mkdir -p extension/icons
mkdir -p extension/lovable-uploads

# Copy static files directly to extension directory
cp public/manifest.json extension/
cp public/content.js extension/
cp public/popup.html extension/

# Copy image assets
echo "Copying asset files..."
cp public/lovable-uploads/267b7482-a65c-4de2-a9dc-052f913e68fd.png extension/lovable-uploads/ || echo "Warning: Could not copy Savi Finance logo"

# Copy icons
echo "Copying icon files..."
cp public/icons/icon16.png extension/icons/ || echo "Warning: Could not copy icon16.png"
cp public/icons/icon48.png extension/icons/ || echo "Warning: Could not copy icon48.png"
cp public/icons/icon128.png extension/icons/ || echo "Warning: Could not copy icon128.png"

# If icons are missing, create simple placeholder versions
if [ ! -f extension/icons/icon16.png ] || [ ! -f extension/icons/icon48.png ] || [ ! -f extension/icons/icon128.png ]; then
  echo "Some icons missing, creating simple versions..."
  # Use the Savi Finance logo if available
  if [ -f public/lovable-uploads/267b7482-a65c-4de2-a9dc-052f913e68fd.png ]; then
    echo "Using Savi Finance logo as fallback icon..."
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
