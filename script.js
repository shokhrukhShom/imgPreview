document.getElementById('fileInput').addEventListener('change', handleFileSelect);

// Array to store selected files
let fileArray = [];

// Handle file selection and preview generation
function handleFileSelect(event) {
    const files = event.target.files;
    const imageContainer = document.getElementById('imageContainer');

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        fileArray.push(file);  // Add file to the custom file array
        const reader = new FileReader();

        reader.onload = (function(theFile, index) {
            return function(e) {
                const imageWrapper = document.createElement('div');
                imageWrapper.className = 'image-wrapper';
                imageWrapper.draggable = true;
                imageWrapper.setAttribute('data-index', index);  // Set initial data-index

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = theFile.name;

                const removeButton = document.createElement('button');
                removeButton.className = 'remove-btn';
                removeButton.innerHTML = 'X';
                removeButton.addEventListener('click', function() {
                    const fileIndex = parseInt(imageWrapper.getAttribute('data-index'));
                    fileArray.splice(fileIndex, 1);  // Remove file from the array
                    imageContainer.removeChild(imageWrapper);  // Remove from DOM
                    updateIndices();
                    updateFileArray();
                });

                imageWrapper.appendChild(img);
                imageWrapper.appendChild(removeButton);
                imageContainer.appendChild(imageWrapper);

                addDragAndDropHandlers(imageWrapper);
                updateIndices();
            };
        })(file, fileArray.length - 1);

        reader.readAsDataURL(file);
    }
}

// Add drag-and-drop event handlers to the element
function addDragAndDropHandlers(element) {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragend', handleDragEnd);
}

let dragSrcEl = null;

function handleDragStart(e) {
    dragSrcEl = this;  // Set the source element being dragged
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);

    this.classList.add('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();  // Necessary for allowing a drop
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (this !== dragSrcEl) {
        this.classList.add('over');  // Highlight potential drop target
    }
}

function handleDragLeave(e) {
    this.classList.remove('over');  // Remove highlight
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();  // Prevent default behavior
    }

    if (dragSrcEl !== this) {
        const parent = this.parentNode;

        // Reorder elements in the DOM
        if (dragSrcEl.nextSibling === this) {
            parent.insertBefore(this, dragSrcEl);
        } else if (this.nextSibling === dragSrcEl) {
            parent.insertBefore(dragSrcEl, this);
        } else {
            parent.insertBefore(dragSrcEl, this.nextSibling);
            parent.insertBefore(this, dragSrcEl);
        }

        // Update data-index attributes and fileArray
        updateIndices();
        updateFileArray();
    }
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    const items = document.querySelectorAll('.image-wrapper');
    items.forEach(function(item) {
        item.classList.remove('over');
    });
}

// Update data-index attributes of all image wrappers
function updateIndices() {
    const items = document.querySelectorAll('.image-wrapper');
    items.forEach((item, index) => {
        item.setAttribute('data-index', index);
    });
}

// Update fileArray to match the current DOM order
function updateFileArray() {
    const items = document.querySelectorAll('.image-wrapper');
    
    const newArray = Array.from(items).map(item => {
        const index = parseInt(item.getAttribute('data-index'));
        return fileArray[index];
    });
    fileArray = [];  // Clear the array
    Array.prototype.push.apply(fileArray, newArray);  // Update with new order
    console.log("Updated fileArray:", fileArray.map(file => file.name));
}

// Debugging function for sanity checks
function sanityCheck() {
    console.log("File order:");
    fileArray.forEach((file, index) => {
        console.log(`${index + 1}: ${file.name}`);
    });
}

// Bind the sanity check to a button click for easy testing
document.getElementById('sanityCheckButton').addEventListener('click', sanityCheck);
