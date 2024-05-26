script.js 


```javascript
document.getElementById('fileInput').addEventListener('change', handleFileSelect);

// Array to store the selected files
let fileArray = [];

// Handle file selection
function handleFileSelect(event) {
    const files = event.target.files;
    const imageContainer = document.getElementById('imageContainer');

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        fileArray.push(file); // Add file to the array
        const reader = new FileReader();

        // Load the file and create an image element
        reader.onload = (function(theFile, index) {
            return function(e) {
                const imageWrapper = document.createElement('div');
                imageWrapper.className = 'image-wrapper';
                imageWrapper.draggable = true;

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = theFile.name;

                // Create remove button
                const removeButton = document.createElement('button');
                removeButton.className = 'remove-btn';
                removeButton.innerHTML = 'X';
                removeButton.addEventListener('click', function() {
                    fileArray.splice(index, 1); // Remove file from array
                    imageContainer.removeChild(imageWrapper); // Remove image from DOM
                    updateIndices(); // Update indices after removal
                });

                // Append image and remove button to the wrapper
                imageWrapper.appendChild(img);
                imageWrapper.appendChild(removeButton);
                imageContainer.appendChild(imageWrapper);

                // Add drag-and-drop handlers
                addDragAndDropHandlers(imageWrapper, index);
            };
        })(file, fileArray.length - 1);

        reader.readAsDataURL(file); // Read file as DataURL
    }
}

// Add drag-and-drop event handlers to an element
function addDragAndDropHandlers(element, index) {
    element.setAttribute('data-index', index); // Set index as a data attribute
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragend', handleDragEnd);
}

let dragSrcEl = null;

// Handle the start of dragging
function handleDragStart(e) {
    dragSrcEl = this; // Set the source element being dragged
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML); // Store HTML content

    this.classList.add('dragging'); // Add dragging class for visual feedback
}

// Handle drag over another element
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Allow drop
    }
    e.dataTransfer.dropEffect = 'move'; // Indicate move effect
    return false;
}

// Handle drag entering another element
function handleDragEnter(e) {
    if (this !== dragSrcEl) {
        this.classList.add('over'); // Add over class for visual feedback
    }
}

// Handle drag leaving another element
function handleDragLeave(e) {
    this.classList.remove('over'); // Remove over class
}

// Handle dropping the dragged element
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Prevent default behavior
    }

    if (dragSrcEl !== this) {
        const srcIndex = parseInt(dragSrcEl.getAttribute('data-index'));
        const tgtIndex = parseInt(this.getAttribute('data-index'));

        // Swap the elements in the DOM
        const parent = this.parentNode;
        if (dragSrcEl.nextSibling === this) {
            parent.insertBefore(this, dragSrcEl);
        } else if (this.nextSibling === dragSrcEl) {
            parent.insertBefore(dragSrcEl, this);
        } else {
            parent.insertBefore(dragSrcEl, this.nextSibling);
            parent.insertBefore(this, dragSrcEl);
        }

        // Swap the elements in the fileArray
        [fileArray[srcIndex], fileArray[tgtIndex]] = [fileArray[tgtIndex], fileArray[srcIndex]];

        // Update data-index attributes to reflect new order
        updateIndices();
    }
    return false;
}

// Handle the end of dragging
function handleDragEnd(e) {
    this.classList.remove('dragging'); // Remove dragging class
    const items = document.querySelectorAll('.image-wrapper');
    items.forEach(function(item) {
        item.classList.remove('over'); // Remove over class from all items
    });
}

// Update the data-index attributes of all image wrappers
function updateIndices() {
    const items = document.querySelectorAll('.image-wrapper');
    items.forEach((item, index) => {
        item.setAttribute('data-index', index); // Update data-index attribute
    });
}
```

### Explanation of the Changes

1. **Custom `fileArray`**:
   - Keeps track of the files selected by the user. This array is updated whenever files are added, removed, or rearranged.

2. **Index Tracking**:
   - Each image wrapper element has a `data-index` attribute to store its position in the `fileArray`.

3. **Remove Button**:
   - The remove button's event listener removes the file from the `fileArray` and also removes the image wrapper from the DOM. It then calls `updateIndices` to ensure indices are updated correctly.

4. **Drag-and-Drop**:
   - `handleDragStart`: Initiates the drag operation and sets visual feedback.
   - `handleDragOver`: Allows the dragged element to be dropped.
   - `handleDragEnter`: Provides visual feedback when dragging over another element.
   - `handleDragLeave`: Removes visual feedback when leaving an element.
   - `handleDrop`: Handles the dropping of the dragged element, swaps elements in the DOM and the `fileArray`, and updates the indices.
   - `handleDragEnd`: Cleans up visual feedback after the drag operation ends.
   - `updateIndices`: Updates the `data-index` attributes of all image wrappers to reflect their current order.

With these comments, you should have a clearer understanding of how each part of the code works and how the different functions interact to provide the desired functionality.