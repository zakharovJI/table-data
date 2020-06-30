import style from "./assets/styles/main.scss";
import "./assets/icons/icons";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import BrandTableRowEditableCell from "./components/BrandTableRowEditableCell/BrandTableRowEditableCell";
import BrandTableRow from "./components/BrandTableRow/BrandTableRow";

window.brandTableRowList = []

Storage.prototype.setObj = function(key, obj) {
  return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
  return JSON.parse(this.getItem(key))
}


document.querySelectorAll('.brand-table-row').forEach(el => {
  window.brandTableRowList.push(new BrandTableRow(el));
})

document.querySelectorAll('.control-panel').forEach(el => {
  new ControlPanel(el);
})

