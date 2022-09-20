export class User {
	/** @type {int} */
	userId = null;

	/** @type {string} */
	name = null;

	/** @type {string} */
	surname = null;

	/** @type {string} */
	phoneNr = null;

  /** @type {string} */
  personalCode = null;

  /** @type {string} */
  notes = null;

	/** @type {boolean} */
	status = 'Aktīvs';

	/** @type {boolean} */
  sendPwdEmail = false;

  /** @type {boolean} */
  isWithoutPersonId = false;

  /** @type {boolean} */
  isExpert = false;

	/** @type {string} */
	email = null;

	/** @type {string} */
  pwd = null;

  /** @type {UserRole[]} */
  userRoles = [];

  /** @type {UserOrg[]} */
  userOrgs = [];

	toArray() {
		const obj = {};

		for (const [key, value] of Object.entries(User.getFieldMapping())) {
			obj[value] = this[key];
		}

		if (this.userRoles.length) {
      obj['lomas'] = this.userRoles.map((userRole) => userRole.toArray());
    }

    if (this.userOrgs.length) {
      obj['uznemumi'] = this.userOrgs.map((userOrg) => userOrg.toArray());
    }

		return obj;
	}

	static fromArray(obj) {
		const user = new this();

		for (const [key, value] of Object.entries(User.getFieldMapping())) {
			user[key] = obj[value] ?? user[key];
		}

		if (obj['lomas']) {
      user.userRoles = obj['lomas'].map((userRole) => UserRole.fromArray(userRole));
    }

    if (obj['uznemumi']) {
      user.userOrgs = obj['uznemumi'].map((userOrg) => UserOrg.fromArray(userOrg));
    }

		return user;
	}

	static getFieldNameFromKey(key) {
		return this.getFieldMapping()[key] ?? '';
	}

	static getFieldMapping() {
		return {
			userId: 'id',
			name: 'vards',
			surname: 'uzvards',
			phoneNr: 'telefons',
			personalCode: 'personas_kods',
			notes: 'piezimes',
			status: 'statuss',
			isWithoutPersonId: 'bez_personas_identifikatora',
			isExpert: 'ir_eksperts',
			email: 'epasts',
			sendPwdEmail: 'nosutit_paroli',
			pwd: 'parole'
		};
	}


	static getRequiredFields() {
		return [
      'name',
      'surname',
      'email'
		];
	}
}

export class UserRole {
	/** @type {int} */
	userRoleId = null;

	/** @type {string} */
	role = null;

	/** @type {string|Date|null} */
	dateFrom = null;

	/** @type {string|Date|null} */
	dateTo = null;

	/** @type {string} */
	country = null;

	/** @type {string} */
	orgNr = null;

	/** @type {int} */
	userId = null;

	toArray() {
		const obj = {};

		for (const [key, value] of Object.entries(UserRole.getFieldMapping())) {
			obj[value] = this[key];
		}

		return obj;
	}

	static fromArray(obj) {
		const userRole = new this();

		for (const [key, value] of Object.entries(UserRole.getFieldMapping())) {
			userRole[key] = obj[value] ?? userRole[key];
		}

		return userRole;
	}

	static getFieldMapping() {
		return {
		  userRoleId: 'id',
		  userId: 'adm_lietotajs_id',
			role: 'adm_loma',
			dateFrom: 'datums_no',
			dateTo: 'datums_lidz',
			country: 'valsts',
			orgNr: 'uznemuma_reg_nr'
		};
	}

	static getRequiredFields() {
    return [
      'role',
      'dateFrom'
    ];
  }
}

export class UserOrg {
	/** @type {int} */
	userOrgId = null;

	/** @type {string} */
	title = null;

	/** @type {string} */
  regNr = null;

	/** @type {string|Date|null} */
	dateFrom = null;

	/** @type {string|Date|null} */
	dateTo = null;

	/** @type {boolean} */
	isFromUr = false;

	toArray() {
		const obj = {};

		for (const [key, value] of Object.entries(UserOrg.getFieldMapping())) {
			obj[value] = this[key];
		}

		return obj;
	}

	static fromArray(obj) {
		const userOrg = new this();

		for (const [key, value] of Object.entries(UserOrg.getFieldMapping())) {
			userOrg[key] = obj[value] ?? userOrg[key];
		}

		return userOrg;
	}

	static getFieldMapping() {
		return {
		  userOrgId: 'id',
		  userId: 'adm_lietotajs_id',
			title: 'nosaukums',
			regNr: 'registracijas_nr',
			dateFrom: 'datums_no',
			dateTo: 'datums_lidz',
			isFromUr: 'ir_no_ur'
		};
	}

	static getRequiredFields() {
    return [
      'title',
      'dateFrom'
    ];
  }
}
