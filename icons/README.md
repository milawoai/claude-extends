# Icon Files

This directory should contain PNG icon files for the browser extension.

## Required Icons

- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels  
- `icon128.png` - 128x128 pixels

## Generating Icons

You can use the provided `icon.svg` as a base and convert it to PNG files at the required sizes using any SVG to PNG converter tool or image editing software.

### Using ImageMagick (if available):

```bash
convert -background none icon.svg -resize 16x16 icon16.png
convert -background none icon.svg -resize 48x48 icon48.png
convert -background none icon.svg -resize 128x128 icon128.png
```

### Using online tools:

- CloudConvert: https://cloudconvert.com/svg-to-png
- SVG to PNG: https://svgtopng.com/

## Temporary Placeholder

For development, you can create simple colored PNG files as placeholders until proper icons are designed.
