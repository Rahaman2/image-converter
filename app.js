// State management
let imageData = [];
let currentQuality = 80;

// DOM elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const imagesContainer = document.getElementById('imagesContainer');
const downloadSection = document.getElementById('downloadSection');
const downloadAllBtn = document.getElementById('downloadAllBtn');

// Initialize app
function init() {
    checkWebPSupport();
    setupEventListeners();
}

// Check if browser supports WebP
function checkWebPSupport() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const supported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;

    if (!supported) {
        alert('Your browser does not support WebP format. Please use a modern browser like Chrome, Firefox, or Edge.');
    }
}

// Setup event listeners
function setupEventListeners() {
    // File input
    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    // Paste from clipboard
    document.addEventListener('paste', handlePaste);

    // Quality slider
    qualitySlider.addEventListener('input', handleQualityChange);

    // Download button
    downloadAllBtn.addEventListener('click', downloadAllAsZip);
}

// Handle file selection
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
    fileInput.value = ''; // Reset input
}

// Handle drag over
function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
}

// Handle drag leave
function handleDragLeave(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
}

// Handle drop
function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

// Handle paste from clipboard
function handlePaste(e) {
    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter(item => item.type.indexOf('image') !== -1);

    if (imageItems.length > 0) {
        e.preventDefault();
        const files = imageItems.map(item => item.getAsFile());
        processFiles(files);
    }
}

// Process files
function processFiles(files) {
    const pngFiles = files.filter(file => {
        if (file.type === 'image/png') {
            return true;
        } else {
            showError(`"${file.name}" is not a PNG file and was skipped.`);
            return false;
        }
    });

    if (pngFiles.length === 0) return;

    pngFiles.forEach(file => {
        const imageId = Date.now() + Math.random();
        const imageObj = {
            id: imageId,
            file: file,
            name: file.name,
            originalSize: file.size,
            originalBlob: file,
            convertedBlob: null,
            convertedSize: 0
        };

        imageData.push(imageObj);
        convertImage(imageObj);
    });
}

// Convert image to WebP
async function convertImage(imageObj) {
    try {
        const img = new Image();
        const objectUrl = URL.createObjectURL(imageObj.file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                imageObj.convertedBlob = blob;
                imageObj.convertedSize = blob.size;
                renderImageCard(imageObj);
                updateDownloadButton();
            }, 'image/webp', currentQuality / 100);
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            showError(`Failed to load image: ${imageObj.name}`);
        };

        img.src = objectUrl;
    } catch (error) {
        showError(`Error converting ${imageObj.name}: ${error.message}`);
    }
}

// Re-convert all images with new quality
function reconvertAllImages() {
    imageData.forEach(imageObj => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(imageObj.file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                imageObj.convertedBlob = blob;
                imageObj.convertedSize = blob.size;
                updateImageCard(imageObj);
            }, 'image/webp', currentQuality / 100);
        };

        img.src = objectUrl;
    });
}

// Handle quality change
function handleQualityChange(e) {
    currentQuality = parseInt(e.target.value);
    qualityValue.textContent = `${currentQuality}%`;

    if (imageData.length > 0) {
        reconvertAllImages();
    }
}

// Render image card
function renderImageCard(imageObj) {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.dataset.id = imageObj.id;

    const originalUrl = URL.createObjectURL(imageObj.originalBlob);
    const convertedUrl = URL.createObjectURL(imageObj.convertedBlob);

    const savings = ((imageObj.originalSize - imageObj.convertedSize) / imageObj.originalSize * 100).toFixed(1);
    const savingsColor = savings > 0 ? '#34d399' : '#ef4444';

    card.innerHTML = `
        <div class="image-filename">${imageObj.name}</div>
        <div class="comparison-view">
            <div class="image-side">
                <div class="image-label">Original PNG</div>
                <img src="${originalUrl}" alt="Original" class="image-preview">
            </div>
            <div class="image-side">
                <div class="image-label">Converted WebP</div>
                <img src="${convertedUrl}" alt="Converted" class="image-preview">
            </div>
        </div>
        <div class="size-info">
            <span class="size-original">${formatFileSize(imageObj.originalSize)}</span>
            <span class="size-arrow">→</span>
            <span class="size-converted">${formatFileSize(imageObj.convertedSize)}</span>
            <span class="size-savings" style="color: ${savingsColor}">
                ${savings > 0 ? '-' : '+'}${Math.abs(savings).toFixed(1)}%
            </span>
        </div>
    `;

    imagesContainer.appendChild(card);
}

// Update existing image card
function updateImageCard(imageObj) {
    const card = document.querySelector(`[data-id="${imageObj.id}"]`);
    if (!card) return;

    const convertedUrl = URL.createObjectURL(imageObj.convertedBlob);
    const convertedImg = card.querySelector('.image-side:nth-child(2) img');

    // Revoke old URL
    URL.revokeObjectURL(convertedImg.src);
    convertedImg.src = convertedUrl;

    // Update size info
    const sizeInfo = card.querySelector('.size-info');
    const savings = ((imageObj.originalSize - imageObj.convertedSize) / imageObj.originalSize * 100).toFixed(1);
    const savingsColor = savings > 0 ? '#34d399' : '#ef4444';

    sizeInfo.innerHTML = `
        <span class="size-original">${formatFileSize(imageObj.originalSize)}</span>
        <span class="size-arrow">→</span>
        <span class="size-converted">${formatFileSize(imageObj.convertedSize)}</span>
        <span class="size-savings" style="color: ${savingsColor}">
            ${savings > 0 ? '-' : '+'}${Math.abs(savings).toFixed(1)}%
        </span>
    `;
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Update download button visibility
function updateDownloadButton() {
    const allConverted = imageData.every(img => img.convertedBlob !== null);
    if (allConverted && imageData.length > 0) {
        downloadSection.style.display = 'block';
    }
}

// Download all as ZIP
async function downloadAllAsZip() {
    if (imageData.length === 0) return;

    try {
        downloadAllBtn.disabled = true;
        downloadAllBtn.innerHTML = '<span class="loading"></span> Creating ZIP...';

        const zip = new JSZip();

        imageData.forEach(imageObj => {
            const filename = imageObj.name.replace(/\.png$/i, '.webp');
            zip.file(filename, imageObj.convertedBlob);
        });

        const content = await zip.generateAsync({ type: 'blob' });

        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted-images-${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        downloadAllBtn.disabled = false;
        downloadAllBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download All as ZIP
        `;
    } catch (error) {
        showError(`Error creating ZIP: ${error.message}`);
        downloadAllBtn.disabled = false;
        downloadAllBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download All as ZIP
        `;
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const container = document.querySelector('.container');
    container.insertBefore(errorDiv, container.firstChild);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);
