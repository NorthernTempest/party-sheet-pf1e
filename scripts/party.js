import c from './constants.js';

export class PartySheet extends game.pf1.applications.ActorSheetPFNPC {
	static DEFAULT_TOKEN = "icons/svg/mystery-man.svg";

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["pf1 sheet actor npc npc-sheet pf1e-party-sheet"],
			width: 780,
			height: 400,
			dragDrop: [{ dropSelector: null }]
		});
	}

	selectedSave = "";
	selectedSkill = "";

	get template() {
		return "modules/party-sheet-pf1e/templates/party.hbs";
	}

	async getData() {
		const context = await super.getData();

		// # Get Party Members Sheet Data
		// ## Get player data
		let partyMembers = this.actor.getFlag(c.module, c.partyMembers);
		context.partyMembers = [];

		if (partyMembers) {
			partyMembers.forEach(member => {
				context.partyMembers.push(game.actors.get(member));
			});
		}

		Hooks.on('updateActor', this._onUpdateActor);

		this.selectedSave = "fort";
		this.selectedSkill = "acr";

		if (c.debug) console.log("Party Sheet PF1e | getData", context);

		return context;
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
		event.preventDefault();

		let mId = event.currentTarget.value;

		const partyMembers = this.actor.getFlag(c.module, c.partyMembers);

		partyMembers.splice(mId, 1);

		this.actor.setFlag(c.module, c.partyMembers, partyMembers);

		if (c.debug) console.log("Party Sheet PF1e | _onMemberDelete", mId);
	}

	async _onChangeSaveType(event) {
		event.preventDefault();
		this.selectedSave = event.target.options[event.target.options.selectedIndex].value;

		if (c.debug) console.log("Party Sheet PF1e | _onChangeSaveType", this.selectedSave);
	}

	async _onAllRollSave(event) {
		event.preventDefault();

		this.actor.getFlag(c.module, c.partyMembers).forEach(member => {
			game.actors.get(member).rollSavingThrow(this.selectedSave, {skipDialog: true});
		})

		if (c.debug) console.log("Party Sheet PF1e | _onAllRollSave");
	}

	async _onChangeSkillType(event) {
		event.preventDefault();
		this.selectedSkill = event.target.options[event.target.options.selectedIndex].value;

		if (c.debug) console.log("Party Sheet PF1e | _onChangeSkillType", this.selectedSkill);
	}

	async _onAllRollSkill(event) {
		event.preventDefault();

		this.actor.getFlag(c.module, c.partyMembers).forEach(member => {
			game.actors.get(member).rollSkill(this.selectedSkill, {skipDialog: true});
		})

		if (c.debug) console.log("Party Sheet PF1e | _onAllRollSkill");
	}

	async _onBlurHP(event) {
		event.preventDefault();

		game.actors.get(this.actor.getFlag(c.module, c.partyMembers)[event.target.id.split('-')[1]]).update({
			'data.attributes.hp.value': parseInt(event.target.value)
		});

		if (c.debug) console.log("Party Sheet PF1e | _onBlurHP", parseInt(event.target.value));
	}

	async _onMemberRightClick(event) {
		event.preventDefault();

		game.actors.get(this.actor.getFlag(c.module, c.partyMembers)[event.currentTarget.id.split('-')[1]]).sheet.render(true);

		if (c.debug) console.log("Party Sheet PF1e | _onMemberRightClick", event);
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.find('.save-select').change(this._onChangeSaveType.bind(this));
		html.find('.roll-save-button').click(this._onAllRollSave.bind(this));
		html.find('.skill-select').change(this._onChangeSkillType.bind(this));
		html.find('.roll-skill-button').click(this._onAllRollSkill.bind(this));

		html.find('.hp-input').blur(this._onBlurHP.bind(this));
		html.find('.remove-member').click(this._onMemberDelete.bind(this));
		html.find('.member-row').contextmenu(this._onMemberRightClick.bind(this));
	}

	async close(options = {}) {
		// clean up hooks
		Hooks.off('updateActor', this._onUpdateActor);

		return super.close();
	}

	_onUpdateActor = (actor, data, options, userId) => {
		const partyMembers = this.actor.getFlag(c.module, c.partyMembers);
		if (partyMembers && partyMembers.length > 0) {
			partyMembers.forEach((member) => {
				if (actor.id == member) {
					this.render();
				}
			})
		}
	}
}