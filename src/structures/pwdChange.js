export class PwdChange {
	/** @type {string} */
	pwdOld = null;

	/** @type {string} */
	pwdNew = null;

	/** @type {string} */
  pwdRepeat = null;

	toArray() {
		const obj = {};

		for (const [key, value] of Object.entries(PwdChange.getFieldMapping())) {
			obj[value] = this[key];
		}

		return obj;
	}

	static fromArray(obj) {
		const pwdChange = new this();

		for (const [key, value] of Object.entries(PwdChange.getFieldMapping())) {
			pwdChange[key] = obj[value] ?? pwdChange[key];
		}

		return pwdChange;
	}

	static getFieldMapping() {
		return {
		  pwdOld: 'p_old',
		  pwdNew: 'p_new',
			pwdRepeat: 'p_repeat'
		};
	}

	static getRequiredFields() {
    return [
      'pwdOld',
      'pwdNew',
      'pwdRepeat'
    ];
  }
}