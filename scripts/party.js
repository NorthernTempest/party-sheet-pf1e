import c from './constants.js';

export class PartySheet extends game.pf1.applications.ActorSheetPFNPC {
	static DEFAULT_TOKEN = "icons/svg/mystery-man.svg";

	get template() {
		return "modules/party-sheet-pf1e/templates/party.hbs";
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["pf1 sheet actor npc npc-sheet pf1e-party-sheet"],
			width: 850,
			height: 750,
			dragDrop: [{ dropSelector: null }]
		});
	}

	async getData() {
		const data = await super.getData();

		let partyMembers = this.actor.getFlag(c.module, c.partyMembers);

		data.partyMembers = [];

		if (!!partyMembers) {
			partyMembers.forEach(member => {
				data.partyMembers.push(game.actors.get(member));
			});
		}

		if (c.debug) console.log("Party Sheet PF1e | getData", data);

		return data;
	}

	/* Stolen wholesale from https://gitlab.com/koboldworks/pf1/actor-link/-/blob/master/module/dialog.mjs#L103-114 */
	async _onDrop(event) {
		let data;

		try {
			data = JSON.parse(event.dataTransfer.getData('text/plain'));
		} catch (err) {
			console.error(err);
			return false;
		}

		if (c.debug) console.log("Party Sheet PF1e | _onDrop", data);

		if (data.type === 'Actor') {

			if (c.debug) console.log("Party Sheet PF1e | _onDrop", "success");

			let partyMembers = this.actor.getFlag(c.module, c.partyMembers);

			if (!partyMembers)
				partyMembers = [];

			partyMembers.push(data.id);

			this.actor.setFlag(c.module, c.partyMembers, partyMembers);
		}
	}

	async _onMemberDelete(event) {
		event.preventDefault;

		let mId = event.currentTarget.value;

		if(c.debug) console.log("Party Sheet PF1e | _onElementDelete", mId);

		const partyMembers = this.actor.getFlag(c.module, c.partyMembers);

		partyMembers.splice(mId, 1);

		this.actor.setFlag(c.module, c.partyMembers, partyMembers);
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.find('.remove-member').click(this._onMemberDelete.bind(this));
	}
}