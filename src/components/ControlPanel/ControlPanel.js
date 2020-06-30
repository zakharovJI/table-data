import BrandTableRow from "../../components/BrandTableRow/BrandTableRow";

export default class ControlPanel {
  constructor(el) {
    this.parentClassName = 'control-panel';
    this.block = el;
    this.brandTableRowList = window.brandTableRowList;
    this.table = document.querySelector('.main-table');
    this.floatingBtn = document.querySelector(`.${this.parentClassName}__floating-btn`);
    this.tableBody = this.table.querySelector('.brand-table__body');
    this.rowKeys = ['name', 'type', 'color'];

    this.__init__();
  }

  __init__() {
    this.createTable();
    this.bindEventListener();
  }

  bindEventListener() {
    this.floatingBtn.addEventListener('click', () => {
      this.createTableRow();
    })
  }

  createTable() {
    const tableItems = window.localStorage.getObj('tableItems');

    if (tableItems) {
      tableItems.forEach(item => {
        this.createTableRow(item, false);
      })
    } else {
      window.localStorage.setObj('tableItems', []);
    }
  }

  invertColor(hex) {
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

  createTableRow(item = null, writeToLS = true) {
    const row = document.createElement('div'),
      foreground = document.createElement('div'),
      background = document.createElement('div');

    row.className = 'brand-table-row brand-table__brand-table-row';
    row.setAttribute('draggable', 'true')
    foreground.className = 'brand-table-row__foreground';
    background.className = 'brand-table-row__background';

    this.rowKeys.forEach(key => {
      if (key !== 'color') {
        foreground.innerHTML +=
          `<div class="brand-table-row__data brand-table-row__data_${key}">
                    <div class="brand-table-row-editable-cell brand-table-row-editable-cell_${key}"
                      data-cell-type="${key}"
                    >
                      <div class="brand-table-row-editable-cell__container">
                        <div class="brand-table-row-editable-cell__text"> ${item ? item[key] || '' : ''}
                        </div>
                        <label class="brand-table-row-editable-cell__input">
                          <span class="brand-table-row-editable-cell__label">
                          </span>
                          <input class="brand-table-row-editable-cell__field" value="${item ? item[key] || '' : ''}">
                        </label>
                      </div>
                    </div>
                  </div>`
      } else {
        foreground.innerHTML += `
          <div class="brand-table-row__data brand-table-row__data_color">
            <div class="brand-table-row__text brand-table-row__text_color" data-color="${item ? item[key] || '#f0f0f0' : '#f0f0f0'}"
            style="color: ${item && item[key] ? this.invertColor(item[key]) : '#0f0f0f'}">${item ? item[key] || '#f0f0f0' : '#f0f0f0'}</div>
            <div class="color-picker"></div>
          </div>`
      }
    });


    if (writeToLS) {
      const tableItems = window.localStorage.getObj('tableItems'),
        id = new Date().getUTCMilliseconds();
      window.localStorage.setObj('tableItems', [...tableItems, ...[{
        name: '',
        type: '',
        color: '#f0f0f0',
        id: id
      }]]);

      row.id = id;
    } else {
      row.id = item.id;
    }

    row.appendChild(foreground);
    row.appendChild(background);
    this.tableBody.appendChild(row);
    this.brandTableRowList.push(new BrandTableRow(row));


    // window.localStorage.set

  }

}