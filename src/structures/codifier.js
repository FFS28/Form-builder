export class Codifier {
	/** @type {?number} */
	id = null;

	/** @type {string} */
	title = '';

	/** @type {string} */
  code = '';

  /** @type {boolean} */
  isSystem = false;

	static getFieldMapping() {
		return {
			id: 'id',
			title: 'nosaukums',
			code: 'kods',
			isSystem: 'ir_sistemas',
		};
	}

	static fromArray(obj) {
		const audit = new this();

		for (const [key, value] of Object.entries(Codifier.getFieldMapping())) {
			audit[key] = obj[value] ?? audit[key];
		}

		return audit;
	}

	static getFieldNameFromKey(key) {
		return this.getFieldMapping()[key] ?? '';
	}
}
