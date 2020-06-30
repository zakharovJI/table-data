export default class BrandTableRowEditableCell {
  constructor(el) {
    this.parentClassName = 'brand-table-row-editable-cell'
    this.block = el;
    this.text = this.block.querySelector(`.${this.parentClassName}__text`);
    this.input = this.block.querySelector(`.${this.parentClassName}__field`);
    this.cellType = this.block.getAttribute('data-cell-type');
    this.parentId = this.block.closest('[id]').getAttribute('id');

    this.__init__();
  }

  __init__() {
    this.bindEventListener();
  }

  bindEventListener() {
    this.block.addEventListener('dblclick', () => {
      this.block.classList.add(`${this.parentClassName}_state-edit`)
    });

    this.input.addEventListener('blur', (e) => {
      this.text.textContent = e.target.value;
      this.block.classList.remove(`${this.parentClassName}_state-edit`);
      this.updateTableData(e.target.value);
    })

    this.input.addEventListener('keydown', (e) => {
      if(e.keyCode === 13){
        this.text.textContent = e.target.value;
        this.block.classList.remove(`${this.parentClassName}_state-edit`);
        this.updateTableData(e.target.value);
      }
    })
  }

  updateTableData(value) {
    const tableData = window.localStorage.getObj('tableItems');

    tableData.map(item => {
      item.id == this.parentId ? item[this.cellType] = value : item
    });

    window.localStorage.setObj('tableItems', tableData);
  }
}