/* DSA Array Visualizer logic - isolated (uses variable `a`) */
/* Save as script.js in same folder. It will attach to the block pasted in index.html. */

(() => {
  // DOM refs
  const valEl = document.getElementById('dav-value');
  const idxEl = document.getElementById('dav-index');
  const insertBtn = document.getElementById('dav-insert');
  const deleteBtn = document.getElementById('dav-delete');
  const searchBtn = document.getElementById('dav-search');
  const updateBtn = document.getElementById('dav-update');
  const viz = document.getElementById('dav-visualizer');

  // core array variable as you asked
  let a = [];      // each element: { id: number, v: string }
  let _id = 1;

  // render helper
  function render(highlightId = null, animateInsertId = null) {
    // clear
    viz.innerHTML = '';
    // create nodes
    a.forEach((el, i) => {
      const node = document.createElement('div');
      node.className = 'dav-item';
      node.dataset.id = el.id;
      if (animateInsertId && el.id === animateInsertId) node.classList.add('dav-anim-in');
      if (highlightId && el.id === highlightId) node.classList.add('found');
      node.innerHTML = `<div class="dav-value">${escapeHtml(el.v)}</div><div class="dav-index">${i}</div>`;
      viz.appendChild(node);
    });
    // ensure last inserted visible
    if (animateInsertId) {
      const elNode = viz.querySelector(`.dav-item[data-id="${animateInsertId}"]`);
      if (elNode) elNode.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  }

  // basic escape
  function escapeHtml(s){
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // validations
  function validIndexForInsert(i){
    return Number.isInteger(i) && i >= 0 && i <= a.length;
  }
  function validIndexExist(i){
    return Number.isInteger(i) && i >= 0 && i < a.length;
  }

  // Insert
  function insertAtIndex(val, idx) {
    const i = Number(idx);
    if (!validIndexForInsert(i)) {
      alert(`Invalid index for insert. Allowed: 0 to ${a.length}`);
      return;
    }
    const node = { id: _id++, v: String(val) };
    a.splice(i, 0, node);
    render(null, node.id);
  }

  // Delete
  function deleteAtIndex(idx) {
    const i = Number(idx);
    if (!validIndexExist(i)) {
      alert(`Invalid index for delete. Allowed: 0 to ${Math.max(0, a.length - 1)}`);
      return;
    }
    const idToRemove = a[i].id;
    // animate out if exists in DOM
    const domNode = viz.querySelector(`.dav-item[data-id="${idToRemove}"]`);
    if (domNode) {
      domNode.classList.add('dav-anim-out');
      // remove from data immediately so indexes update visually after deletion
      a.splice(i, 1);
      setTimeout(() => render(), 220);
    } else {
      a.splice(i,1);
      render();
    }
  }

  // Search (highlight first match)
  function searchValue(val) {
    if (a.length === 0) { alert('Array is empty'); return; }
    const found = a.find(el => el.v === String(val));
    if (!found) { alert('Value not found'); return; }
    render(found.id);
    // clear highlight after short time
    setTimeout(() => render(), 1400);
  }

  // Update
  function updateAtIndex(val, idx) {
    const i = Number(idx);
    if (!validIndexExist(i)) {
      alert(`Invalid index for update. Allowed: 0 to ${Math.max(0, a.length - 1)}`);
      return;
    }
    a[i].v = String(val);
    const updatedId = a[i].id;
    render(updatedId);
    setTimeout(() => render(), 700);
  }

  // Bindings
  insertBtn.addEventListener('click', () => {
    const v = valEl.value.trim();
    const idxRaw = idxEl.value;
    if (v === '' || idxRaw === '') { alert('Provide both value and index for insert.'); return; }
    const idx = Number(idxRaw);
    if (isNaN(idx)) { alert('Invalid index'); return; }
    insertAtIndex(v, idx);
    valEl.value = '';
    idxEl.value = '';
    valEl.focus();
  });

  deleteBtn.addEventListener('click', () => {
    const idxRaw = idxEl.value;
    if (idxRaw === '') { alert('Provide index to delete.'); return; }
    const idx = Number(idxRaw);
    if (isNaN(idx)) { alert('Invalid index'); return; }
    deleteAtIndex(idx);
    idxEl.value = '';
    valEl.focus();
  });

  searchBtn.addEventListener('click', () => {
    const v = valEl.value.trim();
    if (v === '') { alert('Provide value to search.'); return; }
    searchValue(v);
  });

  updateBtn.addEventListener('click', () => {
    const v = valEl.value.trim();
    const idxRaw = idxEl.value;
    if (v === '' || idxRaw === '') { alert('Provide both value and index to update.'); return; }
    const idx = Number(idxRaw);
    if (isNaN(idx)) { alert('Invalid index'); return; }
    updateAtIndex(v, idx);
    valEl.value = '';
    idxEl.value = '';
    valEl.focus();
  });

  // keyboard: Enter on inputs triggers Insert
  valEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') insertBtn.click(); });
  idxEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') insertBtn.click(); });

  // initial render (empty)
  render();
})();
