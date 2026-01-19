# PNG to WebP Converter

A modern, client-side web application for converting PNG images to WebP format. Built with pure vanilla JavaScript, HTML, and CSS - no frameworks required.

![Dark Mode UI](https://img.shields.io/badge/UI-Dark%20Mode-blue)
![No Backend Required](https://img.shields.io/badge/Backend-Not%20Required-green)
![100% Client-Side](https://img.shields.io/badge/Processing-Client%20Side-orange)

## Features

### 🎨 Modern Dark Mode Interface
- Beautiful dark gradient background
- Blue accent colors for interactive elements
- Smooth transitions and hover effects
- Fully responsive design for mobile and desktop

### 📤 Multiple Input Methods
- **Drag & Drop**: Drag PNG files directly onto the upload zone
- **Browse Files**: Click the upload zone to select files from your system
- **Clipboard Paste**: Copy an image and press `Ctrl+V` (or `Cmd+V` on Mac)

### 🔄 Batch Processing
- Convert multiple PNG images simultaneously
- No limit on the number of files
- Process all images with a single quality setting

### ⚙️ Quality Control
- Adjustable WebP compression quality (0-100%)
- Default setting: 80% (optimal balance)
- Real-time reconversion when quality changes
- Lower quality = smaller file size
- Higher quality = better image fidelity

### 👁️ Side-by-Side Comparison
- View original PNG and converted WebP images together
- Compare image quality before downloading
- Visual confirmation of conversion results

### 📊 File Size Information
- Display original file size
- Display converted file size
- Show percentage of space saved (or increased)
- Color-coded savings indicator:
  - **Green**: File size reduced
  - **Red**: File size increased (rare)

### 💾 Download Options
- **Download All as ZIP**: Bundle all converted images into one ZIP file
- Automatic filename conversion (image.png → image.webp)
- Timestamped ZIP files for organization

### 🔒 Privacy-Focused
- **100% client-side processing**
- Images never leave your browser
- No uploads to any server
- No data collection or tracking

## Technology Stack

- **HTML5**: Semantic markup and Canvas API
- **CSS3**: Modern styling with gradients, flexbox, and grid
- **JavaScript (ES6+)**: Vanilla JS with async/await
- **JSZip**: ZIP file creation (loaded from CDN)

## Browser Compatibility

This application requires a modern browser with WebP support:

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 32+ |
| Firefox | 65+ |
| Safari | 14+ |
| Edge | 18+ |
| Opera | 19+ |

## Installation

No installation required! This is a standalone web application.

### Option 1: Download and Run Locally
1. Download all project files:
   - `index.html`
   - `styles.css`
   - `app.js`
2. Place them in the same directory
3. Open `index.html` in your web browser

### Option 2: Host on a Web Server
1. Upload files to any web server
2. Access via the server URL
3. Works with GitHub Pages, Netlify, Vercel, etc.

## Usage Guide

### Basic Conversion

1. **Open the Application**
   - Open `index.html` in your browser
   - You'll see the dark mode interface with an upload zone

2. **Add PNG Images**
   - **Method 1**: Drag PNG files onto the blue upload zone
   - **Method 2**: Click the upload zone and select files
   - **Method 3**: Copy an image to clipboard and press `Ctrl+V`

3. **Adjust Quality (Optional)**
   - Use the quality slider to adjust compression
   - Default is 80% (recommended)
   - Lower values = smaller files
   - Higher values = better quality

4. **View Results**
   - Each image appears with side-by-side comparison
   - Original PNG on the left
   - Converted WebP on the right
   - File sizes and savings percentage shown below

5. **Download Converted Images**
   - Click the "Download All as ZIP" button
   - ZIP file contains all converted WebP images
   - Original filenames with `.webp` extension

### Advanced Tips

**Optimal Quality Settings:**
- **80%**: Best balance for most images (recommended)
- **90-100%**: Near-lossless, for high-quality photos
- **60-70%**: Maximum compression, for web graphics

**Batch Processing:**
- Add multiple images at once
- Mix drag & drop with file selection
- Paste additional images while converting

**Quality Experimentation:**
- Adjust the slider to see real-time reconversion
- Compare file sizes at different quality levels
- Find the perfect balance for your needs

## Project Structure

```
solo-builder/
├── index.html          # Main HTML structure
├── styles.css          # Dark mode styling
├── app.js             # Conversion logic
└── README.md          # This file
```

### File Descriptions

#### index.html
- Contains the HTML structure
- Includes upload zone, quality slider, and image containers
- Loads JSZip library from CDN
- Links to styles.css and app.js

#### styles.css
- Dark mode color scheme
- Responsive grid layout for image cards
- Custom slider styling
- Hover effects and transitions
- Mobile-responsive breakpoints

#### app.js
- Core application logic
- Event listeners for drag & drop, file input, and paste
- Canvas-based image conversion
- Quality adjustment and reconversion
- ZIP file generation and download
- Error handling

## How It Works

### Image Conversion Process

1. **File Selection**
   - User provides PNG files via drag & drop, file input, or paste
   - Files are validated to ensure they're PNG format

2. **Canvas Rendering**
   - Image is loaded into an HTML5 `Image` object
   - Canvas element is created with matching dimensions
   - Image is drawn onto the canvas

3. **WebP Conversion**
   - `canvas.toBlob()` method converts to WebP format
   - Quality parameter controls compression (0.0 to 1.0)
   - Resulting blob is stored for download

4. **Display**
   - Original and converted images displayed side-by-side
   - File sizes calculated and compared
   - Savings percentage computed

5. **ZIP Creation**
   - JSZip library bundles all WebP blobs
   - ZIP file generated as a blob
   - Browser download triggered with timestamp filename

## API Reference

### Core Functions

#### `processFiles(files)`
Validates and processes an array of files.
- **Parameters**: `files` - Array of File objects
- **Returns**: void
- **Behavior**: Filters PNG files, creates image objects, initiates conversion

#### `convertImage(imageObj)`
Converts a PNG image to WebP format.
- **Parameters**: `imageObj` - Object containing image data
- **Returns**: Promise
- **Behavior**: Uses Canvas API to perform conversion

#### `reconvertAllImages()`
Re-converts all images with the current quality setting.
- **Parameters**: none
- **Returns**: void
- **Behavior**: Iterates through all images and reconverts them

#### `downloadAllAsZip()`
Creates a ZIP file of all converted images and triggers download.
- **Parameters**: none
- **Returns**: Promise
- **Behavior**: Uses JSZip to bundle files and trigger download

#### `formatFileSize(bytes)`
Formats byte size into human-readable format.
- **Parameters**: `bytes` - Number of bytes
- **Returns**: String (e.g., "1.5 MB")
- **Behavior**: Converts to KB, MB, or GB as appropriate

## Configuration

### Modifying Default Quality
Edit `app.js` line 2:
```javascript
let currentQuality = 80; // Change to your preferred default (0-100)
```

Update `index.html` line 34:
```html
<input type="range" id="qualitySlider" min="0" max="100" value="80" step="1">
```

### Changing Color Scheme
Edit `styles.css` CSS variables:
```css
/* Background gradient */
background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);

/* Accent color */
color: #60a5fa; /* Change to your preferred color */
```

### Modifying Upload Zone Text
Edit `index.html` lines 21-23:
```html
<p class="drop-text">Your custom text here</p>
<p class="drop-subtext">Your custom subtext</p>
```

## Troubleshooting

### Images Not Converting
- **Check browser compatibility**: Ensure you're using a modern browser
- **Verify file format**: Only PNG files are supported
- **Check console**: Open browser DevTools and check for JavaScript errors

### Quality Slider Not Working
- **Clear cache**: Hard refresh the page (Ctrl+Shift+R)
- **Check JSZip**: Ensure JSZip CDN is loading properly
- **Internet connection**: CDN requires internet access on first load

### ZIP Download Failing
- **Browser restrictions**: Some browsers may block automatic downloads
- **Check pop-up blocker**: Disable pop-up blockers for this page
- **File size**: Very large batches may take time to process

### Drag & Drop Not Working
- **Browser support**: Ensure drag & drop API is supported
- **File permissions**: Check that browser can access dropped files
- **Zone positioning**: Ensure drop zone is visible and not covered

## Performance Considerations

### Memory Usage
- Large images consume more memory during conversion
- Canvas size is limited by browser memory
- Recommended: Convert images under 10MB each

### Batch Size
- No hard limit on number of images
- Performance degrades with very large batches (100+ images)
- Consider converting in smaller batches for best experience

### Quality vs. Speed
- Higher quality settings take longer to process
- Lower quality settings convert faster
- Reconversion of all images may take time

## Security

### Client-Side Processing
- All conversions happen in your browser
- No data is transmitted to any server
- Images remain on your device

### External Dependencies
- JSZip library loaded from Cloudflare CDN
- CDN uses HTTPS for secure transmission
- No tracking or analytics included

## Contributing

This is a standalone project, but improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Future Enhancements

Potential features for future versions:
- [ ] Support for JPEG to WebP conversion
- [ ] Individual download buttons for each image
- [ ] Preset quality profiles (Low, Medium, High)
- [ ] Progress bar for large batches
- [ ] Image dimension display
- [ ] EXIF data preservation
- [ ] Light mode theme option
- [ ] Undo/redo functionality
- [ ] Image preview zoom
- [ ] Comparison slider overlay

## License

This project is open source and available for personal and commercial use.

## Credits

- **Canvas API**: HTML5 standard for image manipulation
- **JSZip**: Library for creating ZIP files by Stuart Knightley
- **Icons**: Custom SVG icons included in HTML

## Support

For issues, questions, or suggestions:
1. Check the troubleshooting section above
2. Review the browser compatibility table
3. Ensure all files are in the same directory
4. Check browser console for error messages

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Dark mode UI
- Batch conversion support
- Quality slider
- Side-by-side comparison
- ZIP download
- Multiple input methods
- File size information

---

**Built with ❤️ using vanilla JavaScript, HTML, and CSS**

No frameworks. No dependencies (except JSZip). Just pure web technologies.
