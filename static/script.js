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

function handleCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n');
        
        rows.forEach((row, index) => {
            if (row.trim() === '' || (index === 0 && row.toLowerCase().includes('name'))) return;
            const cols = row.split(',');
            if (cols.length >= 2) {
                let firstInput = document.querySelector('input[name="name[]"]');
                if (index === 1 && firstInput && firstInput.value === '') {
                    firstInput.parentElement.remove();
                }
                addField(cols[0].trim(), cols[1].trim());
            }
        });
    };
    reader.readAsText(file);
    event.target.value = ''; 
}

let draggedInfo = null;

function drag(event) { 
    draggedInfo = event.currentTarget; 
    event.currentTarget.closest('.seat-card').classList.add('dragging'); 
}

function allowDrop(event) { event.preventDefault(); }
function dragEnter(event) { event.preventDefault(); event.currentTarget.classList.add('drag-over'); }
function dragLeave(event) { event.currentTarget.classList.remove('drag-over'); }

/* UPGRADED DROP FUNCTION */
function drop(event) {
    event.preventDefault();
    let targetCard = event.currentTarget.closest('.seat-card');
    targetCard.classList.remove('drag-over');

    if (draggedInfo && draggedInfo !== targetCard.querySelector('.student-info')) {
        let sourceCard = draggedInfo.closest('.seat-card');
        let targetInfo = targetCard.querySelector('.student-info');
        
        // Swap DOM elements
        sourceCard.appendChild(targetInfo);
        targetCard.appendChild(draggedInfo);

        // Make sure the CSS class reflects the new state
        if (targetInfo.innerHTML.trim() === "") {
            sourceCard.classList.add("empty-seat");
            targetInfo.removeAttribute("draggable");
        } else {
            sourceCard.classList.remove("empty-seat");
            targetInfo.setAttribute("draggable", "true");
        }

        if (draggedInfo.innerHTML.trim() === "") {
            targetCard.classList.add("empty-seat");
            draggedInfo.removeAttribute("draggable");
        } else {
            targetCard.classList.remove("empty-seat");
            draggedInfo.setAttribute("draggable", "true");
        }
    }
    
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
}

/* ZOOM LOGIC */
let currentZoom = 1.0;
function zoomIn() { currentZoom += 0.15; applyZoom(); }
function zoomOut() { if (currentZoom > 0.4) { currentZoom -= 0.15; applyZoom(); } }
function resetZoom() { currentZoom = 1.0; applyZoom(); }
function applyZoom() { document.getElementById("capture").style.transform = `scale(${currentZoom})`; }

function toggleTheme(){
    let body = document.body;
    let icon = document.getElementById("themeIcon");
    if(body.classList.contains("light")){ body.classList.replace("light","dark"); icon.innerText = "light_mode"; }
    else { body.classList.replace("dark","light"); icon.innerText = "dark_mode"; }
}

function showLoading(){ document.getElementById("loading").style.display = "block"; }

function downloadImage(){
    resetZoom(); 
    setTimeout(() => {
        const captureDiv = document.getElementById("capture");
        const isDark = document.body.classList.contains("dark");
        const bgColor = isDark ? "#121418" : "#f0f4fa"; 

        html2canvas(captureDiv, { backgroundColor: bgColor, scale: 2, borderRadius: 24 }).then(canvas => {
            let link = document.createElement("a");
            link.download = "seating_arrangement.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    }, 300); 
}