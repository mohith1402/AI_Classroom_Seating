// THEME
function toggleTheme() {
    const isDark = document.body.classList.contains("dark");
    applyTheme(isDark ? "light" : "dark");
}

function applyTheme(theme) {
    let icon = document.getElementById("themeIcon");
    if (theme === "dark") {
        document.body.classList.add("dark");
        document.body.classList.remove("light");
        if(icon) icon.innerText = "light_mode";
    } else {
        document.body.classList.add("light");
        document.body.classList.remove("dark");
        if(icon) icon.innerText = "dark_mode";
    }
    localStorage.setItem("theme", theme);
}

// DYNAMIC INPUTS
function addField(nameVal = '', groupVal = '') {
    let div = document.getElementById("inputs");
    let field = document.createElement("div");
    field.className = "row";

    field.innerHTML = `
        <input name="name[]" placeholder="Student Name" required value="${nameVal}">
        <select name="group[]">
            <optgroup label="UG Programs">
                <option>B.Tech CSE</option>
                <option>B.Tech IT</option>
                <option>B.Tech ECE</option>
                <option>B.Tech EEE</option>
                <option>B.Tech Mechanical</option>
                <option>B.Tech Civil</option>
                <option>B.Sc Computer Science</option>
                <option>BCA</option>
                <option>BBA</option>
                <option>B.Com</option>
            </optgroup>
            <optgroup label="PG Programs">
                <option>M.Tech CSE</option>
                <option>M.Tech VLSI</option>
                <option>M.Tech Structural</option>
                <option>MCA</option>
                <option>MBA</option>
                <option>M.Sc Computer Science</option>
            </optgroup>
        </select>
        <button type="button" class="btn-icon" onclick="this.parentElement.remove()" title="Remove student">
            <span class="material-symbols-rounded">close</span>
        </button>
    `;

    if (groupVal) {
        let select = field.querySelector('select');
        for (let option of select.options) {
            if (option.text.trim().toLowerCase() === groupVal.trim().toLowerCase()) {
                option.selected = true; break;
            }
        }
    }
    div.appendChild(field);
}

// CSV
function handleCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n');
        let firstInputReplaced = false;
        
        rows.forEach((row, index) => {
            const cleanRow = row.trim();
            if (cleanRow === '' || (index === 0 && cleanRow.toLowerCase().includes('name'))) return;
            
            const cols = cleanRow.split(',');
            if (cols.length >= 2) {
                if (!firstInputReplaced) {
                    let firstInput = document.querySelector('input[name="name[]"]');
                    if (firstInput && firstInput.value.trim() === '') {
                        firstInput.parentElement.remove();
                    }
                    firstInputReplaced = true;
                }
                addField(cols[0].trim(), cols[1].trim());
            }
        });
    };
    reader.readAsText(file);
    event.target.value = ''; 
}

// DRAG AND DROP
let draggedInfo = null;
function drag(event) { draggedInfo = event.currentTarget; event.currentTarget.closest('.seat-card').classList.add('dragging'); }
function allowDrop(event) { event.preventDefault(); }
function dragEnter(event) { event.preventDefault(); event.currentTarget.classList.add('drag-over'); }
function dragLeave(event) { event.currentTarget.classList.remove('drag-over'); }

function drop(event) {
    event.preventDefault();
    let targetCard = event.currentTarget.closest('.seat-card');
    targetCard.classList.remove('drag-over');

    if (draggedInfo && draggedInfo.parentElement !== targetCard) {
        let sourceCard = draggedInfo.closest('.seat-card');
        let targetInfo = targetCard.querySelector('.student-info');
        
        sourceCard.appendChild(targetInfo);
        targetCard.appendChild(draggedInfo);

        [sourceCard, targetCard].forEach(card => {
            let info = card.querySelector('.student-info');
            if (info && info.querySelector('.name')) {
                card.classList.remove('empty-seat');
                info.setAttribute("draggable", "true");
            } else {
                card.classList.add('empty-seat');
                if (info) info.removeAttribute("draggable");
            }
        });
    }
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    draggedInfo = null;
}

// ZOOM
let currentZoom = 1.0;
function zoomIn() { currentZoom += 0.15; applyZoom(); }
function zoomOut() { if (currentZoom > 0.4) { currentZoom -= 0.15; applyZoom(); } }
function resetZoom() { currentZoom = 1.0; applyZoom(); }
function applyZoom() { document.getElementById("capture").style.transform = `scale(${currentZoom})`; }

function showLoading(){ document.getElementById("loading").style.display = "block"; }

// DOWNLOAD IMAGE
function downloadImage(){
    const captureDiv = document.getElementById("capture");
    const wrapper = document.querySelector(".table-wrapper");
    
    const originalTransform = captureDiv.style.transform;
    const originalOverflow = wrapper.style.overflow;
    
    captureDiv.style.transform = 'none';
    wrapper.style.overflow = 'visible'; 
    
    setTimeout(() => {
        const isDark = document.body.classList.contains("dark");
        const bgColor = isDark ? "#0b0c10" : "#fdfcff"; 

        html2canvas(captureDiv, { 
            backgroundColor: bgColor, 
            scale: 2, 
            useCORS: true,
            logging: false, 
            windowWidth: captureDiv.scrollWidth, 
            windowHeight: captureDiv.scrollHeight 
        }).then(canvas => {
            let link = document.createElement("a");
            link.download = "seating_arrangement.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
            
            captureDiv.style.transform = originalTransform;
            wrapper.style.overflow = originalOverflow;
        });
    }, 150); 
}