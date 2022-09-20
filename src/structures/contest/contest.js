const CONTEST_STATUS_PUBLISHED = 'Publicēts';
const CONTEST_STATUS_DRAFT = 'Sagatavošanā';

export class Contest {
	/** @type {?number} */
	contestId = null;

	/** @type {?number} */
	programId = null;

	/** @type {number|null} */
	number = null;

	/** @type {string} */
	name = '';

	/** @type {number} */
	// Not sure about status name and ID mapping
	statusId = 3466837;

	/** @type {string} */
	statusName = CONTEST_STATUS_DRAFT;

	/** @type {number|null} */
	totalFinancing = null;

	/** @type {number|null} */
	actualFinancing = null;

	/** @type {number|null} */
	allocatedFinancing = null;

	/** @type {number|null} */
	minFinancing = null;

	/** @type {number|null} */
	maxFinancing = null;

	/** @type {string|Date|null} */
	startDate = null;

	/** @type {string|Date|null} */
	endDate = null;

	/** @type {string|Date|null} */
	publishingTime = null;

	/** @type {string|Date|null} */
	submissionTime = null;

	/** @type {string|null} */
	target = '';

	/** @type {string|null} */
	targetGroup = '';

	/** @type {string|null} */
	expenseAccounting = '';

	/** @type {string|null} */
	applicants = '';

	/** @type {boolean} */
	withoutInitialEstimate = false;

	/** @type {boolean} */
	closedContest = false;

	/** @type {Users[]} */
	users = [];

	/** @type {ContestFile[]} */
	contestFiles = [];

	/** @type {string|null} */
	programName = '';

	/** @type {string|null} */
	faq = '';

	isPublished() {
		return this.statusName === CONTEST_STATUS_PUBLISHED;
	}

	isDraft() {
		return this.statusName === CONTEST_STATUS_DRAFT;
	}

	setPublished() {
		this.statusName = CONTEST_STATUS_PUBLISHED;
	}

	setDraft() {
		this.statusName = CONTEST_STATUS_DRAFT;
	}

	toArray() {
		const obj = {};

		for (const [key, value] of Object.entries(Contest.getFieldMapping())) {
			obj[value] = this[key];
		}

		if (this.contestFiles.length) {
			obj['pielikumi'] = this.contestFiles.map((file) => file.toArray());
		}

		if (this.users.length) {
			obj['lietotaji'] = this.users.map((user) => user.toArray());
		}

		return obj;
	}

	static fromArray(obj) {
		const contest = new this();

		for (const [key, value] of Object.entries(Contest.getFieldMapping())) {
			contest[key] = obj[value] ?? contest[key];
		}

		if (obj['pielikumi']) {
			contest.contestFiles = obj['pielikumi'].map((file) => ContestFile.fromArray(file));
		}

		if (obj['lietotaji']) {
			contest.users = obj['lietotaji'].map((user) => Users.fromArray(user));
		}

		return contest;
	}

	static getFieldNameFromKey(key) {
		return this.getFieldMapping()[key] ?? '';
	}

	static getFieldMapping() {
		return {
			contestId: 'id',
			programId: 'programma_id',
			number: 'numurs',
			name: 'nosaukums',
			statusId: 'statuss_id',
			statusName: 'statuss_nosaukums',
			totalFinancing: 'kopejais_finansejums',
			actualFinancing: 'faktiskais_finansejums',
			allocatedFinancing: 'pieskirtais_finansejums',
			minFinancing: 'min_finansejums',
			maxFinancing: 'max_finansejums',
			startDate: 'sakuma_datums',
			endDate: 'beigu_datums',
			publishingTime: 'izsludinasanas_laiks',
			submissionTime: 'iesniegsanas_laiks',
			target: 'merkis',
			targetGroup: 'merka_grupa',
			expenseAccounting: 'izdevumu_attiecinamiba',
			applicants: 'pretendenti',
			withoutInitialEstimate: 'nav_sakotnejas_tames',
			closedContest: 'ir_slegts_konkurss',
			programName: 'programmas_nosaukums',
			faq: 'biezak_uzdotie_jautajumi'
		};
	}
}

export class Users {
	/** @type {?number} */
	userId = null;

	/** @type {string} */
	userName = '';

	toArray() {
		const obj = {};

		for (const [key, value] of Object.entries(Users.getFieldMapping())) {
			obj[value] = this[key];
		}

		return obj;
	}

	static fromArray(obj) {
		const user = new this();

		for (const [key, value] of Object.entries(Users.getFieldMapping())) {
			user[key] = obj[value] ?? user[key];
		}

		return user;
	}

	static getFieldMapping() {
		return {
			userId: 'adm_lietotajs_id',
			userName: 'adm_lietotajs_vards_uzvards'
		};
	}
}

export class ContestFile {
	/** @type {?int} */
	id = null;

	/** @type {?int} */
	fileInfoId = null;

	/** @type {string} */
	fileName = '';

	/** @type {string} */
	fileDescription = '';

	/** @type {boolean} */
	isPublishable = false;

	/** @type {string} */
	fileAuthorName = '';

	/** @type {number} */
	fileAuthorId = 0;

	/** @type {string} */
	createdDate = '';

	/** @type {string} */
	hash = '';

	/** @type {?number} */
	contestId = null;

	toArray() {
		const obj = {};

		for (const [key, value] of Object.entries(ContestFile.getFieldMapping())) {
			obj[value] = this[key];
		}

		return obj;
	}

	static fromArray(obj) {
		const contestFile = new this();

		for (const [key, value] of Object.entries(ContestFile.getFieldMapping())) {
			contestFile[key] = obj[value] ?? contestFile[key];
		}

		return contestFile;
	}

	static getFieldMapping() {
		return {
			id: 'id',
			fileDescription: 'apraksts',
			fileInfoId: 'file_info_id',
			fileName: 'nosaukums',
			hash: 'sha_256',
			fileAuthorId: 'adm_lietotajs_id',
			createdDate: 'pievienosanas_datums',
			fileAuthorName: 'adm_lietotajs_vards_uzvards',
			isPublishable: 'ir_publicejams',
			contestId: 'konkurss_id'
		};
	}
}
