
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
cp public/icons/* extension/icons/

# If icons don't exist, copy a placeholder or the logo
if [ ! -f extension/icons/icon16.png ]; then
  echo "Creating placeholder icons..."
  # Using the Savi Finance logo if available
  if [ -f public/lovable-uploads/267b7482-a65c-4de2-a9dc-052f913e68fd.png ]; then
    cp public/lovable-uploads/267b7482-a65c-4de2-a9dc-052f913e68fd.png extension/icons/icon16.png
    cp public/lovable-uploads/267b7482-a65c-4de2-a9dc-052f913e68fd.png extension/icons/icon48.png
    cp public/lovable-uploads/267b7482-a65c-4de2-a9dc-052f913e68fd.png extension/icons/icon128.png
  else
    # Or use favicon as fallback
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
