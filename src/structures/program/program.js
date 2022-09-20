const PROGRAM_STATUS_PUBLISHED = 'Publicēts';
const PROGRAM_STATUS_DRAFT = 'Melnraksts';

export class Program {
	/** @type {?int} */
	programId = null;

	/** @type {string} */
	name = '';

	/** @type {string} */
	hash = '';

	/** @type {string} */
	programEKNumber = '';

	/** @type {string} */
	financingSourceName = '';

	/** @type {number|null} */
	financingSourceId = null;

	/** @type {string|Date|null} */
	periodFrom = null;

	/** @type {string|Date|null} */
	periodTo = null;

	/** @type {number} */
	financingAmount = 0.0;

	/** @type {number} */
	remainingFinancing = 0.0;

	/** @type {number} */
	maxFinancing = 0.0;

	/** @type {number} */
	minFinancing = 0.0;

	/** @type {number} */
	remainingFinanceSum = 0.0;

	/** @type {number} */
	actualFinanceSum = 0.0;

	/** @type {string} */
	responsibleEmployeeName = '';

	/** @type {number} */
	responsibleEmployeeId = 0;

	/** @type {string} */
	status = PROGRAM_STATUS_DRAFT;

	/** @type {string} */
	goal = '';

	/** @type {string} */
	goalTargetAudience = '';

	/** @type {boolean} */
	useURMonitoring = false;

	/** @type {boolean} */
	useVIDMonitoring = false;

	/** @type {boolean} */
	useIRMonitoring = false;

	/** @type {ProgramFile[]} */
	programFiles = [];

	/** @type {ProgramContest[]} */
	programContests = [];

	isPublished() {
		return this.status === PROGRAM_STATUS_PUBLISHED;
	}

	setPublished() {
		this.status = PROGRAM_STATUS_PUBLISHED;
	}

	setDraft() {
		this.status = PROGRAM_STATUS_DRAFT;
	}

	toArray() {
		const obj = {};

		for (const [key, value] of Object.entries(Program.getFieldMapping())) {
			obj[value] = this[key];
		}

		if (this.programFiles.length) {
			obj['pielikumi'] = this.programFiles.map((file) => file.toArray());
		}

		if (this.programContests.length) {
			obj['konkursi'] = this.programContests.map((contest) => contest.toArray());
		}

		return obj;
	}

	static fromArray(obj) {
		const program = new this();

		for (const [key, value] of Object.entries(Program.getFieldMapping())) {
			program[key] = obj[value] ?? program[key];
		}

		if (obj['pielikumi']) {
			program.programFiles = obj['pielikumi'].map((file) => ProgramFile.fromArray(file));
		}

		if (obj['konkursi']) {
			program.programContests = obj['konkursi'].map((contest) => ProgramContest.fromArray(contest));
		}

		return program;
	}

	static getFieldNameFromKey(key) {
		return this.getFieldMapping()[key] ?? '';
	}

	static getFieldMapping() {
		return {
			programId: 'id',
			name: 'nosaukums',
			periodFrom: 'sakuma_datums',
			periodTo: 'beigu_datums',
			financingAmount: 'finansejums',
			maxFinancing: 'projekta_finansejums_max',
			minFinancing: 'projekta_finansejums_min',
			remainingFinancing: 'faktiskais_finansejuma_atlikums',
			remainingFinanceSum: 'rezervetais_finansejuma_summa',
			actualFinanceSum: 'faktiskais_finansejuma_summa',
			programEKNumber: 'ek_numurs',
			financingSourceName: 'kla_finansejuma_avots_nosaukums',
			financingSourceId: 'kla_finansejuma_avots_id',
			responsibleEmployeeName: 'adm_lietotajs_vards_uzvards',
			responsibleEmployeeId: 'adm_lietotajs_id',
			status: 'statuss',
			goal: 'merkis',
			goalTargetAudience: 'merka_grupa',
			useURMonitoring: 'ir_ur_monitorings',
			useIRMonitoring: 'ir_fpris_monitorings',
			useVIDMonitoring: 'ir_vid_monitorings'
		};
	}

	static getRequiredFields() {
		return [
			'name',
			'responsibleEmployeeId' // Maybe not required
		];
	}

	static getRequiredPublishFields() {
		return [
			'name',
			'periodFrom',
			'periodTo',
			'financingAmount',
			'financingSourceId',
			'responsibleEmployeeId'
		];
	}
}

export class ProgramFile {
	/** @type {?int} */
	fileId = null;

	/** @type {?int} */
	programId = null;

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

	toArray() {
		const obj = {};

		delete this.createdDate;

		if (!this.programId) {
			delete this.programId;
		}

		for (const [key, value] of Object.entries(ProgramFile.getFieldMapping())) {
			obj[value] = this[key];
		}

		return obj;
	}

	static fromArray(obj) {
		const programFile = new this();

		for (const [key, value] of Object.entries(ProgramFile.getFieldMapping())) {
			programFile[key] = obj[value] ?? programFile[key];
		}

		return programFile;
	}

	static getFieldMapping() {
		return {
			fileId: 'id',
			hash: 'sha_256',
			programId: 'programma_id',
			fileInfoId: 'file_info_id',
			fileName: 'nosaukums',
			fileDescription: 'apraksts',
			isPublishable: 'ir_publicejams',
			fileAuthorId: 'adm_lietotajs_id',
			fileAuthorName: 'adm_lietotajs_vards_uzvards',
			createdDate: 'pievienosanas_datums'
		};
	}
}

export class ProgramContest {
	/** @type {?int} */
	contestId = null;

	/** @type {string} */
	name = '';

	/** @type {string} */
	createdDate = '';

	/** @type {string} */
	endDate = '';

	/** @type {string} */
	responsiblePerson = '';

	static fromArray(objectArray) {
		return Object.assign(new this(), objectArray);
	}

	toArray() {
		const obj = {};

		for (const [key, value] of Object.entries(ProgramContest.getFieldMapping())) {
			obj[value] = this[key];
		}

		return obj;
	}

	static getFieldMapping() {
		return {
			contestId: 'id',
			name: 'programma_id',
			createdDate: 'file_info_id',
			endDate: 'nosaukums',
			responsiblePerson: 'apraksts'
		};
	}
}
