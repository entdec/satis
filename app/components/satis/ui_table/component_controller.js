import ApplicationController from "../../../../frontend/controllers/application_controller"

/***
 * Table controller
 */
export default class extends ApplicationController {
  static targets = ["wrapper", "head", "body", "header", "pagination", "filters", "filter", "filterReset", "filterToggle", "queryClear", "queryInput", "recordCount", "pageSelector"];
  static values = { persist: Boolean, url: String }

  connect() {
    const self = this;

    this.keyBase = "table_" + this.context.scope.element.id;

    // For now lets not remember the page you where on and simply start at 1
    // this.currentPage = this.getValue('page') || 1;
    this.currentPage = 1;

    this.pageSize = 50;
    this.orderField = null;
    this.orderDirection = 'asc'
    this.queryValue = this.getValue('queryInput');

    setTimeout(function () {
      self.setFiltersValues();
      self.fetch();
    }, 200)
  }

  next(event) {
    const self = this;
    self.currentPage += 1;
    if (self.currentPage > self.nrOfPages) {
      self.currentPage = self.nrOfPages;
    }
    self.fetch();
  }

  previous(event) {
    const self = this;
    self.currentPage -= 1;
    if (self.currentPage == 0) {
      self.currentPage = 1;
    }
    self.fetch();
  }

  selectPage(event) {
    this.currentPage = this.pageSelectorTarget.value;

    // deactivate the dropdown
    this.pageSelectorTarget.blur();

    this.fetch();
  }

  search(event) {
    this.updateQueryClear();
    if (event.code === "Enter" || event.code == "NumpadEnter") {
      this.currentPage = 1;
      this.fetch();
    }
  }

  clearSearch(event) {
    this.queryValue = '';
    this.currentPage = 1;
    this.fetch();

    event.stopPropagation()
    event.preventDefault()
    return false
  }

  toggleFilters(event) {
    this.filtersTarget.classList.toggle('hidden')

    event.stopPropagation()
    event.preventDefault()
    return false
  }

  // private

  updateQueryClear() {
    this.queryClearTarget.classList.toggle('hidden', this.queryValue == '');
  }

  set currentPage(value) {
    this._currentPage = value;
    this.storeValue('page', value);
  }

  get currentPage() {
    return this._currentPage;
  }

  set queryValue(value) {
    this.queryInputTarget.value = value
  }

  get queryValue() {
    this.storeValue('queryInput', this.queryInputTarget.value);
    return this.queryInputTarget.value;
  }

  storeValue(key, value) {
    if (typeof (Storage) !== "undefined") {
      sessionStorage.setItem(this.keyBase + '_' + key, value);
    }
  }

  getValue(key) {
    if (typeof (Storage) !== "undefined") {
      return sessionStorage.getItem(this.keyBase + '_' + key);
    }
  }

  fetch() {
    const self = this;
    let request = new XMLHttpRequest();
    let url = this.urlValue

    request.open('GET', url + '?' + this.determineQueryString(), true);
    this.updateQueryClear();
    self.bodyTarget.innerHTML = '<tr><td colspan="99" class="centered"><i class="far fa-spinner fa-spin fa-lg"></i></td></td>';
    self.recordCountTarget.classList.add('hidden');
    self.paginationTarget.classList.add('hidden');

    request.onload = function () {
      if (this.status >= 200 && this.status < 400) {
        self.render(JSON.parse(this.response));
      } else {
        self.bodyTarget.innerHTML = '<tr><td colspan="99" class="centered">Error retrieving entries</i></td></td>';
      }
    };

    request.onerror = function (error) {
      console.log('Actiontable error', error);
    };

    request.send();
  }

  export(event) {
    let url = this.data.get('url')
    window.location.replace(url + '/export.xlsx?' + this.determineQueryString());

    event.stopPropagation()
    event.preventDefault()
    return false
  }

  determineQueryString() {
    var parameters = Object.assign({}, JSON.parse(this.data.get('parameters')));
    parameters.page = this.currentPage;
    parameters.page_size = this.pageSize;

    if (this.orderField) {
      parameters.order_field = this.orderField;
      parameters.order_direction = this.orderDirection;
    }

    if (this.queryValue) {
      parameters.query = this.queryValue;
    }

    this.filterToggleTarget.classList.remove('active')
    this.filterResetTarget.classList.add('hidden')

    this.filterTargets.forEach(filter => {
      let parameter_name = filter.attributes['data-parameter'].value;
      let value = this.getValue(parameter_name);

      if (value == '' || value == undefined) {
        return
      }

      this.filterToggleTarget.classList.add('active')
      this.filterResetTarget.classList.remove('hidden')
      parameters[parameter_name] = value
    });

    return Object.keys(parameters).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key])
    }).join('&');
  }

  updateFilters() {
    this.filterTargets.forEach(filter => {
      let parameter_name = filter.attributes['data-parameter'].value;
      let value = $(filter).val();
      if (filter.multiple) {
        value = value.join(',')
      }

      this.storeValue(parameter_name, value);
    });
    this.filtersTarget.classList.add('hidden')
    this.fetch();
  }

  resetFilters() {
    this.filterTargets.forEach(filter => {
      let parameter_name = filter.attributes['data-parameter'].value;
      this.storeValue(parameter_name, '');
      this.setFilterValue(filter, '');
    });
    this.filtersTarget.classList.add('hidden')
    this.fetch();
  }

  setFiltersValues() {
    const self = this;

    this.filterTargets.forEach(filter => {
      let parameter_name = filter.attributes['data-parameter'].value;
      let parameter_value = this.getValue(parameter_name);

      if (parameter_value == undefined || parameter_value == '') {
        return;
      }
      self.setFilterValue(filter, parameter_value);
    });
  }

  setFilterValue(filter, parameter_value) {
    if (filter.multiple) {
      parameter_value = parameter_value.split(',')
    }
    let fancySelectController = this.application.getControllerForElementAndIdentifier(filter, "fancy-select");
    let dateRangeController = this.application.getControllerForElementAndIdentifier(filter, "date-range");
    if (fancySelectController != undefined) {
      fancySelectController.setValue(parameter_value);
    } else if (dateRangeController != undefined) {
      dateRangeController.setValue(parameter_value);
    } else {
      $(filter).val(parameter_value);
    }
  }

  reorder(event) {
    let th = event.target;
    this.orderField = th.getAttribute('data-satis-table-column-number');
    this.orderDirection = event.detail.orderDirection;
    this.fetch();
  }

  render(data) {
    const self = this;
    if (!this.hasHeaderTarget) {
      this.renderHeader(data);
    }
    this.renderBody(data);

    this.renderFooter(data);
  }

  renderHeader(data) {
    const self = this;

    let tr = document.createElement("tr");
    let count = 0;
    for (let column of self.columns(data)) {
      let th = document.createElement("th");
      if (column.sortable) {
        th.setAttribute('data-controller', 'satis-table-column');
        th.setAttribute('data-satis-table-column-number', count);
        th.setAttribute('data-satis-table-column-direction', column.sort_direction);
        th.setAttribute('data-satis-table-target', 'header');
        th.setAttribute('data-action', 'click->table-column#changeDirection');
        th.classList.add('sortable')
      }
      th.innerText = column.title;
      tr.appendChild(th);
      count += 1;
    }
    self.headTarget.appendChild(tr);
  }

  renderBody(data) {
    const self = this;

    self.bodyTarget.innerHTML = '';
    for (let row of data.data) {
      let tr = document.createElement("tr");
      tr.setAttribute('data-controller', 'link');
      if (row['link']) {
        tr.classList.add('link');
        tr.setAttribute('data-link-url', row['link']);
        tr.setAttribute('data-action', 'click->link#openUrl');
      }
      if (row['context_menu']) {
        tr.setAttribute('data-context-menu-items', JSON.stringify(row['context_menu']));
      }
      for (let column of self.columns()) {
        let td = document.createElement("td");
        td.innerHTML = row[column.data];
        tr.appendChild(td);
      }
      self.bodyTarget.appendChild(tr);
    }
    if (data.data.length == 0) {
      self.bodyTarget.innerHTML = '<tr><td colspan="99" class="centered">No entries found</i></td></td>';
    }
  }

  renderFooter(data) {
    this.renderRecordCount(data);
    this.renderPagination(data)
  }

  renderPagination(data) {
    this.paginationTarget.classList.remove('hidden');
    const self = this;

    self.recordsTotal = data.recordsTotal;
    self.recordsFiltered = data.recordsFiltered;
    self.nrOfPages = Math.ceil(self.recordsFiltered / self.pageSize);
    if (self.nrOfPages < 1) {
      self.nrOfPages = 1;
    }

    let current = this.paginationTarget.getElementsByClassName('current-page')[0];
    current.innerHTML = this.currentPage
    let total = this.paginationTarget.getElementsByClassName('total-pages')[0];
    total.innerHTML = this.nrOfPages

    let currentPageSelector = this.paginationTarget.getElementsByClassName('current-page-selector')[0];
    let options = ''
    for (var i = 1; i <= this.nrOfPages; i++) {
      if (this.currentPage == i) {
        options += '<option selected="selected">' + i + '</option>'
      } else {
        options += '<option>' + i + '</option>'
      }
    }
    currentPageSelector.innerHTML = options

    if (self.nrOfPages > 3) {
      current.classList.add('hidden');
      currentPageSelector.classList.remove('hidden');
    } else {
      current.classList.remove('hidden');
      currentPageSelector.classList.add('hidden');
    }

    let previous = this.paginationTarget.getElementsByClassName('previous')[0];
    if (self.currentPage < 2) {
      previous.classList.add('hidden');
    } else {
      previous.classList.remove('hidden');
    }

    let next = this.paginationTarget.getElementsByClassName('next')[0];
    if (self.nrOfPages == self.currentPage) {
      next.classList.add('hidden');
    } else {
      next.classList.remove('hidden');
    }
  }

  renderRecordCount(data) {
    this.recordCountTarget.classList.remove('hidden');

    let recordsStart = ((this.currentPage - 1) * this.pageSize) + 1;
    let recordsEnd = this.currentPage * this.pageSize;
    if (data.recordsFiltered < recordsEnd) {
      recordsEnd = data.recordsFiltered;
    }
    if (recordsEnd == 0) {
      recordsStart = 0;
    }

    let start = this.recordCountTarget.getElementsByClassName('start')[0];
    let end = this.recordCountTarget.getElementsByClassName('end')[0];
    let filtered = this.recordCountTarget.getElementsByClassName('total-filtered')[0];
    let total = this.recordCountTarget.getElementsByClassName('total-total')[0];
    let filter = this.recordCountTarget.getElementsByClassName('filter')[0];

    start.innerHTML = recordsStart;
    end.innerHTML = recordsEnd;
    filtered.innerHTML = data.recordsFiltered;
    total.innerHTML = data.recordsTotal;

    if (data.recordsFiltered === data.recordsTotal) {
      filter.classList.add('hidden');
    } else {
      filter.classList.remove('hidden');
    }
  }

  columns(data) {
    if (this._columns == undefined) {
      this._columns = JSON.parse(data.columns);
    }
    return this._columns;
  }

  disconnect() {
  }
}
