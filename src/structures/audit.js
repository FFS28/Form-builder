export class Audit {
	/** @type {number} */
	id = 0;

	/** @type {string} */
	fullName = '';

	/** @type {Date} */
	time = '';

	/** @type {String} */
	action = '';

	/** @type {String} */
	status = '';

	/** @type {String} */
	entity = '';

	/** @type {Number|Null} */
	entityId = '';

	/** @type {String} */
	ipAddress = '';

	/** @type {String} */
	userAgent = '';

	/** @type {String} */
	errorData = '';

	static getFieldMapping() {
		return {
			id: 'id',
			fullName: 'pilns_vards',
			time: 'time',
			action: 'action',
			status: 'status',
			entity: 'entity',
			entityId: 'entity_id',
			ipAddress: 'ip_address',
			userAgent: 'user_agent',
			errorData: 'error_data'
		};
	}

	static fromArray(obj) {
		const audit = new this();

		for (const [key, value] of Object.entries(Audit.getFieldMapping())) {
			audit[key] = obj[value] ?? audit[key];
		}

		return audit;
	}

	static getFieldNameFromKey(key) {
        return this.getFieldMapping()[key] ?? '';
    }
}
