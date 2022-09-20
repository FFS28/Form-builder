export class SearchFilters {
    searchTerm = '';
    totalItems = 0;
    pagination = {
        currentPage: 1,
        perPage: 20,
        pageSizes: [20, 50, 100],
        totalPages: 0,
    };
    sorting = {
        fieldName: '',
        isAscending: false,
    };

    formatParams() {
        let params = '';

        if (this.searchTerm) {
            params += `?q=${this.searchTerm}`;
        }

        if (this.sorting.fieldName) {
            params += `${params ? '&' : '?'}sort=${this.sorting.isAscending ? '' : '~'}${this.sorting.fieldName}`;
        }

        if (this.pagination.perPage) {
            const offset = this.pagination.currentPage * this.pagination.perPage - this.pagination.perPage;
            params += `${params ? '&' : '?'}offset=${offset}&limit=${this.pagination.perPage}`
        }

        return params;
    }

    setPerPage(perPage) {
        this.pagination.perPage = perPage;
    }

    setPageSizes(pageSizes) {
        this.pagination.pageSizes = pageSizes;
    }

    setTotalPages(totalCount) {
        this.pagination.totalItems = totalCount;
        this.pagination.totalPages = Math.ceil(totalCount / this.pagination.perPage);
    }
}