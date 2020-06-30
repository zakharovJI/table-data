import BrandTableRowEditableCell from "../BrandTableRowEditableCell/BrandTableRowEditableCell";
import Pickr from '@simonwep/pickr/dist/pickr.es5.min';

export default class BrandTableRow {
  constructor(el) {
    this.parentClassName = 'brand-table-row';
    this.block = el;
    this.deleteButton = this.block.querySelector(`.${this.parentClassName}__background`);
    this.colorText = this.block.querySelector('[data-color]');
    this.id = this.block.getAttribute('id');
    this.editableCellList = [];
    this.colorPicker = null;
    this.dragSourceElement = null;

    this.__init__();
  }

  __init__() {
    this.bindEditableCells();
    this.bindEventListeners();
    this.initColorPicker();
  }

  initColorPicker() {
    this.colorPicker = Pickr.create({
      el: '.color-picker',
      theme: 'classic',
      default: this.colorText.getAttribute('data-color'),

      components: {

        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
          hex: true,
          cmyk: true,
          rgba: true,
          input: true,
          save: true
        }
      }
    });

    this.colorPicker.on('save', (color, instance) => {
      if (color.toHEXA().toString().length !== 7) {
        this.colorPicker.setColor(color.toHEXA().toString().slice(0, 7));
        return;
      }
      this.colorText.setAttribute('data-color', color.toHEXA().toString());
      this.updateColorText();
      this.updateTableData(color.toHEXA().toString());

    });

  }

  updateTableData(value) {
    const tableData = window.localStorage.getObj('tableItems');

    tableData.map(item => {
      item.id == this.id ? item.color = value : item
    });

    window.localStorage.setObj('tableItems', tableData);
  }

  updateColorText() {
    const invertColor = (hex) => {
      const padZero = (str, len) => {
        len = len || 2;
        const zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
      }

      if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
      }
      // convert 3-digit hex to 6-digits.
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
      }
      // invert color components
      const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
      // pad each with zeros and return
      return '#' + padZero(r) + padZero(g) + padZero(b);
    }
    const color = this.colorText.getAttribute('data-color');

    this.colorText.innerText = color;
    this.colorText.style.color = invertColor(color);
  }

  bindEditableCells() {
    this.block.querySelectorAll('.brand-table-row-editable-cell').forEach(el => {
      this.editableCellList.push(new BrandTableRowEditableCell(el));
    })
  }

  bindEventListeners() {
    this.block.addEventListener('contextmenu', (e) => {
      e.preventDefault();

      if (this.block.classList.contains(`${this.parentClassName}_context`)) {
        this.block.classList.remove(`${this.parentClassName}_context`)
      } else {
        this.block.classList.add(`${this.parentClassName}_context`)
      }
    });

    this.deleteButton.addEventListener('click', () => {
      const tableData = window.localStorage.getObj('tableItems');
      console.log(this.id)

      window.brandTableRowList = window.brandTableRowList.filter(x => x !== this);
      this.block.parentNode.removeChild(this.block);
      window.localStorage.setObj('tableItems', tableData.filter(x => x.id != this.id))
    });

    this.block.addEventListener('dragstart', e => {
      window.dragSourceElement = this.block;

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.block.innerHTML);
    });

    this.block.addEventListener('dragover', e => {
      if (e.preventDefault) {
        e.preventDefault();
      }

      e.dataTransfer.dropEffect = 'move';
      this.block.classList.add(`${this.parentClassName}_over`);
    });

    this.block.addEventListener('dragleave', e => {
      this.block.classList.remove(`${this.parentClassName}_over`);
    });

    this.block.addEventListener('dragend', e => {
      this.block.classList.remove(`${this.parentClassName}_over`);
    });

    this.block.addEventListener('drop', e => {
      if (e.stopPropagation) {
        e.stopPropagation();
      }

      if (window.dragSourceElement !== this.block) {
        window.dragSourceElement.innerHTML = this.block.innerHTML;
        this.block.innerHTML = e.dataTransfer.getData('text/html');
        this.block.classList.remove(`${this.parentClassName}_over`);

        const tableData = window.localStorage.getObj('tableItems');
        const newTable = this.swapArrayElements(tableData,
          tableData.indexOf(tableData.find(x => x.id == window.dragSourceElement.id)),
          tableData.indexOf(tableData.find(x => x.id == this.id)));

        window.localStorage.setObj('tableItems', newTable);

        console.log(this.id, window.dragSourceElement.id);

        this.block.setAttribute('id', window.dragSourceElement.id);
        window.dragSourceElement.id = this.id;
        this.id = this.block.getAttribute('id');

        this.block.querySelectorAll('.brand-table-row-editable-cell').forEach(el => {
          this.editableCellList.push(new BrandTableRowEditableCell(el));
        });
        window.dragSourceElement.querySelectorAll('.brand-table-row-editable-cell').forEach(el => {
          this.editableCellList.push(new BrandTableRowEditableCell(el));
        });
      }
    });
  }

  swapArrayElements(list, iA, iB){
    [list[iA], list[iB]] = [list[iB], list[iA]];
    return list;
  }
}