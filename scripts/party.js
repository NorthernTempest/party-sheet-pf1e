import constants from './constants.js';

export class Party extends game.pf1.applications.ActorSheetPFNPC {
	static DEFAULT_TOKEN = "icons/svg/mystery-man.svg";

	get template() {
		return "modules/party-sheet-pf1e/templates/party.hbs";
	}

	static get defaultOptions() {
		const options = super.defaultOptions;

		mergeObject(options, {
			classes: ["pf1 sheet actor npc npc-sheet pf1e-party-sheet"],
			width: 850,
			height: 750
		});

		return options;
	}

	async getData() {
		console.log( "Party Sheet PF1e | getData" );

		const sheetData = await super.getData();

		return sheetData;
	}
}